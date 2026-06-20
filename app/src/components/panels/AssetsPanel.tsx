import { Plus } from 'lucide-react'
import { googleFonts, loadGoogleFont } from '../../data/fonts'
import { useEditorStore } from '../../store/editorStore'

export function AssetsPanel() {
  const assets = useEditorStore((state) => state.file.project.assets)

  return (
    <>
      <section className="panel-section">
        <div className="section-title">
          Libraries <Plus className="is-disabled" size={13} />
        </div>
        <div className="stack">
          {assets.colors.map((color) => (
            <div className="asset-chip" key={color.id}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span className="swatch" style={{ background: color.value }} />
                {color.name}
              </span>
              <span className="subtle">{color.value}</span>
            </div>
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
        <div className="section-title">Images</div>
        <div className="stack">
          {assets.images.map((image) => (
            <div className="asset-chip" key={image.id}>
              <span>{image.name}</span>
              <span className="subtle">{image.source}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
