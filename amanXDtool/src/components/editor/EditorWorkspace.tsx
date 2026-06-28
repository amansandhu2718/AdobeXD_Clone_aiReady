import { useEffect, useRef, useState } from 'react'
import {
  Download,
  FileJson,
  Home,
  ImageDown,
  Lock,
  Magnet,
  PanelsTopLeft,
  Redo2,
  RotateCcw,
  Scan,
  Undo2,
  Unlock,
  Upload,
} from 'lucide-react'
import { CanvasBoard, type CanvasBoardHandle } from '../canvas/CanvasBoard'
import { AssetsPanel } from '../panels/AssetsPanel'
import { InspectorPanel } from '../panels/InspectorPanel'
import { LayersPanel } from '../panels/LayersPanel'
import { ToolRail } from './ToolRail'
import { useAutosave } from '../../hooks/useAutosave'
import { loadGoogleFont } from '../../data/fonts'
import { sampleProject } from '../../data/sampleProject'
import { createEmptyProject } from '../../data/createEmptyProject'
import { downloadText, safeDownloadName } from '../../lib/download'
import { createHandoffMetadata } from '../../lib/handoff'
import { getSelectedElement, useEditorStore } from '../../store/editorStore'
import { parseProjectFile } from '../../validation/projectSchema'

export function EditorWorkspace() {
  useAutosave()
  const canvasRef = useRef<CanvasBoardHandle>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const file = useEditorStore((state) => state.file)
  const setFile = useEditorStore((state) => state.setFile)
  const renameProject = useEditorStore((state) => state.renameProject)
  const undo = useEditorStore((state) => state.undo)
  const redo = useEditorStore((state) => state.redo)
  const deleteSelection = useEditorStore((state) => state.deleteSelection)
  const copySelection = useEditorStore((state) => state.copySelection)
  const pasteClipboard = useEditorStore((state) => state.pasteClipboard)
  const duplicateSelection = useEditorStore((state) => state.duplicateSelection)
  const nudgeSelection = useEditorStore((state) => state.nudgeSelection)
  const toggleSelectedElement = useEditorStore((state) => state.toggleSelectedElement)
  const arrangeSelectedElement = useEditorStore((state) => state.arrangeSelectedElement)
  const alignSelection = useEditorStore((state) => state.alignSelection)
  const distributeSelection = useEditorStore((state) => state.distributeSelection)
  const roundSelectedElementToPixelGrid = useEditorStore((state) => state.roundSelectedElementToPixelGrid)
  const groupSelection = useEditorStore((state) => state.groupSelection)
  const ungroupSelection = useEditorStore((state) => state.ungroupSelection)
  const setTool = useEditorStore((state) => state.setTool)
  const addFrame = useEditorStore((state) => state.addFrame)
  const addElement = useEditorStore((state) => state.addElement)
  const clearSelection = useEditorStore((state) => state.clearSelection)
  const setZoom = useEditorStore((state) => state.setZoom)
  const zoom = useEditorStore((state) => state.zoom)
  const showGrid = useEditorStore((state) => state.showGrid)
  const toggleGrid = useEditorStore((state) => state.toggleGrid)
  const snapToObjects = useEditorStore((state) => state.snapToObjects)
  const snapThreshold = useEditorStore((state) => state.snapThreshold)
  const toggleSnapToObjects = useEditorStore((state) => state.toggleSnapToObjects)
  const setSnapThreshold = useEditorStore((state) => state.setSnapThreshold)
  const selection = useEditorStore((state) => state.selection)
  const setTemporaryPan = useEditorStore((state) => state.setTemporaryPan)
  const [status, setStatus] = useState('Autosave ready')

  useEffect(() => {
    document.title = 'amanXD'
    void loadGoogleFont('Inter')
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const isTyping =
        target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.tagName === 'SELECT'
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
        event.preventDefault()
        if (event.shiftKey) redo()
        else undo()
        return
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'y') {
        event.preventDefault()
        redo()
        return
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'd') {
        event.preventDefault()
        duplicateSelection()
        return
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'g') {
        event.preventDefault()
        if (event.shiftKey) ungroupSelection()
        else groupSelection()
        return
      }
      if (!isTyping && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'c') {
        event.preventDefault()
        copySelection()
        return
      }
      if (!isTyping && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'v') {
        event.preventDefault()
        pasteClipboard()
        return
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'l') {
        event.preventDefault()
        toggleSelectedElement('locked')
        return
      }
      if ((event.ctrlKey || event.metaKey) && event.key === ',') {
        event.preventDefault()
        toggleSelectedElement('visible')
        return
      }
      if ((event.ctrlKey || event.metaKey) && event.key === "'") {
        event.preventDefault()
        toggleGrid()
        return
      }
      if ((event.ctrlKey || event.metaKey) && event.key === ';') {
        event.preventDefault()
        toggleSnapToObjects()
        return
      }
      if ((event.ctrlKey || event.metaKey) && event.key === ']') {
        event.preventDefault()
        arrangeSelectedElement(event.shiftKey ? 'front' : 'forward')
        return
      }
      if ((event.ctrlKey || event.metaKey) && event.key === '[') {
        event.preventDefault()
        arrangeSelectedElement(event.shiftKey ? 'back' : 'backward')
        return
      }
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'a') {
        event.preventDefault()
        clearSelection()
        return
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'n') {
        event.preventDefault()
        setFile(createEmptyProject())
        return
      }
      if ((event.ctrlKey || event.metaKey) && ['+', '='].includes(event.key)) {
        event.preventDefault()
        setZoom(zoom + 0.1)
        return
      }
      if ((event.ctrlKey || event.metaKey) && event.key === '-') {
        event.preventDefault()
        setZoom(zoom - 0.1)
        return
      }
      if ((event.ctrlKey || event.metaKey) && event.key === '0') {
        event.preventDefault()
        setZoom(0.82)
        return
      }
      if ((event.ctrlKey || event.metaKey) && event.key === '1') {
        event.preventDefault()
        setZoom(1)
        return
      }
      if ((event.ctrlKey || event.metaKey) && event.key === '2') {
        event.preventDefault()
        setZoom(2)
        return
      }
      if (!isTyping && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault()
        const step = event.shiftKey ? 10 : 1
        const dx = event.key === 'ArrowLeft' ? -step : event.key === 'ArrowRight' ? step : 0
        const dy = event.key === 'ArrowUp' ? -step : event.key === 'ArrowDown' ? step : 0
        nudgeSelection(dx, dy)
        return
      }
      if (!isTyping && (event.key === 'Delete' || event.key === 'Backspace')) {
        event.preventDefault()
        deleteSelection()
        return
      }
      if (!isTyping && event.code === 'Space' && !event.repeat) {
        event.preventDefault()
        setTemporaryPan(true)
        return
      }
      if (!isTyping && !event.ctrlKey && !event.metaKey && !event.altKey) {
        const key = event.key.toLowerCase()
        if (key === 'v') setTool('select')
        if (key === 'r' && selection.frameId) addElement(selection.frameId, 'rectangle')
        if (key === 'e' && selection.frameId) addElement(selection.frameId, 'ellipse')
        if (key === 'l' && selection.frameId) addElement(selection.frameId, 'line')
        if (key === 't' && selection.frameId) addElement(selection.frameId, 'text')
        if (key === 'a') addFrame()
      }
    }
    const onKeyUp = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const isTyping =
        target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.tagName === 'SELECT'
      if (!isTyping && event.code === 'Space') {
        event.preventDefault()
        setTemporaryPan(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [
    addElement,
    addFrame,
    arrangeSelectedElement,
    clearSelection,
    copySelection,
    deleteSelection,
    duplicateSelection,
    groupSelection,
    nudgeSelection,
    pasteClipboard,
    redo,
    selection.frameId,
    setFile,
    setTemporaryPan,
    setTool,
    setZoom,
    toggleSnapToObjects,
    toggleSelectedElement,
    toggleGrid,
    ungroupSelection,
    undo,
    zoom,
  ])

  async function importProject(projectFile: File) {
    try {
      const raw = await projectFile.text()
      const parsed = parseProjectFile(JSON.parse(raw))
      setFile(parsed)
      setStatus(`Imported ${parsed.project.name}`)
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not import project')
    }
  }

  function renameCurrentProject() {
    const nextName = window.prompt('Rename project', file.project.name)
    if (!nextName) return
    renameProject(nextName)
    setStatus(`Renamed project to ${nextName.trim()}`)
  }

  async function exportProject() {
    await downloadText(`${safeDownloadName(file.project.name)}.amanxd.json`, JSON.stringify(file, null, 2))
    setStatus('Project JSON exported')
  }

  async function exportHandoff() {
    await downloadText(
      `${safeDownloadName(file.project.name)}-handoff.json`,
      JSON.stringify(createHandoffMetadata(file.project), null, 2),
    )
    setStatus('Handoff metadata exported')
  }

  async function exportFramePng() {
    const ok = await canvasRef.current?.exportSelectedFrame()
    setStatus(ok ? 'Selected frame PNG exported' : 'Select a frame before exporting PNG')
  }

  async function exportAllFrames() {
    const count = await canvasRef.current?.exportAllFrames({ format: 'png', pixelRatio: 2 }) ?? 0
    setStatus(count ? `Exported ${count} artboard(s)` : 'No artboards exported')
  }

  async function exportSelectedJpg() {
    const ok = await canvasRef.current?.exportSelectedFrame({ format: 'jpeg', pixelRatio: 2, quality: 0.9 })
    setStatus(ok ? 'Selected frame JPG exported' : 'Select a frame before exporting JPG')
  }

  async function exportMarkedAssets() {
    const count = await canvasRef.current?.exportMarkedAssets({ format: 'png', pixelRatio: 2 }) ?? 0
    setStatus(count ? `Exported ${count} marked asset(s)` : 'No marked assets found')
  }

  async function exportSelectedAsset() {
    const ok = await canvasRef.current?.exportSelectedAsset({ format: 'png', pixelRatio: 2 })
    setStatus(ok ? 'Selected asset PNG exported' : 'Select an element before exporting asset')
  }

  async function exportSelectedAssets() {
    const ok = await canvasRef.current?.exportSelectedAssets({ format: 'png', pixelRatio: 2 })
    setStatus(ok ? 'Selected layer(s) PNG exported' : 'Select one or more layers before exporting')
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="topbar-left">
          <div className="window-dots" aria-hidden="true">
            <span className="dot" style={{ background: '#ff5f57' }} />
            <span className="dot" style={{ background: '#ffbd2e' }} />
            <span className="dot" style={{ background: '#28c840' }} />
          </div>
          <div className="menu-root home-menu">
            <button className="icon-button home-button" title="Home / project actions" type="button">
              <Home size={15} />
            </button>
            <div className="menu-popover">
              <button className="menu-item" onClick={() => setFile(createEmptyProject())} type="button">
                Create empty project <span className="menu-shortcut">Blank</span>
              </button>
              <button className="menu-item" onClick={() => fileInputRef.current?.click()} type="button">
                Open/import project <span className="menu-shortcut">JSON</span>
              </button>
              <button className="menu-item" onClick={() => void exportProject()} type="button">
                Save local document <span className="menu-shortcut">.amanxd</span>
              </button>
              <div className="menu-separator" />
              <button className="menu-item" onClick={() => setFile(sampleProject)} type="button">
                Load sample project <span className="menu-shortcut">Demo</span>
              </button>
            </div>
          </div>
          <nav className="menu-bar" aria-label="File and project menus">
            <div className="menu-root">
              <button className="menu-trigger" type="button">File</button>
              <div className="menu-popover">
                <button className="menu-item" onClick={() => setFile(createEmptyProject())} type="button">
                  New <span className="menu-shortcut">Ctrl+N</span>
                </button>
                <button className="menu-item" onClick={() => fileInputRef.current?.click()} type="button">
                  Import <span className="menu-shortcut">Ctrl+Shift+I</span>
                </button>
                <button className="menu-item" onClick={() => void exportProject()} type="button">
                  Save as local document <span className="menu-shortcut">JSON</span>
                </button>
                <div className="menu-separator" />
                <button className="menu-item" onClick={() => void exportProject()} type="button">
                  Export project <span className="menu-shortcut">.amanxd</span>
                </button>
                <button className="menu-item" onClick={() => void exportFramePng()} type="button">
                  Export selected artboard <span className="menu-shortcut">PNG</span>
                </button>
                <button className="menu-item" onClick={() => void exportSelectedJpg()} type="button">
                  Export selected artboard <span className="menu-shortcut">JPG</span>
                </button>
                <button className="menu-item" onClick={() => void exportAllFrames()} type="button">
                  Export all artboards <span className="menu-shortcut">PNG 2x</span>
                </button>
                <button className="menu-item" onClick={() => void exportSelectedAsset()} type="button">
                  Export selected layer <span className="menu-shortcut">PNG</span>
                </button>
                <button className="menu-item" onClick={() => void exportSelectedAssets()} type="button">
                  Export selected layers as one asset <span className="menu-shortcut">PNG</span>
                </button>
                <button className="menu-item" onClick={() => void exportMarkedAssets()} type="button">
                  Batch export marked assets <span className="menu-shortcut">PNG</span>
                </button>
                <button className="menu-item" onClick={() => void exportHandoff()} type="button">
                  Export handoff metadata <span className="menu-shortcut">JSON</span>
                </button>
                <button className="menu-item is-disabled" disabled type="button">
                  Export SVG <span className="menu-shortcut">Soon</span>
                </button>
                <button className="menu-item is-disabled" disabled type="button">
                  Export PDF <span className="menu-shortcut">Soon</span>
                </button>
              </div>
            </div>
            <div className="menu-root">
              <button className="menu-trigger" type="button">Edit</button>
              <div className="menu-popover">
                <button className="menu-item" onClick={undo} type="button">
                  Undo <span className="menu-shortcut">Ctrl+Z</span>
                </button>
                <button className="menu-item" onClick={redo} type="button">
                  Redo <span className="menu-shortcut">Ctrl+Shift+Z</span>
                </button>
                <button className="menu-item" onClick={duplicateSelection} type="button">
                  Duplicate <span className="menu-shortcut">Ctrl+D</span>
                </button>
                <button className="menu-item" onClick={copySelection} type="button">
                  Copy <span className="menu-shortcut">Ctrl+C</span>
                </button>
                <button className="menu-item" onClick={pasteClipboard} type="button">
                  Paste <span className="menu-shortcut">Ctrl+V</span>
                </button>
                <button className="menu-item" onClick={deleteSelection} type="button">
                  Delete <span className="menu-shortcut">Delete</span>
                </button>
                <button className="menu-item" onClick={clearSelection} type="button">
                  Deselect all <span className="menu-shortcut">Ctrl+Shift+A</span>
                </button>
              </div>
            </div>
            <div className="menu-root">
              <button className="menu-trigger" type="button">Object</button>
              <div className="menu-popover">
                <button className="menu-item" onClick={() => toggleSelectedElement('locked')} type="button">
                  Lock / Unlock <span className="menu-shortcut">Ctrl+L</span>
                </button>
                <button className="menu-item" onClick={() => toggleSelectedElement('visible')} type="button">
                  Hide / Show <span className="menu-shortcut">Ctrl+,</span>
                </button>
                <div className="menu-separator" />
                <button className="menu-item" onClick={groupSelection} type="button">
                  Group <span className="menu-shortcut">Ctrl+G</span>
                </button>
                <button className="menu-item" onClick={ungroupSelection} type="button">
                  Ungroup <span className="menu-shortcut">Ctrl+Shift+G</span>
                </button>
                <div className="menu-separator" />
                <button className="menu-item" onClick={() => arrangeSelectedElement('front')} type="button">
                  Bring to front <span className="menu-shortcut">Ctrl+Shift+]</span>
                </button>
                <button className="menu-item" onClick={() => arrangeSelectedElement('forward')} type="button">
                  Bring forward <span className="menu-shortcut">Ctrl+]</span>
                </button>
                <button className="menu-item" onClick={() => arrangeSelectedElement('backward')} type="button">
                  Send backward <span className="menu-shortcut">Ctrl+[</span>
                </button>
                <button className="menu-item" onClick={() => arrangeSelectedElement('back')} type="button">
                  Send to back <span className="menu-shortcut">Ctrl+Shift+[</span>
                </button>
                <div className="menu-separator" />
                <button className="menu-item" onClick={() => alignSelection('left')} type="button">
                  Align left
                </button>
                <button className="menu-item" onClick={() => alignSelection('center')} type="button">
                  Align center
                </button>
                <button className="menu-item" onClick={() => alignSelection('right')} type="button">
                  Align right
                </button>
                <button className="menu-item" onClick={() => alignSelection('top')} type="button">
                  Align top
                </button>
                <button className="menu-item" onClick={() => alignSelection('middle')} type="button">
                  Align middle
                </button>
                <button className="menu-item" onClick={() => alignSelection('bottom')} type="button">
                  Align bottom
                </button>
                <button className="menu-item" onClick={() => distributeSelection('horizontal')} type="button">
                  Distribute horizontal
                </button>
                <button className="menu-item" onClick={() => distributeSelection('vertical')} type="button">
                  Distribute vertical
                </button>
              </div>
            </div>
            <div className="menu-root">
              <button className="menu-trigger" type="button">View</button>
              <div className="menu-popover">
                <button className="menu-item" onClick={() => setZoom(1)} type="button">
                  100% <span className="menu-shortcut">Ctrl+1</span>
                </button>
                <button className="menu-item" onClick={() => setZoom(2)} type="button">
                  200% <span className="menu-shortcut">Ctrl+2</span>
                </button>
                <button className="menu-item" onClick={() => setZoom(0.82)} type="button">
                  Zoom to fit <span className="menu-shortcut">Ctrl+0</span>
                </button>
                <button className="menu-item" onClick={toggleGrid} type="button">
                  {showGrid ? 'Hide square grid' : 'Show square grid'}{' '}
                  <span className="menu-shortcut">Ctrl+'</span>
                </button>
                <button className="menu-item" onClick={toggleSnapToObjects} type="button">
                  {snapToObjects ? 'Disable snapping' : 'Enable snapping'}{' '}
                  <span className="menu-shortcut">Ctrl+;</span>
                </button>
                <label className="menu-item menu-field">
                  Snap distance
                  <input
                    aria-label="Snap distance"
                    max={24}
                    min={1}
                    onChange={(event) => setSnapThreshold(Number(event.target.value))}
                    type="number"
                    value={snapThreshold}
                  />
                </label>
                <button className="menu-item" onClick={roundSelectedElementToPixelGrid} type="button">
                  Align to pixel grid
                </button>
              </div>
            </div>
          </nav>
          <div className="tabs">
            <button className="tab active" type="button">
              Design
            </button>
          </div>
        </div>
        <div className="project-title">
          <div className="menu-root project-menu">
            <button className="project-title-button" type="button">amanXD / {file.project.name}</button>
            <div className="menu-popover">
              <button className="menu-item" onClick={() => setFile(createEmptyProject())} type="button">
                Create empty project <span className="menu-shortcut">Blank</span>
              </button>
              <button className="menu-item" onClick={() => setFile(sampleProject)} type="button">
                New from sample <span className="menu-shortcut">Reset</span>
              </button>
              <button className="menu-item" onClick={renameCurrentProject} type="button">
                Rename project <span className="menu-shortcut">Name</span>
              </button>
              <button className="menu-item is-disabled" disabled type="button">
                Project settings <span className="menu-shortcut">Soon</span>
              </button>
            </div>
          </div>
        </div>
        <div className="top-actions">
          <button className="icon-button" onClick={() => fileInputRef.current?.click()} title="Import project" type="button">
            <Upload size={15} />
          </button>
          <button className="icon-button" onClick={() => setFile(sampleProject)} title="Reset sample" type="button">
            <RotateCcw size={15} />
          </button>
          <button className="command-button compact-command" onClick={() => setFile(createEmptyProject())} type="button">
            New
          </button>
          <button className="icon-button" onClick={undo} title="Undo" type="button">
            <Undo2 size={15} />
          </button>
          <button className="icon-button" onClick={redo} title="Redo" type="button">
            <Redo2 size={15} />
          </button>
          <button className="icon-button" onClick={() => toggleSelectedElement('locked')} title="Lock / unlock layer" type="button">
            {getSelectedLockIcon(file, selection) ? <Unlock size={15} /> : <Lock size={15} />}
          </button>
          <div className="alignment-toolbar" aria-label="Alignment controls">
            <button className="mini-text-button" disabled={!selection.elementId} onClick={() => alignSelection('left')} title="Align left" type="button">L</button>
            <button className="mini-text-button" disabled={!selection.elementId} onClick={() => alignSelection('center')} title="Align horizontal center" type="button">C</button>
            <button className="mini-text-button" disabled={!selection.elementId} onClick={() => alignSelection('right')} title="Align right" type="button">R</button>
            <button className="mini-text-button" disabled={!selection.elementId} onClick={() => alignSelection('top')} title="Align top" type="button">T</button>
            <button className="mini-text-button" disabled={!selection.elementId} onClick={() => alignSelection('middle')} title="Align vertical center" type="button">M</button>
            <button className="mini-text-button" disabled={!selection.elementId} onClick={() => alignSelection('bottom')} title="Align bottom" type="button">B</button>
            <button className="mini-text-button" disabled={(selection.elementIds?.length ?? 0) < 3} onClick={() => distributeSelection('horizontal')} title="Distribute horizontal" type="button">DH</button>
            <button className="mini-text-button" disabled={(selection.elementIds?.length ?? 0) < 3} onClick={() => distributeSelection('vertical')} title="Distribute vertical" type="button">DV</button>
          </div>
          <button className="icon-button" onClick={roundSelectedElementToPixelGrid} title="Align to pixel grid" type="button">
            <Scan size={15} />
          </button>
          <button
            className={`icon-button ${snapToObjects ? 'active' : ''}`}
            onClick={toggleSnapToObjects}
            title={`Object snapping ${snapToObjects ? 'on' : 'off'} (${snapThreshold}px)`}
            type="button"
          >
            <Magnet size={15} />
          </button>
          <button className="icon-button" onClick={() => void exportProject()} title="Export project JSON" type="button">
            <FileJson size={15} />
          </button>
          <button className="icon-button" onClick={() => void exportFramePng()} title="Export selected artboard PNG" type="button">
            <ImageDown size={15} />
          </button>
          <button className="icon-button" onClick={() => void exportHandoff()} title="Export handoff metadata" type="button">
            <Download size={15} />
          </button>
          <button className="icon-button" title={status} type="button">
            <PanelsTopLeft size={16} />
          </button>
          <span className="zoom-readout">{Math.round(zoom * 100)}%</span>
          <input
            accept=".json,.amanxd.json,.myxd.json,application/json"
            className="hidden-input"
            onChange={(event) => {
              const projectFile = event.target.files?.[0]
              if (projectFile) void importProject(projectFile)
              event.currentTarget.value = ''
            }}
            ref={fileInputRef}
            type="file"
          />
        </div>
      </header>
      <section className="workspace">
        <ToolRail />
        <aside className="side-panel">
          <LayersPanel />
          <AssetsPanel />
        </aside>
        <CanvasBoard ref={canvasRef} />
        <InspectorPanel />
      </section>
    </main>
  )
}

function getSelectedLockIcon(file: ReturnType<typeof useEditorStore.getState>['file'], selection: ReturnType<typeof useEditorStore.getState>['selection']) {
  return Boolean(getSelectedElement(file, selection)?.locked)
}
