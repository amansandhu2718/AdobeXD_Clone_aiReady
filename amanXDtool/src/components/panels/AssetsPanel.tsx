import { useRef } from 'react'
import { Plus } from 'lucide-react'
import { iconAssets } from '../../data/iconRegistry'
import { googleFonts, loadGoogleFont } from '../../data/fonts'
import { useEditorStore } from '../../store/editorStore'

export function AssetsPanel() {
  const imageInputRef = useRef<HTMLInputElement>(null)
  const assets = useEditorStore((state) => state.file.project.assets)
  const selection = useEditorStore((state) => state.selection)
  const addIconElement = useEditorStore((state) => state.addIconElement)
  const addImageAsset = useEditorStore((state) => state.addImageAsset)
  const applyColorAssetToSelection = useEditorStore((state) => state.applyColorAssetToSelection)
  const applyTextStyleAssetToSelection = useEditorStore((state) => state.applyTextStyleAssetToSelection)
  const applyImageAssetToSelection = useEditorStore((state) => state.applyImageAssetToSelection)

  const importRemoteImage = () => {
    const src = window.prompt('Image URL')
    if (!src?.trim()) return
    const name = window.prompt('Asset name', 'Remote image')?.trim() || 'Remote image'
    addImageAsset({ name, src: src.trim(), source: src.includes('unsplash.com') ? 'unsplash' : 'remote' })
  }

  return (
    <>
      <section className="panel-section">
        <div className="section-title">
          Libraries <Plus className="is-disabled" size={13} />
        </div>
        <div className="stack">
          {assets.colors.map((color) => (
            <button
              className="asset-chip"
              disabled={!selection.elementId}
              key={color.id}
              onClick={() => applyColorAssetToSelection(color.value)}
              title={selection.elementId ? `Apply ${color.name}` : 'Select a layer to apply this color'}
              type="button"
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span className="swatch" style={{ background: color.value }} />
                {color.name}
              </span>
              <span className="subtle">{color.value}</span>
            </button>
          ))}
        </div>
      </section>
      <section className="panel-section">
        <div className="section-title">Character Styles</div>
        <div className="stack">
          {assets.textStyles.map((style) => (
            <button
              className="asset-chip"
              disabled={!selection.elementId}
              key={style.id}
              onClick={() => applyTextStyleAssetToSelection(style.id)}
              style={{ fontFamily: style.fontFamily }}
              title={selection.elementId ? `Apply ${style.name}` : 'Select a text layer to apply this style'}
              type="button"
            >
              <span>{style.name}</span>
              <span className="subtle">{style.fontSize}px / {style.fontWeight}</span>
            </button>
          ))}
        </div>
      </section>
      <section className="panel-section">
        <div className="section-title">Google Fonts</div>
        <div className="stack">
          {googleFonts.map((font) => (
            <button
              className="asset-chip"
              key={font.family}
              onClick={() => loadGoogleFont(font.family)}
              style={{ fontFamily: font.family }}
              type="button"
            >
              <span>{font.family}</span>
              <span className="subtle">Load</span>
            </button>
          ))}
        </div>
      </section>
      <section className="panel-section">
        <div className="section-title">Icons</div>
        <select
          className="select"
          disabled={!selection.frameId}
          onChange={(event) => {
            if (!event.target.value || !selection.frameId) return
            addIconElement(selection.frameId, event.target.value)
            event.currentTarget.value = ''
          }}
          title={selection.frameId ? 'Insert icon on selected artboard' : 'Select an artboard first'}
        >
          <option value="">Insert icon...</option>
          {iconAssets.map((icon) => (
            <option key={icon.id} value={icon.id}>
              {icon.category} / {icon.name}
            </option>
          ))}
        </select>
        <div className="icon-grid" aria-label="Icon library">
          {iconAssets.map((icon) => (
            <button
              className="icon-asset-button"
              disabled={!selection.frameId}
              key={icon.id}
              onClick={() => selection.frameId && addIconElement(selection.frameId, icon.id)}
              title={selection.frameId ? `Insert ${icon.name}` : 'Select an artboard first'}
              type="button"
            >
              <img
                alt=""
                src={`data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#202124" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icon.svgPath}</svg>`)}`}
              />
              <span>{icon.name}</span>
            </button>
          ))}
        </div>
      </section>
      <section className="panel-section">
        <div className="section-title">
          Images
          <button className="icon-mini" onClick={() => imageInputRef.current?.click()} title="Upload image asset" type="button">
            <Plus size={12} />
          </button>
        </div>
        <div className="button-row">
          <button className="command-button" onClick={() => imageInputRef.current?.click()} type="button">
            Upload
          </button>
          <button className="command-button" onClick={importRemoteImage} type="button">
            URL
          </button>
        </div>
        <input
          accept="image/*"
          className="hidden-input"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (!file) return
            const reader = new FileReader()
            reader.onload = () => {
              addImageAsset({
                name: file.name.replace(/\.[^.]+$/, ''),
                src: String(reader.result),
                source: 'local',
              })
            }
            reader.readAsDataURL(file)
            event.currentTarget.value = ''
          }}
          ref={imageInputRef}
          type="file"
        />
        <div className="stack">
          {assets.images.map((image) => (
            <button
              className="asset-chip image-asset-chip"
              disabled={!selection.elementId}
              key={image.id}
              onClick={() => applyImageAssetToSelection(image.id)}
              title={selection.elementId ? `Fill selected shape with ${image.name}` : 'Select a shape first'}
              type="button"
            >
              <img alt="" src={image.src} />
              <span>{image.name}</span>
              <span className="subtle">{image.source}</span>
            </button>
          ))}
        </div>
      </section>
    </>
  )
}
