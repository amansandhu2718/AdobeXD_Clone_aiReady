import { useState } from 'react'
import { ChevronDown, ChevronRight, Eye, EyeOff, ImageIcon, Lock, LockOpen, Trash2 } from 'lucide-react'
import { useEditorStore } from '../../store/editorStore'
import type { DesignElement } from '../../types/project'

export function LayersPanel() {
  const [collapsedFrames, setCollapsedFrames] = useState<Record<string, boolean>>({})
  const [draggingId, setDraggingId] = useState<string | undefined>()
  const [dropTargetId, setDropTargetId] = useState<string | undefined>()
  const file = useEditorStore((state) => state.file)
  const selection = useEditorStore((state) => state.selection)
  const selectFrame = useEditorStore((state) => state.selectFrame)
  const selectElement = useEditorStore((state) => state.selectElement)
  const toggleElement = useEditorStore((state) => state.toggleElement)
  const deleteElement = useEditorStore((state) => state.deleteElement)
  const moveElementIntoElement = useEditorStore((state) => state.moveElementIntoElement)

  return (
    <section className="panel-section">
      <div className="section-title">Document Assets</div>
      <input className="search-box" placeholder="Search layers" />
      <div className="stack" style={{ marginTop: 10 }}>
        {file.project.pages.map((page) => (
          <div key={page.id}>
            <div className="subtle" style={{ margin: '8px 0' }}>
              {page.name}
            </div>
            {page.frames.map((frame) => (
              <div key={frame.id}>
                <button
                  className={`layer-row frame ${selection.frameId === frame.id && !selection.elementId ? 'active' : ''}`}
                  onClick={() => selectFrame(frame.id)}
                  type="button"
                >
                  <span
                    onClick={(event) => {
                      event.stopPropagation()
                      setCollapsedFrames((current) => ({
                        ...current,
                        [frame.id]: !current[frame.id],
                      }))
                    }}
                  >
                    {collapsedFrames[frame.id] ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                  </span>
                  <span>{frame.name}</span>
                </button>
                {!collapsedFrames[frame.id] &&
                  [...frame.elements].reverse().map((element) => (
                    <LayerElementRow
                      depth={0}
                      element={element}
                      frameId={frame.id}
                      key={element.id}
                      selectedElementId={selection.elementId}
                      onDelete={deleteElement}
                      draggingId={draggingId}
                      onMoveInto={moveElementIntoElement}
                      onDragStateChange={setDraggingId}
                      onDropTargetChange={setDropTargetId}
                      onSelect={selectElement}
                      onToggle={toggleElement}
                      dropTargetId={dropTargetId}
                    />
                  ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

function LayerElementRow({
  element,
  frameId,
  selectedElementId,
  depth,
  onSelect,
  onToggle,
  onDelete,
  onMoveInto,
  onDragStateChange,
  onDropTargetChange,
  draggingId,
  dropTargetId,
}: {
  element: DesignElement
  frameId: string
  selectedElementId?: string
  depth: number
  onSelect: (frameId: string, elementId: string) => void
  onToggle: (frameId: string, elementId: string, key: 'visible' | 'locked') => void
  onDelete: (frameId: string, elementId: string) => void
  onMoveInto: (frameId: string, elementId: string, parentId: string) => void
  onDragStateChange: (elementId: string | undefined) => void
  onDropTargetChange: (elementId: string | undefined) => void
  draggingId?: string
  dropTargetId?: string
}) {
  const [collapsed, setCollapsed] = useState(false)
  const hasChildren = Boolean(element.children?.length || element.src)
  const canDrop = Boolean(draggingId && draggingId !== element.id && element.type !== 'text')

  return (
    <>
      <div
        className={`layer-row element ${selectedElementId === element.id ? 'active' : ''} ${
          canDrop ? 'can-drop' : ''
        } ${dropTargetId === element.id ? 'drop-target' : ''}`}
        draggable
        onDragStart={(event) => {
          event.dataTransfer.setData('application/x-amanxd-layer', element.id)
          event.dataTransfer.effectAllowed = 'move'
          onDragStateChange(element.id)
        }}
        onDragEnd={() => {
          onDragStateChange(undefined)
          onDropTargetChange(undefined)
        }}
        onDragLeave={() => {
          if (dropTargetId === element.id) onDropTargetChange(undefined)
        }}
        onDragOver={(event) => {
          if (element.type === 'text') return
          event.preventDefault()
          if (draggingId && draggingId !== element.id) onDropTargetChange(element.id)
          event.dataTransfer.dropEffect = 'move'
        }}
        onDrop={(event) => {
          const childId = event.dataTransfer.getData('application/x-amanxd-layer')
          if (!childId || childId === element.id || element.type === 'text') return
          event.preventDefault()
          onMoveInto(frameId, childId, element.id)
          onDragStateChange(undefined)
          onDropTargetChange(undefined)
        }}
        style={{ marginLeft: 12 + depth * 14 }}
      >
        <button
          className="icon-button"
          onClick={() => onToggle(frameId, element.id, 'visible')}
          title={element.visible ? 'Hide' : 'Show'}
          type="button"
        >
          {element.visible ? <Eye size={13} /> : <EyeOff size={13} />}
        </button>
        <button
          style={{ minWidth: 0, overflow: 'hidden', textAlign: 'left' }}
          onClick={() => onSelect(frameId, element.id)}
          type="button"
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            {hasChildren && (
              <span
                onClick={(event) => {
                  event.stopPropagation()
                  setCollapsed((current) => !current)
                }}
              >
                {collapsed ? <ChevronRight size={13} /> : <ChevronDown size={13} />}
              </span>
            )}
            {element.name}
          </span>
        </button>
        <button
          className="icon-button"
          onClick={() => onToggle(frameId, element.id, 'locked')}
          title={element.locked ? 'Unlock' : 'Lock'}
          type="button"
        >
          {element.locked ? <Lock size={13} /> : <LockOpen size={13} />}
        </button>
        {selectedElementId === element.id && (
          <button
            className="icon-button"
            onClick={() => onDelete(frameId, element.id)}
            title="Delete"
            type="button"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>
      {!collapsed &&
        (
          <>
            {element.src && (
              <button
                className={`layer-row element image-fill-row ${selectedElementId === element.id ? 'active' : ''}`}
                onClick={() => onSelect(frameId, element.id)}
                style={{ marginLeft: 12 + (depth + 1) * 14 }}
                type="button"
              >
                <span />
                <span>
                  <ImageIcon size={13} />
                  Image Fill
                </span>
                <span className="subtle">{element.style.imageFit ?? 'cover'}</span>
                <span />
              </button>
            )}
            {element.children?.map((child) => (
              <LayerElementRow
                depth={depth + 1}
                element={child}
                frameId={frameId}
                key={child.id}
                selectedElementId={selectedElementId}
                onDelete={onDelete}
                draggingId={draggingId}
                dropTargetId={dropTargetId}
                onMoveInto={onMoveInto}
                onDragStateChange={onDragStateChange}
                onDropTargetChange={onDropTargetChange}
                onSelect={onSelect}
                onToggle={onToggle}
              />
            ))}
          </>
        )}
    </>
  )
}
