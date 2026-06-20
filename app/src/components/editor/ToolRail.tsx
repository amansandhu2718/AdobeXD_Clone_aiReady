import {
  Circle,
  Frame,
  Hand,
  Image,
  MousePointer2,
  PenLine,
  Slash,
  Square,
  Type,
} from 'lucide-react'
import type { ElementType } from 'react'
import { useEditorStore } from '../../store/editorStore'
import type { EditorTool } from '../../types/project'

const tools: Array<{ id: EditorTool; icon: ElementType; label: string; shortcut?: string }> = [
  { id: 'select', icon: MousePointer2, label: 'Select', shortcut: 'V' },
  { id: 'frame', icon: Frame, label: 'Artboard', shortcut: 'A' },
  { id: 'rectangle', icon: Square, label: 'Rectangle', shortcut: 'R' },
  { id: 'ellipse', icon: Circle, label: 'Ellipse', shortcut: 'E' },
  { id: 'line', icon: Slash, label: 'Line', shortcut: 'L' },
  { id: 'text', icon: Type, label: 'Text', shortcut: 'T' },
  { id: 'image', icon: Image, label: 'Image Fill Shape' },
  { id: 'hand', icon: Hand, label: 'Pan', shortcut: 'Space' },
]

export function ToolRail() {
  const tool = useEditorStore((state) => state.tool)
  const setTool = useEditorStore((state) => state.setTool)
  const addFrame = useEditorStore((state) => state.addFrame)
  const addElement = useEditorStore((state) => state.addElement)
  const selection = useEditorStore((state) => state.selection)

  return (
    <nav className="tool-rail" aria-label="Editor tools">
      {tools.map(({ id, icon: Icon, label, shortcut }) => (
        <button
          className={`tool-button ${tool === id ? 'active' : ''}`}
          key={id}
          onClick={() => {
            setTool(id)
            if (id === 'frame') addFrame()
            if (['rectangle', 'ellipse', 'line', 'text', 'image'].includes(id) && selection.frameId) {
              addElement(selection.frameId, id)
            }
          }}
          title={shortcut ? `${label} (${shortcut})` : label}
          type="button"
        >
          <Icon size={17} />
        </button>
      ))}
      <div style={{ flex: 1 }} />
      <button className="tool-button is-disabled" disabled title="Vector pen - coming soon" type="button">
        <PenLine size={17} />
      </button>
    </nav>
  )
}
