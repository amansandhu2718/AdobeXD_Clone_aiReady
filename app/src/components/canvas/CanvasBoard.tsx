import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import Konva from 'konva'
import {
  Circle as KonvaCircle,
  Ellipse,
  Group,
  Image as KonvaImage,
  Layer,
  Line,
  Rect,
  Stage,
  Text,
  Transformer,
} from 'react-konva'
import { downloadDataUrl } from '../../lib/download'
import { useCanvasImage } from '../../lib/image'
import {
  getSelectedFrame,
  getSelectedElement,
  useEditorStore,
} from '../../store/editorStore'
import type { DesignElement, Frame } from '../../types/project'

export interface CanvasBoardHandle {
  exportSelectedFrame: (options?: ExportImageOptions) => boolean
  exportAllFrames: (options?: ExportImageOptions) => number
  exportMarkedAssets: (options?: ExportImageOptions) => number
  exportSelectedAsset: (options?: ExportImageOptions) => boolean
}

interface AlignmentGuide {
  orientation: 'vertical' | 'horizontal'
  position: number
}

interface ElementBounds {
  id: string
  visible: boolean
  x: number
  y: number
  width: number
  height: number
}

interface ElementOverlay {
  frame: Frame
  element: DesignElement
  x: number
  y: number
}

interface TextEditingState {
  frameId: string
  elementId: string
  value: string
  x: number
  y: number
  width: number
  height: number
  fontFamily: string
  fontSize: number
  fontWeight: number
  lineHeight: number
  letterSpacing: number
  color: string
  align: 'left' | 'center' | 'right'
}

export interface ExportImageOptions {
  format?: 'png' | 'jpeg'
  pixelRatio?: number
  quality?: number
}

export const CanvasBoard = forwardRef<CanvasBoardHandle>(function CanvasBoard(_, ref) {
  const stageRef = useRef<Konva.Stage>(null)
  const shellRef = useRef<HTMLElement>(null)
  const transformerRef = useRef<Konva.Transformer>(null)
  const nodeRefs = useRef<Record<string, Konva.Node | null>>({})
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 })
  const [cropEditingId, setCropEditingId] = useState<string | undefined>()
  const [textEditing, setTextEditing] = useState<TextEditingState | undefined>()
  const [guides, setGuides] = useState<Record<string, AlignmentGuide[]>>({})
  const textEditorRef = useRef<HTMLTextAreaElement>(null)
  const file = useEditorStore((state) => state.file)
  const selection = useEditorStore((state) => state.selection)
  const tool = useEditorStore((state) => state.tool)
  const zoom = useEditorStore((state) => state.zoom)
  const showGrid = useEditorStore((state) => state.showGrid)
  const snapToObjects = useEditorStore((state) => state.snapToObjects)
  const snapThreshold = useEditorStore((state) => state.snapThreshold)
  const adjustSelectedRadius = useEditorStore((state) => state.adjustSelectedRadius)
  const updateSelectedImageCrop = useEditorStore((state) => state.updateSelectedImageCrop)
  const selectFrame = useEditorStore((state) => state.selectFrame)
  const selectElement = useEditorStore((state) => state.selectElement)
  const toggleElementSelection = useEditorStore((state) => state.toggleElementSelection)
  const updateElement = useEditorStore((state) => state.updateElement)
  const selectedFrame = getSelectedFrame(file, selection.frameId)
  const selectedElement = getSelectedElement(file, selection)
  const selectedElementIds = useMemo(
    () =>
      selection.elementIds?.length
        ? selection.elementIds
        : selection.elementId
          ? [selection.elementId]
          : [],
    [selection.elementId, selection.elementIds],
  )
  const framesToRender = file.project.pages.flatMap((page) => page.frames)
  const [stagePosition, setStagePosition] = useState({ x: 40, y: 20 })

  useLayoutEffect(() => {
    const shell = shellRef.current
    if (!shell) return
    const update = () => {
      const rect = shell.getBoundingClientRect()
      setStageSize({
        width: Math.max(320, Math.floor(rect.width)),
        height: Math.max(320, Math.floor(rect.height)),
      })
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(shell)
    return () => observer.disconnect()
  }, [])

  useLayoutEffect(() => {
    const shell = shellRef.current
    if (!shell) return
    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return
      event.preventDefault()
      event.stopPropagation()
      useEditorStore
        .getState()
        .setZoom(useEditorStore.getState().zoom + (event.deltaY > 0 ? -0.05 : 0.05))
    }
    shell.addEventListener('wheel', onWheel, { passive: false })
    return () => shell.removeEventListener('wheel', onWheel)
  }, [])

  const exportFrame = useCallback((frame: Frame, options?: ExportImageOptions) => {
    const frameNode = nodeRefs.current[`frame-${frame.id}`]
    if (!frameNode) return false
    try {
      const format = options?.format ?? 'png'
      const dataUrl = frameNode.toDataURL({
        x: 0,
        y: 0,
        width: frame.width,
        height: frame.height,
        pixelRatio: options?.pixelRatio ?? 2,
        mimeType: format === 'jpeg' ? 'image/jpeg' : 'image/png',
        quality: options?.quality ?? 0.92,
      })
      downloadDataUrl(`${frame.name}.${format === 'jpeg' ? 'jpg' : 'png'}`, dataUrl)
      return true
    } catch {
      return false
    }
  }, [])

  const exportElement = useCallback((element: DesignElement, options?: ExportImageOptions) => {
    const node = nodeRefs.current[element.id]
    if (!node) return false
    try {
      const format = options?.format ?? 'png'
      const dataUrl = node.toDataURL({
        pixelRatio: options?.pixelRatio ?? 2,
        mimeType: format === 'jpeg' ? 'image/jpeg' : 'image/png',
        quality: options?.quality ?? 0.92,
      })
      downloadDataUrl(`${element.name}.${format === 'jpeg' ? 'jpg' : 'png'}`, dataUrl)
      return true
    } catch {
      return false
    }
  }, [])

  useImperativeHandle(ref, () => ({
    exportSelectedFrame(options) {
      if (!selection.frameId) return false
      const frame = getSelectedFrame(file, selection.frameId)
      return frame ? exportFrame(frame, options) : false
    },
    exportAllFrames(options) {
      return framesToRender.reduce((count, frame) => (exportFrame(frame, options) ? count + 1 : count), 0)
    },
    exportMarkedAssets(options) {
      let count = 0
      for (const frame of framesToRender) {
        for (const element of flattenElements(frame.elements)) {
          if (element.markForExport && exportElement(element, options)) count += 1
        }
      }
      return count
    },
    exportSelectedAsset(options) {
      if (!selection.elementId) return false
      const element = framesToRender.flatMap((frame) => flattenElements(frame.elements)).find(
        (candidate) => candidate.id === selection.elementId,
      )
      return element ? exportElement(element, options) : false
    },
  }))

  const registerNode = useCallback((id: string, node: Konva.Node | null) => {
    nodeRefs.current[id] = node
  }, [])

  useLayoutEffect(() => {
    const transformer = transformerRef.current
    if (!transformer) return
    const selectedNodes = selectedElementIds
      .filter((elementId) => cropEditingId !== elementId)
      .map((elementId) => nodeRefs.current[elementId])
      .filter((node): node is Konva.Node => Boolean(node))
    transformer.nodes(selectedNodes)
    transformer.getLayer()?.batchDraw()
  }, [selectedElementIds, cropEditingId, file])

  useEffect(() => {
    if (!textEditing) return
    const editor = textEditorRef.current
    editor?.focus()
    editor?.select()
  }, [textEditing])

  const commitTextEditing = useCallback(() => {
    if (!textEditing) return
    updateElement(textEditing.frameId, textEditing.elementId, {
      content: textEditing.value,
      height: Math.max(textEditing.height, Math.ceil(textEditing.value.split('\n').length * textEditing.fontSize * textEditing.lineHeight)),
    })
    setTextEditing(undefined)
  }, [textEditing, updateElement])

  const beginTextEditing = useCallback((frameId: string, element: DesignElement, x: number, y: number) => {
    const typography = element.style.typography
    setCropEditingId(undefined)
    setTextEditing({
      frameId,
      elementId: element.id,
      value: element.content ?? '',
      x,
      y,
      width: element.width,
      height: Math.max(element.height, typography?.fontSize ?? 18),
      fontFamily: typography?.fontFamily ?? 'Inter',
      fontSize: typography?.fontSize ?? 18,
      fontWeight: typography?.fontWeight ?? 500,
      lineHeight: typography?.lineHeight ?? 1.2,
      letterSpacing: typography?.letterSpacing ?? 0,
      color: typography?.color ?? '#111827',
      align: typography?.align ?? 'left',
    })
  }, [])

  return (
    <section
      className="canvas-shell"
      ref={shellRef}
      style={{ cursor: tool === 'hand' ? 'grab' : undefined }}
      onDragOver={(event) => {
        event.preventDefault()
      }}
      onDrop={(event) => {
        event.preventDefault()
        const target = document.elementFromPoint(event.clientX, event.clientY)
        if (!target?.closest('.canvas-shell')) return
        const fileDrop = event.dataTransfer.files[0]
        const urlDrop = event.dataTransfer.getData('text/uri-list') || event.dataTransfer.getData('text/plain')
        const applyImage = (src: string) => {
          const stage = stageRef.current
          const frame = selectedFrame
          if (!stage || !frame) return
          const pointer = stage.getPointerPosition()
          if (!pointer) return
          const localX = (pointer.x - stage.x()) / zoom - frame.x
          const localY = (pointer.y - stage.y()) / zoom - frame.y
          const targetElement = findTopElementAtPoint(frame.elements, localX, localY)
          if (targetElement && targetElement.type !== 'text' && targetElement.type !== 'line') {
            updateElement(frame.id, targetElement.id, {
              src,
              style: {
                ...targetElement.style,
                imageFit: 'cover',
                imageCrop: { x: 0, y: 0, scale: 1 },
              },
            })
            selectElement(frame.id, targetElement.id)
            return
          }
          const fallbackId = selection.elementId
          if (fallbackId) {
            const fallback = getSelectedElement(file, selection)
            if (fallback && fallback.type !== 'text' && fallback.type !== 'line') {
              updateElement(frame.id, fallback.id, {
                src,
                style: { ...fallback.style, imageFit: 'cover', imageCrop: { x: 0, y: 0, scale: 1 } },
              })
            }
          }
        }
        if (fileDrop && fileDrop.type.startsWith('image/')) {
          const reader = new FileReader()
          reader.onload = () => applyImage(String(reader.result))
          reader.readAsDataURL(fileDrop)
          return
        }
        if (urlDrop) applyImage(urlDrop.trim())
      }}
    >
      <div className="canvas-hud">
        <strong>Design</strong>
        <span>{Math.round(zoom * 100)}%</span>
        <span>{selectedFrame ? selectedFrame.name : 'No frame selected'}</span>
      </div>
      {selectedElement && selectedElement.type !== 'text' && (
        <div className="canvas-quickbar">
          <span>Radius {selectedElement.style.cornerRadius.topLeft}px</span>
          <button className="command-button" onClick={() => adjustSelectedRadius(-2)} type="button">
            -
          </button>
          <button className="command-button" onClick={() => adjustSelectedRadius(2)} type="button">
            +
          </button>
          {selectedElement.src && (
            <span className="subtle">
              {cropEditingId === selectedElement.id ? 'Double-click image to finish crop' : 'Double-click image to crop'}
            </span>
          )}
          {selectedElement.src && cropEditingId === selectedElement.id && (
            <>
              <button
                className="command-button"
                onClick={() =>
                  updateSelectedImageCrop({
                    scale: (selectedElement.style.imageCrop?.scale ?? 1) - 0.1,
                  })
                }
                type="button"
              >
                Image -
              </button>
              <button
                className="command-button"
                onClick={() =>
                  updateSelectedImageCrop({
                    scale: (selectedElement.style.imageCrop?.scale ?? 1) + 0.1,
                  })
                }
                type="button"
              >
                Image +
              </button>
            </>
          )}
        </div>
      )}
      <Stage
        className="konva-stage-wrap"
        height={stageSize.height}
        onMouseDown={(event) => {
          if (tool === 'hand') return
          if (event.target === event.target.getStage()) {
            useEditorStore.getState().clearSelection()
          }
        }}
        ref={stageRef}
        scaleX={zoom}
        scaleY={zoom}
        width={stageSize.width}
        x={stagePosition.x}
        y={stagePosition.y}
        draggable={tool === 'hand'}
        onDragEnd={(event) => {
          if (tool !== 'hand') return
          setStagePosition({ x: event.target.x(), y: event.target.y() })
        }}
        onDragMove={(event) => {
          if (tool !== 'hand') return
          setStagePosition({ x: event.target.x(), y: event.target.y() })
        }}
      >
        <Layer>
          {framesToRender.map((frame) => (
            <FrameNode
              frame={frame}
              key={frame.id}
              registerNode={registerNode}
              onElementChange={(elementId, patch) => updateElement(frame.id, elementId, patch)}
              onElementSelect={(elementId) => {
                selectElement(frame.id, elementId)
              }}
              onElementToggleSelect={(elementId) => {
                toggleElementSelection(frame.id, elementId)
              }}
              onFrameSelect={() => selectFrame(frame.id)}
              selectedElementIds={selectedElementIds}
              selectedFrameId={selection.frameId}
              cropEditingId={cropEditingId}
              textEditingId={textEditing?.elementId}
              onCropEditChange={setCropEditingId}
              onTextEdit={(element, x, y) => beginTextEditing(frame.id, element, x, y)}
              guides={guides[frame.id] ?? []}
              onGuidesChange={(nextGuides) =>
                setGuides((current) => ({ ...current, [frame.id]: nextGuides }))
              }
              showGrid={showGrid}
              snapToObjects={snapToObjects}
              snapThreshold={snapThreshold}
              tool={tool}
            />
          ))}
          {selectedElementIds
            .map((elementId) => findElementOverlay(framesToRender, elementId))
            .filter((overlay): overlay is ElementOverlay => Boolean(overlay))
            .filter((overlay) => cropEditingId !== overlay.element.id && textEditing?.elementId !== overlay.element.id)
            .map((overlay) => (
              <SelectionOverlay key={`selection-${overlay.element.id}`} overlay={overlay} />
            ))}
          <Transformer
            anchorFill="#ffffff"
            anchorStroke="#7b2fff"
            borderEnabled={false}
            borderStroke="#7b2fff"
            ignoreStroke
            ref={transformerRef}
            rotateEnabled
          />
        </Layer>
      </Stage>
      {textEditing && (
        <textarea
          className="canvas-text-editor"
          onBlur={commitTextEditing}
          onChange={(event) =>
            setTextEditing((current) =>
              current
                ? {
                    ...current,
                    value: event.target.value,
                  }
                : current,
            )
          }
          onKeyDown={(event) => {
            event.stopPropagation()
            if (event.key === 'Escape') {
              event.preventDefault()
              setTextEditing(undefined)
              return
            }
            if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
              event.preventDefault()
              commitTextEditing()
            }
          }}
          ref={textEditorRef}
          spellCheck={false}
          style={{
            color: textEditing.color,
            fontFamily: textEditing.fontFamily,
            fontSize: textEditing.fontSize * zoom,
            fontWeight: textEditing.fontWeight,
            height: Math.max(28, textEditing.height * zoom),
            left: stagePosition.x + (selectedFrame?.x ?? 0) * zoom + textEditing.x * zoom,
            letterSpacing: textEditing.letterSpacing * zoom,
            lineHeight: String(textEditing.lineHeight),
            textAlign: textEditing.align,
            top: stagePosition.y + (selectedFrame?.y ?? 0) * zoom + textEditing.y * zoom,
            width: Math.max(36, textEditing.width * zoom),
          }}
          value={textEditing.value}
        />
      )}
    </section>
  )
})

interface FrameNodeProps {
  frame: Frame
  registerNode: (id: string, node: Konva.Node | null) => void
  selectedFrameId?: string
  selectedElementIds: string[]
  onFrameSelect: () => void
  onElementSelect: (elementId: string) => void
  onElementToggleSelect: (elementId: string) => void
  onElementChange: (elementId: string, patch: Partial<DesignElement>) => void
  cropEditingId?: string
  textEditingId?: string
  onCropEditChange: (elementId: string | undefined) => void
  onTextEdit: (element: DesignElement, x: number, y: number) => void
  guides: AlignmentGuide[]
  onGuidesChange: (guides: AlignmentGuide[]) => void
  showGrid: boolean
  snapToObjects: boolean
  snapThreshold: number
  tool: string
}

function flattenElements(elements: DesignElement[]): DesignElement[] {
  return elements.flatMap((element) => [element, ...flattenElements(element.children ?? [])])
}

function findTopElementAtPoint(elements: DesignElement[], x: number, y: number): DesignElement | undefined {
  for (const element of [...elements].reverse()) {
    if (!element.visible) continue
    if (x >= element.x && x <= element.x + element.width && y >= element.y && y <= element.y + element.height) {
      const child = findTopElementAtPoint(element.children ?? [], x - element.x, y - element.y)
      return child ?? element
    }
  }
  return undefined
}

function flattenElementBounds(elements: DesignElement[], offsetX = 0, offsetY = 0): ElementBounds[] {
  return elements.flatMap((element) => {
    const bounds = {
      id: element.id,
      visible: element.visible,
      x: offsetX + element.x,
      y: offsetY + element.y,
      width: element.width,
      height: element.height,
    }
    return [bounds, ...flattenElementBounds(element.children ?? [], bounds.x, bounds.y)]
  })
}

function flattenElementOverlays(frame: Frame, elements: DesignElement[], offsetX = 0, offsetY = 0): ElementOverlay[] {
  return elements.flatMap((element) => {
    const x = offsetX + element.x
    const y = offsetY + element.y
    const overlay = {
      frame,
      element,
      x: frame.x + x,
      y: frame.y + y,
    }
    return [overlay, ...flattenElementOverlays(frame, element.children ?? [], x, y)]
  })
}

function findElementOverlay(frames: Frame[], elementId: string) {
  for (const frame of frames) {
    const overlay = flattenElementOverlays(frame, frame.elements).find((candidate) => candidate.element.id === elementId)
    if (overlay) return overlay
  }
  return undefined
}

function SelectionOverlay({ overlay }: { overlay: ElementOverlay }) {
  const { element } = overlay
  const stroke = '#7b2fff'
  if (element.type === 'ellipse') {
    return (
      <Ellipse
        listening={false}
        radiusX={element.width / 2}
        radiusY={element.height / 2}
        stroke={stroke}
        strokeWidth={1}
        x={overlay.x + element.width / 2}
        y={overlay.y + element.height / 2}
      />
    )
  }
  if (element.type === 'line') {
    return (
      <Line
        listening={false}
        points={[overlay.x, overlay.y, overlay.x + element.width, overlay.y + element.height]}
        stroke={stroke}
        strokeWidth={1}
      />
    )
  }
  return (
    <Rect
      cornerRadius={[
        element.style.cornerRadius.topLeft,
        element.style.cornerRadius.topRight,
        element.style.cornerRadius.bottomRight,
        element.style.cornerRadius.bottomLeft,
      ]}
      height={element.height}
      listening={false}
      rotation={element.rotation}
      stroke={stroke}
      strokeWidth={1}
      width={element.width}
      x={overlay.x}
      y={overlay.y}
    />
  )
}

function FrameGrid({ frame }: { frame: Frame }) {
  const minor = 8
  const major = 64
  const verticalLines = []
  const horizontalLines = []
  for (let x = minor; x < frame.width; x += minor) {
    verticalLines.push(
      <Line
        key={`grid-v-${x}`}
        points={[x, 0, x, frame.height]}
        stroke={x % major === 0 ? '#dedaf0' : '#f0eef7'}
        strokeWidth={1}
      />,
    )
  }
  for (let y = minor; y < frame.height; y += minor) {
    horizontalLines.push(
      <Line
        key={`grid-h-${y}`}
        points={[0, y, frame.width, y]}
        stroke={y % major === 0 ? '#dedaf0' : '#f0eef7'}
        strokeWidth={1}
      />,
    )
  }
  return (
    <Group listening={false}>
      {verticalLines}
      {horizontalLines}
    </Group>
  )
}

function FrameNode({
  frame,
  registerNode,
  selectedFrameId,
  selectedElementIds,
  onFrameSelect,
  onElementSelect,
  onElementToggleSelect,
  onElementChange,
  cropEditingId,
  textEditingId,
  onCropEditChange,
  onTextEdit,
  guides,
  onGuidesChange,
  showGrid,
  snapToObjects,
  snapThreshold,
  tool,
}: FrameNodeProps) {
  const hasSelectedElement = selectedElementIds.length > 0
  return (
    <Group
      id={`frame-${frame.id}`}
      onClick={(event) => {
        if (event.target.attrs.id === `frame-bg-${frame.id}`) onFrameSelect()
      }}
      ref={(node) => {
        registerNode(`frame-${frame.id}`, node)
      }}
      x={frame.x}
      y={frame.y}
    >
      <Text fill="#5f6368" fontSize={13} text={frame.name} x={0} y={-24} />
      <Rect
        fill={frame.background}
        height={frame.height}
        id={`frame-bg-${frame.id}`}
        shadowBlur={selectedFrameId === frame.id && !hasSelectedElement ? 12 : 0}
        shadowColor="#7b2fff"
        shadowOpacity={0.2}
        stroke={selectedFrameId === frame.id && !hasSelectedElement ? '#7b2fff' : '#d0d0d0'}
        strokeWidth={1}
        width={frame.width}
      />
      {showGrid && <FrameGrid frame={frame} />}
      {frame.elements.map((element) => (
        <ElementNode
          element={element}
          key={element.id}
          registerNode={registerNode}
          onChange={onElementChange}
          onSelect={onElementSelect}
          onToggleSelect={onElementToggleSelect}
          selected={selectedElementIds.includes(element.id)}
          selectedElementIds={selectedElementIds}
          cropEditingId={cropEditingId}
          textEditingId={textEditingId}
          onCropEditChange={onCropEditChange}
          onTextEdit={onTextEdit}
          depth={0}
          parentX={0}
          parentY={0}
          frame={frame}
          onGuidesChange={onGuidesChange}
          snapToObjects={snapToObjects}
          snapThreshold={snapThreshold}
          tool={tool}
        />
      ))}
      {guides.map((guide, index) =>
        guide.orientation === 'vertical' ? (
          <Line
            key={`v-${guide.position}-${index}`}
            points={[guide.position, 0, guide.position, frame.height]}
            stroke="#7b2fff"
            strokeWidth={1}
            dash={[5, 5]}
          />
        ) : (
          <Line
            key={`h-${guide.position}-${index}`}
            points={[0, guide.position, frame.width, guide.position]}
            stroke="#7b2fff"
            strokeWidth={1}
            dash={[5, 5]}
          />
        ),
      )}
    </Group>
  )
}

interface ElementNodeProps {
  element: DesignElement
  selected: boolean
  selectedElementIds: string[]
  cropEditingId?: string
  textEditingId?: string
  registerNode: (id: string, node: Konva.Node | null) => void
  onSelect: (elementId: string) => void
  onToggleSelect: (elementId: string) => void
  onChange: (elementId: string, patch: Partial<DesignElement>) => void
  onCropEditChange: (elementId: string | undefined) => void
  onTextEdit: (element: DesignElement, x: number, y: number) => void
  depth: number
  parentX: number
  parentY: number
  frame: Frame
  onGuidesChange: (guides: AlignmentGuide[]) => void
  snapToObjects: boolean
  snapThreshold: number
  tool: string
}

function ElementNode({
  element,
  selected,
  selectedElementIds,
  cropEditingId,
  textEditingId,
  registerNode,
  onSelect,
  onToggleSelect,
  onChange,
  onCropEditChange,
  onTextEdit,
  depth,
  parentX,
  parentY,
  frame,
  onGuidesChange,
  snapToObjects,
  snapThreshold,
  tool,
}: ElementNodeProps) {
  const image = useCanvasImage(element.src)
  if (!element.visible) return null
  const cropEditing = cropEditingId === element.id
  const elementAbsoluteX = parentX + element.x
  const elementAbsoluteY = parentY + element.y

  const childNodes = element.children?.map((child) => (
    <ElementNode
      element={child}
      key={child.id}
      registerNode={registerNode}
      onChange={onChange}
      onSelect={onSelect}
      onToggleSelect={onToggleSelect}
      selected={selectedElementIds.includes(child.id)}
      selectedElementIds={selectedElementIds}
      cropEditingId={cropEditingId}
      textEditingId={textEditingId}
      onCropEditChange={onCropEditChange}
      onTextEdit={onTextEdit}
      depth={depth + 1}
      parentX={elementAbsoluteX}
      parentY={elementAbsoluteY}
      frame={frame}
      onGuidesChange={onGuidesChange}
      snapToObjects={snapToObjects}
      snapThreshold={snapThreshold}
      tool={tool}
    />
  ))

  const common = {
    id: element.id,
    draggable: !element.locked && tool !== 'hand' && !cropEditing,
    opacity: element.opacity,
    rotation: element.rotation,
    x: element.x,
    y: element.y,
    onClick: (event: Konva.KonvaEventObject<MouseEvent>) => {
      event.cancelBubble = true
      if (event.evt.shiftKey || event.evt.ctrlKey || event.evt.metaKey) onToggleSelect(element.id)
      else onSelect(element.id)
    },
    onDblClick: (event: Konva.KonvaEventObject<MouseEvent>) => {
      event.cancelBubble = true
      if (element.type === 'text') {
        onSelect(element.id)
        onTextEdit(element, elementAbsoluteX, elementAbsoluteY)
        return
      }
      if (!element.src) return
      onSelect(element.id)
      onCropEditChange(cropEditing ? undefined : element.id)
    },
    onDragEnd: (event: Konva.KonvaEventObject<DragEvent>) => {
      if (event.target.id() !== element.id) return
      event.cancelBubble = true
      onGuidesChange([])
      onChange(element.id, { x: Math.round(event.target.x()), y: Math.round(event.target.y()) })
    },
    onDragMove: (event: Konva.KonvaEventObject<DragEvent>) => {
      if (event.target.id() !== element.id || depth !== 0) return
      event.cancelBubble = true
      const constrained = getConstrainedDragPosition(element, event.target.x(), event.target.y(), event.evt.shiftKey)
      const snap = snapToObjects
        ? getSnapPosition(element, frame, constrained.x, constrained.y, snapThreshold)
        : { x: constrained.x, y: constrained.y, guides: [] }
      event.target.position({ x: snap.x, y: snap.y })
      onGuidesChange(snap.guides)
    },
    onTransform: (event: Konva.KonvaEventObject<Event>) => {
      if (event.target.id() !== element.id || !snapToObjects) return
      const node = event.target
      const nextWidth = Math.max(2, element.width * node.scaleX())
      const nextHeight = Math.max(2, element.height * node.scaleY())
      const snap = getSnapResizePatch(
        element,
        frame,
        node.x(),
        node.y(),
        nextWidth,
        nextHeight,
        snapThreshold,
      )
      onGuidesChange(snap.guides)
    },
    onTransformEnd: (event: Konva.KonvaEventObject<Event>) => {
      if (event.target.id() !== element.id) return
      event.cancelBubble = true
      const node = event.target
      const scaleX = node.scaleX()
      const scaleY = node.scaleY()
      const rawWidth = Math.max(2, Math.round(element.width * scaleX))
      const rawHeight = Math.max(2, Math.round(element.height * scaleY))
      const snap = snapToObjects
        ? getSnapResizePatch(element, frame, node.x(), node.y(), rawWidth, rawHeight, snapThreshold)
        : { x: node.x(), y: node.y(), width: rawWidth, height: rawHeight, guides: [] }
      const nextWidth = snap.width
      const nextHeight = snap.height
      node.scaleX(1)
      node.scaleY(1)
      onGuidesChange([])
      onChange(element.id, {
        x: Math.round(snap.x),
        y: Math.round(snap.y),
        width: nextWidth,
        height: nextHeight,
        rotation: Math.round(node.rotation()),
        style: {
          ...element.style,
          cornerRadius: scaleCornerRadius(element, nextWidth, nextHeight),
        },
      })
    },
    ref: (node: Konva.Node | null) => {
      registerNode(element.id, node)
    },
  }

  const stroke = element.style.stroke.enabled ? element.style.stroke.color : undefined
  const strokeWidth = element.style.stroke.enabled ? element.style.stroke.width : 0
  const shadow = element.style.shadow
  const shadowProps = {
    shadowBlur: shadow.enabled ? shadow.blur : 0,
    shadowColor: shadow.color,
    shadowOffsetX: shadow.x,
    shadowOffsetY: shadow.y,
    shadowOpacity: shadow.enabled ? shadow.opacity : 0,
  }

  if (element.type === 'text') {
    return (
      <Text
        {...common}
        fill={element.style.typography?.color ?? '#111827'}
        fontFamily={element.style.typography?.fontFamily ?? 'Inter'}
        fontSize={element.style.typography?.fontSize ?? 18}
        fontStyle={`${element.style.typography?.fontWeight ?? 500}`}
        height={element.height}
        lineHeight={element.style.typography?.lineHeight ?? 1.2}
        opacity={textEditingId === element.id ? 0 : element.opacity}
        text={element.content ?? ''}
        width={element.width}
        {...shadowProps}
      />
    )
  }

  if (element.type === 'ellipse') {
    return (
      <Group {...common}>
        {image && (
          <MaskedImage
            cropEditing={cropEditing}
            element={element}
            image={image}
            mask="ellipse"
            onChange={(patch) => onChange(element.id, patch)}
          />
        )}
        <Ellipse
          fill={image ? 'transparent' : element.style.fill}
          radiusX={element.width / 2}
          radiusY={element.height / 2}
          stroke={stroke}
          strokeWidth={strokeWidth}
          x={element.width / 2}
          y={element.height / 2}
          {...shadowProps}
        />
        {childNodes}
      </Group>
    )
  }

  if (element.type === 'rectangle' && image) {
    return (
      <Group {...common}>
        <Rect
          cornerRadius={[
            element.style.cornerRadius.topLeft,
            element.style.cornerRadius.topRight,
            element.style.cornerRadius.bottomRight,
            element.style.cornerRadius.bottomLeft,
          ]}
          fill={element.style.fill}
          height={element.height}
          width={element.width}
          {...shadowProps}
        />
        <MaskedImage
          cropEditing={cropEditing}
          element={element}
          image={image}
          mask="rectangle"
          onChange={(patch) => onChange(element.id, patch)}
        />
        <Rect
          cornerRadius={[
            element.style.cornerRadius.topLeft,
            element.style.cornerRadius.topRight,
            element.style.cornerRadius.bottomRight,
            element.style.cornerRadius.bottomLeft,
          ]}
          height={element.height}
          stroke={stroke}
          strokeWidth={strokeWidth}
          width={element.width}
        />
        {selected && !cropEditing && (
          <RadiusHandles element={element} onChange={(patch) => onChange(element.id, patch)} />
        )}
        {childNodes}
      </Group>
    )
  }

  if (element.type === 'line') {
    return (
      <Line
        {...common}
        points={[0, 0, element.width, element.height]}
        stroke={stroke ?? element.style.fill}
        strokeWidth={Math.max(1, strokeWidth || 2)}
      />
    )
  }

  if (element.type === 'image') {
    return (
      <Group {...common}>
        <Rect
          cornerRadius={[
            element.style.cornerRadius.topLeft,
            element.style.cornerRadius.topRight,
            element.style.cornerRadius.bottomRight,
            element.style.cornerRadius.bottomLeft,
          ]}
          fill="#ececec"
          height={element.height}
          stroke={stroke}
          strokeWidth={strokeWidth}
          width={element.width}
          {...shadowProps}
        />
        {image ? (
          <MaskedImage
            cropEditing={cropEditing}
            element={element}
            image={image}
            mask="rectangle"
            onChange={(patch) => onChange(element.id, patch)}
          />
        ) : (
          <Text fill="#70757a" fontSize={13} text="Image" width={element.width} y={element.height / 2 - 8} />
        )}
        {childNodes}
      </Group>
    )
  }

  return (
    <Group {...common}>
      <Rect
        cornerRadius={[
          element.style.cornerRadius.topLeft,
          element.style.cornerRadius.topRight,
          element.style.cornerRadius.bottomRight,
          element.style.cornerRadius.bottomLeft,
        ]}
        fill={element.style.gradient?.enabled ? element.style.gradient.stops[0]?.color : element.style.fill}
        height={element.height}
        stroke={stroke}
        strokeWidth={strokeWidth}
        width={element.width}
        {...shadowProps}
      />
      {selected && element.type === 'rectangle' && !cropEditing && (
        <RadiusHandles element={element} onChange={(patch) => onChange(element.id, patch)} />
      )}
      {childNodes}
    </Group>
  )
}

function getConstrainedDragPosition(element: DesignElement, x: number, y: number, constrain: boolean) {
  if (!constrain) return { x, y }
  const dx = x - element.x
  const dy = y - element.y
  return Math.abs(dx) > Math.abs(dy) ? { x, y: element.y } : { x: element.x, y }
}

function getSnapPosition(element: DesignElement, frame: Frame, x: number, y: number, threshold: number) {
  const moving = {
    left: x,
    centerX: x + element.width / 2,
    right: x + element.width,
    top: y,
    centerY: y + element.height / 2,
    bottom: y + element.height,
  }
  const verticalTargets = [0, frame.width / 2, frame.width]
  const horizontalTargets = [0, frame.height / 2, frame.height]

  for (const sibling of flattenElementBounds(frame.elements)) {
    if (sibling.id === element.id || !sibling.visible) continue
    verticalTargets.push(sibling.x, sibling.x + sibling.width / 2, sibling.x + sibling.width)
    horizontalTargets.push(sibling.y, sibling.y + sibling.height / 2, sibling.y + sibling.height)
  }

  let snappedX = x
  let snappedY = y
  const guides: AlignmentGuide[] = []

  for (const target of verticalTargets) {
    const candidates = [
      { value: moving.left, offset: 0 },
      { value: moving.centerX, offset: element.width / 2 },
      { value: moving.right, offset: element.width },
    ]
    const match = candidates.find((candidate) => Math.abs(candidate.value - target) <= threshold)
    if (match) {
      snappedX = Math.round(target - match.offset)
      guides.push({ orientation: 'vertical', position: Math.round(target) })
      break
    }
  }

  for (const target of horizontalTargets) {
    const candidates = [
      { value: moving.top, offset: 0 },
      { value: moving.centerY, offset: element.height / 2 },
      { value: moving.bottom, offset: element.height },
    ]
    const match = candidates.find((candidate) => Math.abs(candidate.value - target) <= threshold)
    if (match) {
      snappedY = Math.round(target - match.offset)
      guides.push({ orientation: 'horizontal', position: Math.round(target) })
      break
    }
  }

  return { x: snappedX, y: snappedY, guides }
}

function getSnapResizePatch(
  element: DesignElement,
  frame: Frame,
  x: number,
  y: number,
  width: number,
  height: number,
  threshold: number,
) {
  const verticalTargets = [0, frame.width / 2, frame.width]
  const horizontalTargets = [0, frame.height / 2, frame.height]
  for (const sibling of flattenElementBounds(frame.elements)) {
    if (sibling.id === element.id || !sibling.visible) continue
    verticalTargets.push(sibling.x, sibling.x + sibling.width / 2, sibling.x + sibling.width)
    horizontalTargets.push(sibling.y, sibling.y + sibling.height / 2, sibling.y + sibling.height)
  }

  let snappedX = x
  let snappedY = y
  let snappedWidth = width
  let snappedHeight = height
  const guides: AlignmentGuide[] = []
  const verticalCandidates = [
    { value: x, apply: (target: number) => {
      const right = snappedX + snappedWidth
      snappedX = target
      snappedWidth = Math.max(2, right - target)
    } },
    { value: x + width / 2, apply: (target: number) => {
      snappedWidth = Math.max(2, (target - snappedX) * 2)
    } },
    { value: x + width, apply: (target: number) => {
      snappedWidth = Math.max(2, target - snappedX)
    } },
  ]
  const horizontalCandidates = [
    { value: y, apply: (target: number) => {
      const bottom = snappedY + snappedHeight
      snappedY = target
      snappedHeight = Math.max(2, bottom - target)
    } },
    { value: y + height / 2, apply: (target: number) => {
      snappedHeight = Math.max(2, (target - snappedY) * 2)
    } },
    { value: y + height, apply: (target: number) => {
      snappedHeight = Math.max(2, target - snappedY)
    } },
  ]

  for (const target of verticalTargets) {
    const match = verticalCandidates.find((candidate) => Math.abs(candidate.value - target) <= threshold)
    if (match) {
      match.apply(Math.round(target))
      guides.push({ orientation: 'vertical', position: Math.round(target) })
      break
    }
  }
  for (const target of horizontalTargets) {
    const match = horizontalCandidates.find((candidate) => Math.abs(candidate.value - target) <= threshold)
    if (match) {
      match.apply(Math.round(target))
      guides.push({ orientation: 'horizontal', position: Math.round(target) })
      break
    }
  }

  return {
    x: snappedX,
    y: snappedY,
    width: Math.round(snappedWidth),
    height: Math.round(snappedHeight),
    guides,
  }
}

function clampRadius(radius: number, width: number, height: number) {
  return Math.max(0, Math.min(Math.floor(Math.min(width, height) / 2), Math.round(radius)))
}

function scaleCornerRadius(element: DesignElement, nextWidth: number, nextHeight: number) {
  const scale = Math.min(nextWidth / Math.max(1, element.width), nextHeight / Math.max(1, element.height))
  return {
    topLeft: clampRadius(element.style.cornerRadius.topLeft * scale, nextWidth, nextHeight),
    topRight: clampRadius(element.style.cornerRadius.topRight * scale, nextWidth, nextHeight),
    bottomRight: clampRadius(element.style.cornerRadius.bottomRight * scale, nextWidth, nextHeight),
    bottomLeft: clampRadius(element.style.cornerRadius.bottomLeft * scale, nextWidth, nextHeight),
  }
}

function RadiusHandles({
  element,
  onChange,
}: {
  element: DesignElement
  onChange: (patch: Partial<DesignElement>) => void
}) {
  const [activeRadius, setActiveRadius] = useState<{ radius: number; x: number; y: number } | undefined>()
  const maxRadius = Math.floor(Math.min(element.width, element.height) / 2)
  const radiusValues = Object.values(element.style.cornerRadius)
  const uniformRadius = radiusValues.every((radius) => radius === radiusValues[0])
  const corners = [
    { key: 'topLeft' as const, radius: element.style.cornerRadius.topLeft, uniform: uniformRadius },
    { key: 'topRight' as const, radius: element.style.cornerRadius.topRight, uniform: uniformRadius },
    { key: 'bottomRight' as const, radius: element.style.cornerRadius.bottomRight, uniform: uniformRadius },
    { key: 'bottomLeft' as const, radius: element.style.cornerRadius.bottomLeft, uniform: uniformRadius },
  ]
  const handles = corners

  return (
    <>
      {handles.map((corner) => {
        const point = getRadiusHandlePoint(element, corner.key, corner.radius)
        const applyRadius = (nextRadius: number) => {
          const nextCornerRadius = corner.uniform
            ? {
                topLeft: nextRadius,
                topRight: nextRadius,
                bottomRight: nextRadius,
                bottomLeft: nextRadius,
              }
            : {
                ...element.style.cornerRadius,
                [corner.key]: nextRadius,
              }
          onChange({
            style: {
              ...element.style,
              cornerRadius: nextCornerRadius,
            },
          })
        }
        return (
          <KonvaCircle
            draggable
            fill="#ffffff"
            key={corner.key}
            onClick={(event) => {
              event.cancelBubble = true
            }}
            onDragEnd={(event) => {
              event.cancelBubble = true
              const nextRadius = getRadiusFromHandle(
                element,
                corner.key,
                event.target.x(),
                event.target.y(),
                maxRadius,
              )
              const nextPoint = getRadiusHandlePoint(element, corner.key, nextRadius)
              setActiveRadius({ radius: nextRadius, x: nextPoint.x, y: nextPoint.y })
              applyRadius(nextRadius)
            }}
            onDragMove={(event) => {
              event.cancelBubble = true
              const nextRadius = getRadiusFromHandle(
                element,
                corner.key,
                event.target.x(),
                event.target.y(),
                maxRadius,
              )
              const nextPoint = getRadiusHandlePoint(element, corner.key, nextRadius)
              event.target.position(nextPoint)
              setActiveRadius({ radius: nextRadius, x: nextPoint.x, y: nextPoint.y })
              applyRadius(nextRadius)
            }}
            onMouseDown={(event) => {
              event.cancelBubble = true
            }}
            radius={5}
            stroke="#7b2fff"
            strokeWidth={1.5}
            x={point.x}
            y={point.y}
          />
        )
      })}
      {activeRadius && (
        <Group x={activeRadius.x + 8} y={activeRadius.y - 28}>
          <Rect
            cornerRadius={4}
            fill="#ffffff"
            height={22}
            shadowBlur={8}
            shadowColor="#111827"
            shadowOpacity={0.16}
            width={48}
          />
          <Text
            align="center"
            fill="#7b2fff"
            fontSize={12}
            fontStyle="600"
            height={22}
            text={`${activeRadius.radius}px`}
            verticalAlign="middle"
            width={48}
          />
        </Group>
      )}
    </>
  )
}

function getRadiusFromHandle(
  element: DesignElement,
  key: keyof DesignElement['style']['cornerRadius'],
  x: number,
  y: number,
  maxRadius: number,
) {
  const raw =
    key === 'topLeft'
      ? Math.max(x, y)
      : key === 'topRight'
        ? Math.max(element.width - x, y)
        : key === 'bottomRight'
          ? Math.max(element.width - x, element.height - y)
          : Math.max(x, element.height - y)
  return Math.max(0, Math.min(maxRadius, Math.round(raw)))
}

function getRadiusHandlePoint(
  element: DesignElement,
  key: keyof DesignElement['style']['cornerRadius'],
  radius: number,
) {
  if (key === 'topLeft') return { x: radius, y: radius }
  if (key === 'topRight') return { x: element.width - radius, y: radius }
  if (key === 'bottomRight') return { x: element.width - radius, y: element.height - radius }
  return { x: radius, y: element.height - radius }
}

function MaskedImage({
  element,
  image,
  mask,
  cropEditing,
  onChange,
}: {
  element: DesignElement
  image: HTMLImageElement
  mask: 'rectangle' | 'ellipse'
  cropEditing: boolean
  onChange: (patch: Partial<DesignElement>) => void
}) {
  const crop = element.style.imageCrop ?? { x: 0, y: 0, scale: 1 }
  const naturalWidth = image.naturalWidth || image.width || element.width
  const naturalHeight = image.naturalHeight || image.height || element.height
  const fit = element.style.imageFit ?? 'cover'
  const baseScale =
    fit === 'stretch'
      ? 1
      : fit === 'contain'
        ? Math.min(element.width / naturalWidth, element.height / naturalHeight)
        : Math.max(element.width / naturalWidth, element.height / naturalHeight)
  const width = fit === 'stretch' ? element.width : naturalWidth * baseScale * crop.scale
  const height = fit === 'stretch' ? element.height : naturalHeight * baseScale * crop.scale
  const x = fit === 'stretch' ? 0 : (element.width - width) / 2 + crop.x
  const y = fit === 'stretch' ? 0 : (element.height - height) / 2 + crop.y
  const imageNode = (
    <KonvaImage
      draggable={cropEditing && fit !== 'stretch'}
      height={height}
      image={image}
      opacity={cropEditing ? 0.75 : 1}
      onDragEnd={(event) => {
        event.cancelBubble = true
        onChange({
          style: {
            ...element.style,
            imageCrop: {
              x: Math.round(event.target.x() - (element.width - width) / 2),
              y: Math.round(event.target.y() - (element.height - height) / 2),
              scale: crop.scale,
            },
          },
        })
      }}
      width={width}
      x={x}
      y={y}
    />
  )

  if (cropEditing) {
    return (
      <Group>
        {imageNode}
        <Text
          fill="#7b2fff"
          fontSize={12}
          text="Crop image: drag image, use Image +/-"
          x={0}
          y={-18}
        />
        <Rect
          dash={[5, 5]}
          height={element.height}
          stroke="#7b2fff"
          strokeWidth={1}
          width={element.width}
        />
      </Group>
    )
  }

  if (mask === 'ellipse') {
    return (
      <Group
        clipFunc={(ctx) => {
          ctx.ellipse(
            element.width / 2,
            element.height / 2,
            element.width / 2,
            element.height / 2,
            0,
            0,
            Math.PI * 2,
          )
        }}
      >
        {imageNode}
      </Group>
    )
  }

  return (
    <Group
      clipFunc={(ctx) => {
        const radius = element.style.cornerRadius.topLeft
        ctx.beginPath()
        ctx.roundRect(0, 0, element.width, element.height, radius)
        ctx.closePath()
      }}
    >
      {imageNode}
    </Group>
  )
}
