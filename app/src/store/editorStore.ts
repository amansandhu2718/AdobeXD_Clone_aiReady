import { create } from 'zustand'
import { sampleProject } from '../data/sampleProject'
import { createId } from '../lib/ids'
import type {
  AmanXDFile,
  DesignElement,
  EditorMode,
  EditorTool,
  Frame,
  SelectionState,
} from '../types/project'

interface EditorStore {
  file: AmanXDFile
  past: AmanXDFile[]
  future: AmanXDFile[]
  mode: EditorMode
  tool: EditorTool
  previousTool: EditorTool
  selection: SelectionState
  clipboardElement?: DesignElement
  zoom: number
  showGrid: boolean
  snapToObjects: boolean
  snapThreshold: number
  setFile: (file: AmanXDFile) => void
  hydrateFile: (file: AmanXDFile) => void
  undo: () => void
  redo: () => void
  setMode: (mode: EditorMode) => void
  setTool: (tool: EditorTool) => void
  setTemporaryPan: (active: boolean) => void
  setZoom: (zoom: number) => void
  selectFrame: (frameId: string) => void
  selectElement: (frameId: string, elementId: string) => void
  toggleElementSelection: (frameId: string, elementId: string) => void
  clearSelection: () => void
  toggleGrid: () => void
  toggleSnapToObjects: () => void
  setSnapThreshold: (threshold: number) => void
  addElement: (frameId: string, type: EditorTool) => void
  addFrame: () => void
  updateFrame: (frameId: string, patch: Partial<Frame>) => void
  updateElement: (frameId: string, elementId: string, patch: Partial<DesignElement>) => void
  toggleElement: (frameId: string, elementId: string, key: 'visible' | 'locked') => void
  duplicateElement: (frameId: string, elementId: string) => void
  deleteElement: (frameId: string, elementId: string) => void
  deleteSelection: () => void
  copySelection: () => void
  pasteClipboard: () => void
  duplicateSelection: () => void
  nudgeSelection: (dx: number, dy: number) => void
  toggleSelectedElement: (key: 'visible' | 'locked') => void
  arrangeSelectedElement: (direction: 'front' | 'forward' | 'backward' | 'back') => void
  alignSelectedElementToFrame: (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void
  roundSelectedElementToPixelGrid: () => void
  adjustSelectedRadius: (delta: number) => void
  nestSelectionInContainingElement: () => void
  moveElementIntoElement: (frameId: string, elementId: string, parentId: string) => void
  updateSelectedImageCrop: (patch: { x?: number; y?: number; scale?: number }) => void
}

const touch = (file: AmanXDFile): AmanXDFile => ({
  ...file,
  project: { ...file.project, updatedAt: new Date().toISOString() },
})

const commitState = (state: EditorStore, file: AmanXDFile) => ({
  file,
  past: [...state.past, state.file].slice(-80),
  future: [],
})

const defaultElement = (type: EditorTool): DesignElement => {
  const id = createId(type)
  const isImageShape = type === 'image'
  const fill = type === 'text' ? 'transparent' : type === 'ellipse' ? '#00b8a9' : '#ffffff'
  return {
    id,
    type: type === 'frame' || type === 'hand' || type === 'select' || isImageShape ? 'rectangle' : type,
    name: isImageShape ? 'Image Shape' : `${type[0]?.toUpperCase()}${type.slice(1)}`,
    x: 72,
    y: 96,
    width: type === 'text' ? 220 : 160,
    height: type === 'text' ? 42 : 96,
    rotation: 0,
    opacity: 1,
    locked: false,
    visible: true,
    content: type === 'text' ? 'New text layer' : undefined,
    src:
      isImageShape
        ? 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80'
        : undefined,
    style: {
      fill,
      stroke: { enabled: type !== 'text', color: '#d7d7d7', width: 1 },
      cornerRadius: { topLeft: 8, topRight: 8, bottomRight: 8, bottomLeft: 8 },
      shadow: {
        enabled: false,
        color: '#000000',
        x: 0,
        y: 8,
        blur: 18,
        opacity: 0.12,
      },
      typography:
        type === 'text'
          ? {
              fontFamily: 'Inter',
              fontSize: 22,
              fontWeight: 600,
              lineHeight: 1.25,
              letterSpacing: 0,
              align: 'left',
              color: '#111827',
            }
          : undefined,
      imageFit: isImageShape ? 'cover' : undefined,
      imageCrop: isImageShape ? { x: 0, y: 0, scale: 1 } : undefined,
      blendMode: 'normal',
    },
  }
}

function mapFrame(file: AmanXDFile, frameId: string, mapper: (frame: Frame) => Frame) {
  return touch({
    ...file,
    project: {
      ...file.project,
      pages: file.project.pages.map((page) => ({
        ...page,
        frames: page.frames.map((frame) => (frame.id === frameId ? mapper(frame) : frame)),
      })),
    },
  })
}

function mapElements(elements: DesignElement[], mapper: (element: DesignElement) => DesignElement): DesignElement[] {
  return elements.map((element) =>
    mapper({
      ...element,
      children: element.children ? mapElements(element.children, mapper) : element.children,
    }),
  )
}

function findElement(elements: DesignElement[], elementId?: string): DesignElement | undefined {
  if (!elementId) return undefined
  for (const element of elements) {
    if (element.id === elementId) return element
    const child = findElement(element.children ?? [], elementId)
    if (child) return child
  }
  return undefined
}

function getSelectionElementIds(selection: SelectionState) {
  if (selection.elementIds?.length) return selection.elementIds
  return selection.elementId ? [selection.elementId] : []
}

function removeElement(elements: DesignElement[], elementId: string): DesignElement[] {
  return elements
    .filter((element) => element.id !== elementId)
    .map((element) => ({
      ...element,
      children: element.children ? removeElement(element.children, elementId) : element.children,
    }))
}

function reorderElement(
  elements: DesignElement[],
  elementId: string,
  direction: 'front' | 'forward' | 'backward' | 'back',
): DesignElement[] {
  const index = elements.findIndex((element) => element.id === elementId)
  if (index === -1) {
    return elements.map((element) => ({
      ...element,
      children: element.children ? reorderElement(element.children, elementId, direction) : element.children,
    }))
  }
  const next = [...elements]
  const [item] = next.splice(index, 1)
  const targetIndex =
    direction === 'front'
      ? next.length
      : direction === 'back'
        ? 0
        : direction === 'forward'
          ? Math.min(next.length, index + 1)
          : Math.max(0, index - 1)
  next.splice(targetIndex, 0, item)
  return next
}

function duplicateElementTree(element: DesignElement): DesignElement {
  return {
    ...element,
    id: createId(element.type),
    name: `${element.name} Copy`,
    x: element.x + 24,
    y: element.y + 24,
    children: element.children?.map((child) => ({
      ...duplicateElementTree(child),
      x: child.x,
      y: child.y,
    })),
  }
}

function normalizeElement(element: DesignElement): DesignElement {
  const wasStandaloneImage = element.type === 'image'
  return {
    ...element,
    type: wasStandaloneImage ? 'rectangle' : element.type,
    name: wasStandaloneImage ? 'Image Shape' : element.name,
    style: {
      ...element.style,
      imageFit: element.src ? (element.style.imageFit ?? 'cover') : element.style.imageFit,
      imageCrop: element.src ? (element.style.imageCrop ?? { x: 0, y: 0, scale: 1 }) : element.style.imageCrop,
    },
    children: element.children?.map(normalizeElement),
  }
}

function normalizeProjectFile(file: AmanXDFile): AmanXDFile {
  return {
    ...file,
    project: {
      ...file.project,
      pages: file.project.pages.map((page) => ({
        ...page,
        frames: page.frames.map((frame) => ({
          ...frame,
          elements: frame.elements.map(normalizeElement),
        })),
      })),
    },
  }
}

function elementContains(parent: DesignElement, child: DesignElement) {
  return (
    parent.id !== child.id &&
    parent.type !== 'text' &&
    child.x >= parent.x &&
    child.y >= parent.y &&
    child.x + child.width <= parent.x + parent.width &&
    child.y + child.height <= parent.y + parent.height
  )
}

export const useEditorStore = create<EditorStore>((set) => ({
  file: normalizeProjectFile(sampleProject),
  past: [],
  future: [],
  mode: 'design',
  tool: 'select',
  previousTool: 'select',
  selection: { frameId: sampleProject.project.pages[0]?.frames[0]?.id },
  clipboardElement: undefined,
  zoom: 0.82,
  showGrid: true,
  snapToObjects: true,
  snapThreshold: 6,
  setFile: (file) =>
    set((state) => {
      const normalizedFile = normalizeProjectFile(file)
      return {
        ...commitState(state, normalizedFile),
        selection: { frameId: normalizedFile.project.pages[0]?.frames[0]?.id },
      }
    }),
  hydrateFile: (file) =>
    set(() => {
      const normalizedFile = normalizeProjectFile(file)
      return {
        file: normalizedFile,
        past: [],
        future: [],
        selection: { frameId: normalizedFile.project.pages[0]?.frames[0]?.id },
      }
    }),
  undo: () =>
    set((state) => {
      const previous = state.past.at(-1)
      if (!previous) return state
      return {
        file: previous,
        past: state.past.slice(0, -1),
        future: [state.file, ...state.future].slice(0, 80),
        selection: { frameId: previous.project.pages[0]?.frames[0]?.id },
      }
    }),
  redo: () =>
    set((state) => {
      const next = state.future[0]
      if (!next) return state
      return {
        file: next,
        past: [...state.past, state.file].slice(-80),
        future: state.future.slice(1),
        selection: { frameId: next.project.pages[0]?.frames[0]?.id },
      }
    }),
  setMode: (mode) => set({ mode }),
  setTool: (tool) => set({ tool, previousTool: tool === 'hand' ? 'select' : tool }),
  setTemporaryPan: (active) =>
    set((state) =>
      active
        ? { tool: 'hand', previousTool: state.tool === 'hand' ? state.previousTool : state.tool }
        : { tool: state.previousTool },
    ),
  setZoom: (zoom) => set({ zoom: Math.max(0.2, Math.min(2, zoom)) }),
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  toggleSnapToObjects: () => set((state) => ({ snapToObjects: !state.snapToObjects })),
  setSnapThreshold: (threshold) => set({ snapThreshold: Math.max(1, Math.min(24, Math.round(threshold))) }),
  selectFrame: (frameId) => set({ selection: { frameId } }),
  selectElement: (frameId, elementId) => set({ selection: { frameId, elementId, elementIds: [elementId] } }),
  toggleElementSelection: (frameId, elementId) =>
    set((state) => {
      const current = state.selection.frameId === frameId ? (state.selection.elementIds ?? []) : []
      const next = current.includes(elementId)
        ? current.filter((candidate) => candidate !== elementId)
        : [...current, elementId]
      return {
        selection: {
          frameId,
          elementId: next.at(-1),
          elementIds: next,
        },
      }
    }),
  clearSelection: () => set({ selection: {} }),
  addElement: (frameId, type) =>
    set((state) => {
      const element = defaultElement(type)
      return {
        ...commitState(
          state,
          mapFrame(state.file, frameId, (frame) => ({
            ...frame,
            elements: [...frame.elements, element],
          })),
        ),
        selection: { frameId, elementId: element.id, elementIds: [element.id] },
        tool: 'select',
      }
    }),
  addFrame: () =>
    set((state) => {
      const page = state.file.project.pages[0]
      const frame: Frame = {
        id: createId('frame'),
        name: 'New Frame',
        x: 80 + page.frames.length * 460,
        y: 690,
        width: 390,
        height: 844,
        background: '#ffffff',
        elements: [],
      }
      return {
        ...commitState(
          state,
          touch({
            ...state.file,
            project: {
              ...state.file.project,
              pages: state.file.project.pages.map((candidate, index) =>
                index === 0 ? { ...candidate, frames: [...candidate.frames, frame] } : candidate,
              ),
            },
          }),
        ),
        selection: { frameId: frame.id },
      }
    }),
  updateFrame: (frameId, patch) =>
    set((state) => commitState(state, mapFrame(state.file, frameId, (frame) => ({ ...frame, ...patch })))),
  updateElement: (frameId, elementId, patch) =>
    set((state) =>
      commitState(
        state,
        mapFrame(state.file, frameId, (frame) => ({
          ...frame,
          elements: mapElements(frame.elements, (element) =>
            element.id === elementId ? { ...element, ...patch } : element,
          ),
        })),
      ),
    ),
  toggleElement: (frameId, elementId, key) =>
    set((state) =>
      commitState(
        state,
        mapFrame(state.file, frameId, (frame) => ({
          ...frame,
          elements: mapElements(frame.elements, (element) =>
            element.id === elementId ? { ...element, [key]: !element[key] } : element,
          ),
        })),
      ),
    ),
  duplicateElement: (frameId, elementId) =>
    set((state) =>
      commitState(
        state,
        mapFrame(state.file, frameId, (frame) => {
          const source = findElement(frame.elements, elementId)
          if (!source) return frame
          const duplicate = duplicateElementTree(source)
          return { ...frame, elements: [...frame.elements, duplicate] }
        }),
      ),
    ),
  deleteElement: (frameId, elementId) =>
    set((state) => ({
      ...commitState(
        state,
        mapFrame(state.file, frameId, (frame) => ({
          ...frame,
          elements: removeElement(frame.elements, elementId),
        })),
      ),
      selection: { frameId },
    })),
  deleteSelection: () =>
    set((state) => {
      const elementIds = getSelectionElementIds(state.selection)
      if (!state.selection.frameId || !elementIds.length) return state
      return {
        ...commitState(
          state,
          mapFrame(state.file, state.selection.frameId, (frame) => ({
            ...frame,
            elements: elementIds.reduce((elements, elementId) => removeElement(elements, elementId), frame.elements),
          })),
        ),
        selection: { frameId: state.selection.frameId },
      }
    }),
  copySelection: () =>
    set((state) => {
      const frame = getSelectedFrame(state.file, state.selection.frameId)
      const element = findElement(frame?.elements ?? [], state.selection.elementId)
      return element ? { clipboardElement: element } : state
    }),
  pasteClipboard: () =>
    set((state) => {
      const frameId = state.selection.frameId ?? state.file.project.pages[0]?.frames[0]?.id
      if (!frameId || !state.clipboardElement) return state
      const pasted = duplicateElementTree(state.clipboardElement)
      return {
        ...commitState(
          state,
          mapFrame(state.file, frameId, (frame) => ({
            ...frame,
            elements: [...frame.elements, pasted],
          })),
        ),
        selection: { frameId, elementId: pasted.id, elementIds: [pasted.id] },
      }
    }),
  duplicateSelection: () =>
    set((state) => {
      const elementIds = getSelectionElementIds(state.selection)
      if (!state.selection.frameId || !elementIds.length) return state
      const frameId = state.selection.frameId
      const duplicateIds: string[] = []
      const nextFile = mapFrame(state.file, frameId, (frame) => {
        const duplicates = elementIds
          .map((elementId) => findElement(frame.elements, elementId))
          .filter((source): source is DesignElement => Boolean(source))
          .map((source) => {
            const duplicate = duplicateElementTree(source)
            duplicateIds.push(duplicate.id)
            return duplicate
          })
        return duplicates.length ? { ...frame, elements: [...frame.elements, ...duplicates] } : frame
      })
      return {
        ...commitState(state, nextFile),
        selection: { frameId, elementId: duplicateIds.at(-1), elementIds: duplicateIds },
      }
    }),
  nudgeSelection: (dx, dy) =>
    set((state) => {
      const frameId = state.selection.frameId
      const elementIds = new Set(getSelectionElementIds(state.selection))
      if (!frameId || !elementIds.size) return state
      return commitState(
        state,
        mapFrame(state.file, frameId, (frame) => ({
          ...frame,
          elements: mapElements(frame.elements, (element) =>
            elementIds.has(element.id) ? { ...element, x: element.x + dx, y: element.y + dy } : element,
          ),
        })),
      )
    }),
  toggleSelectedElement: (key) =>
    set((state) => {
      const frameId = state.selection.frameId
      const elementIds = new Set(getSelectionElementIds(state.selection))
      if (!frameId || !elementIds.size) return state
      return commitState(
        state,
        mapFrame(state.file, frameId, (frame) => ({
          ...frame,
          elements: mapElements(frame.elements, (element) =>
            elementIds.has(element.id) ? { ...element, [key]: !element[key] } : element,
          ),
        })),
      )
    }),
  arrangeSelectedElement: (direction) =>
    set((state) => {
      const frameId = state.selection.frameId
      const elementId = state.selection.elementId
      if (!frameId || !elementId) return state
      return commitState(
        state,
        mapFrame(state.file, frameId, (frame) => ({
          ...frame,
          elements: reorderElement(frame.elements, elementId, direction),
        })),
      )
    }),
  alignSelectedElementToFrame: (alignment) =>
    set((state) => {
      const frameId = state.selection.frameId
      const elementIds = new Set(getSelectionElementIds(state.selection))
      if (!frameId || !elementIds.size) return state
      return commitState(
        state,
        mapFrame(state.file, frameId, (frame) => ({
          ...frame,
          elements: mapElements(frame.elements, (element) => {
            if (!elementIds.has(element.id)) return element
            if (alignment === 'left') return { ...element, x: 0 }
            if (alignment === 'center') return { ...element, x: Math.round((frame.width - element.width) / 2) }
            if (alignment === 'right') return { ...element, x: Math.round(frame.width - element.width) }
            if (alignment === 'top') return { ...element, y: 0 }
            if (alignment === 'middle') return { ...element, y: Math.round((frame.height - element.height) / 2) }
            return { ...element, y: Math.round(frame.height - element.height) }
          }),
        })),
      )
    }),
  roundSelectedElementToPixelGrid: () =>
    set((state) => {
      const frameId = state.selection.frameId
      const elementIds = new Set(getSelectionElementIds(state.selection))
      if (!frameId || !elementIds.size) return state
      return commitState(
        state,
        mapFrame(state.file, frameId, (frame) => ({
          ...frame,
          elements: mapElements(frame.elements, (element) =>
            elementIds.has(element.id)
              ? {
                  ...element,
                  x: Math.round(element.x),
                  y: Math.round(element.y),
                  width: Math.round(element.width),
                  height: Math.round(element.height),
                }
              : element,
          ),
        })),
      )
    }),
  adjustSelectedRadius: (delta) =>
    set((state) => {
      const frameId = state.selection.frameId
      const elementId = state.selection.elementId
      if (!frameId || !elementId) return state
      return commitState(
        state,
        mapFrame(state.file, frameId, (frame) => ({
          ...frame,
          elements: mapElements(frame.elements, (element) => {
            if (element.id !== elementId) return element
            const current = element.style.cornerRadius
            const next = Math.max(0, current.topLeft + delta)
            return {
              ...element,
              style: {
                ...element.style,
                cornerRadius: {
                  topLeft: next,
                  topRight: next,
                  bottomRight: next,
                  bottomLeft: next,
                },
              },
            }
          }),
        })),
      )
    }),
  nestSelectionInContainingElement: () =>
    set((state) => {
      const frameId = state.selection.frameId
      const elementId = state.selection.elementId
      if (!frameId || !elementId) return state

      let nextSelection = state.selection
      const nextFile = mapFrame(state.file, frameId, (frame) => {
        const child = findElement(frame.elements, elementId)
        if (!child) return frame
        const candidates = frame.elements.filter((element) => elementContains(element, child))
        const parent = candidates.sort((a, b) => a.width * a.height - b.width * b.height)[0]
        if (!parent) return frame

        const nestedChild: DesignElement = {
          ...child,
          x: child.x - parent.x,
          y: child.y - parent.y,
        }
        const withoutChild = removeElement(frame.elements, child.id)
        nextSelection = { frameId, elementId: child.id }

        return {
          ...frame,
          elements: mapElements(withoutChild, (element) =>
            element.id === parent.id
              ? { ...element, children: [...(element.children ?? []), nestedChild] }
              : element,
          ),
        }
      })

      return {
        ...commitState(state, nextFile),
        selection: {
          ...nextSelection,
          elementIds: nextSelection.elementId ? [nextSelection.elementId] : undefined,
        },
      }
    }),
  moveElementIntoElement: (frameId, elementId, parentId) =>
    set((state) => {
      if (elementId === parentId) return state
      const nextFile = mapFrame(state.file, frameId, (frame) => {
        const child = findElement(frame.elements, elementId)
        const parent = findElement(frame.elements, parentId)
        if (!child || !parent || parent.type === 'text') return frame
        const nestedChild: DesignElement = {
          ...child,
          x: child.x - parent.x,
          y: child.y - parent.y,
        }
        const withoutChild = removeElement(frame.elements, child.id)
        return {
          ...frame,
          elements: mapElements(withoutChild, (element) =>
            element.id === parentId
              ? { ...element, children: [...(element.children ?? []), nestedChild] }
              : element,
          ),
        }
      })
      return {
        ...commitState(state, nextFile),
        selection: { frameId, elementId, elementIds: [elementId] },
      }
    }),
  updateSelectedImageCrop: (patch) =>
    set((state) => {
      const frameId = state.selection.frameId
      const elementId = state.selection.elementId
      if (!frameId || !elementId) return state
      return commitState(
        state,
        mapFrame(state.file, frameId, (frame) => ({
          ...frame,
          elements: mapElements(frame.elements, (element) => {
            if (element.id !== elementId) return element
            const current = element.style.imageCrop ?? { x: 0, y: 0, scale: 1 }
            return {
              ...element,
              style: {
                ...element.style,
                imageCrop: {
                  x: patch.x ?? current.x,
                  y: patch.y ?? current.y,
                  scale: Math.max(0.1, patch.scale ?? current.scale),
                },
              },
            }
          }),
        })),
      )
    }),
}))

export function getSelectedFrame(file: AmanXDFile, frameId?: string) {
  return file.project.pages.flatMap((page) => page.frames).find((frame) => frame.id === frameId)
}

export function getSelectedElement(file: AmanXDFile, selection: SelectionState) {
  const frame = getSelectedFrame(file, selection.frameId)
  return findElement(frame?.elements ?? [], selection.elementId)
}
