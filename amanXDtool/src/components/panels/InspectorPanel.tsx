import { useState } from 'react'
import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, RotateCcw, Trash2, Underline } from 'lucide-react'
import { googleFonts, loadGoogleFont } from '../../data/fonts'
import {
  getSelectedElement,
  getSelectedFrame,
  useEditorStore,
} from '../../store/editorStore'
import type { DesignElement, ElementStyle, Frame } from '../../types/project'

const textAlignButtons = [
  { value: 'left' as const, icon: AlignLeft },
  { value: 'center' as const, icon: AlignCenter },
  { value: 'right' as const, icon: AlignRight },
]

export function InspectorPanel() {
  const file = useEditorStore((state) => state.file)
  const selection = useEditorStore((state) => state.selection)
  const updateFrame = useEditorStore((state) => state.updateFrame)
  const updateElement = useEditorStore((state) => state.updateElement)
  const deleteElement = useEditorStore((state) => state.deleteElement)
  const nestSelectionInContainingElement = useEditorStore(
    (state) => state.nestSelectionInContainingElement,
  )
  const frame = getSelectedFrame(file, selection.frameId)
  const element = getSelectedElement(file, selection)

  return (
    <aside className="inspector">
      <section className="panel-section">
        <div className="section-title">Inspector</div>
        <div className="subtle">
          {element ? `${element.type} / ${element.name}` : frame ? `Frame / ${frame.name}` : 'Nothing selected'}
        </div>
      </section>
      {element && frame ? (
        <ElementInspector
          element={element}
          frame={frame}
          onDelete={() => deleteElement(frame.id, element.id)}
          onNest={nestSelectionInContainingElement}
          onUpdate={(patch) => updateElement(frame.id, element.id, patch)}
        />
      ) : frame ? (
        <FrameInspector frame={frame} onUpdate={(patch) => updateFrame(frame.id, patch)} />
      ) : (
        <section className="panel-section">
          <div className="preview-frame">Select a frame or layer</div>
        </section>
      )}
    </aside>
  )
}

function FrameInspector({ frame, onUpdate }: { frame: Frame; onUpdate: (patch: Partial<Frame>) => void }) {
  return (
    <>
      <section className="panel-section stack">
        <div className="section-title">Frame</div>
        <TextField label="Name" value={frame.name} onChange={(name) => onUpdate({ name })} />
        <div className="field-grid">
          <NumberField label="W" value={frame.width} onChange={(width) => onUpdate({ width })} />
          <NumberField label="H" value={frame.height} onChange={(height) => onUpdate({ height })} />
          <NumberField label="X" value={frame.x} onChange={(x) => onUpdate({ x })} />
          <NumberField label="Y" value={frame.y} onChange={(y) => onUpdate({ y })} />
        </div>
        <ColorField label="Background" value={frame.background} onChange={(background) => onUpdate({ background })} />
      </section>
    </>
  )
}

function ElementInspector({
  element,
  frame,
  onUpdate,
  onDelete,
  onNest,
}: {
  element: DesignElement
  frame: Frame
  onUpdate: (patch: Partial<DesignElement>) => void
  onDelete: () => void
  onNest: () => void
}) {
  const updateStyle = (stylePatch: Partial<ElementStyle>) =>
    onUpdate({ style: { ...element.style, ...stylePatch } })
  const style = element.style

  return (
    <>
      <section className="panel-section stack">
        <div className="section-title">
          Transform <RotateCcw size={13} />
        </div>
        <TextField label="Name" value={element.name} onChange={(name) => onUpdate({ name })} />
        <div className="field-grid">
          <NumberField label="X" value={element.x} onChange={(x) => onUpdate({ x })} />
          <NumberField label="Y" value={element.y} onChange={(y) => onUpdate({ y })} />
          <NumberField label="W" value={element.width} onChange={(width) => onUpdate({ width })} />
          <NumberField label="H" value={element.height} onChange={(height) => onUpdate({ height })} />
          <NumberField label="Rotate" value={element.rotation} onChange={(rotation) => onUpdate({ rotation })} />
          <NumberField
            label="Opacity"
            max={1}
            min={0}
            step={0.05}
            value={element.opacity}
            onChange={(opacity) => onUpdate({ opacity })}
          />
        </div>
      </section>
      {element.type === 'text' && (
        <section className="panel-section stack">
          <div className="section-title">Text</div>
          <label className="label">
            Content
            <textarea
              className="textarea"
              onChange={(event) => onUpdate({ content: event.target.value })}
              value={element.content ?? ''}
            />
          </label>
          <TextField
            label="Font"
            value={style.typography?.fontFamily ?? 'Inter'}
            options={googleFonts.map((font) => font.family)}
            onChange={(fontFamily) => {
              void loadGoogleFont(fontFamily)
              updateStyle({
                typography: { ...requiredTypography(style), fontFamily },
              })
            }}
          />
          <div className="field-grid">
            <NumberField
              label="Size"
              value={style.typography?.fontSize ?? 18}
              onChange={(fontSize) =>
                updateStyle({ typography: { ...requiredTypography(style), fontSize } })
              }
            />
            <NumberField
              label="Weight"
              step={100}
              value={style.typography?.fontWeight ?? 500}
              onChange={(fontWeight) =>
                updateStyle({ typography: { ...requiredTypography(style), fontWeight } })
              }
            />
            <NumberField
              label="Line"
              step={0.05}
              value={style.typography?.lineHeight ?? 1.2}
              onChange={(lineHeight) =>
                updateStyle({ typography: { ...requiredTypography(style), lineHeight } })
              }
            />
            <NumberField
              label="Track"
              value={style.typography?.letterSpacing ?? 0}
              onChange={(letterSpacing) =>
                updateStyle({ typography: { ...requiredTypography(style), letterSpacing } })
              }
            />
          </div>
          <div className="segmented-control" aria-label="Text style">
            <button
              className={style.typography?.fontWeight && style.typography.fontWeight >= 700 ? 'active' : ''}
              onClick={() =>
                updateStyle({
                  typography: {
                    ...requiredTypography(style),
                    fontWeight: (style.typography?.fontWeight ?? 500) >= 700 ? 500 : 700,
                  },
                })
              }
              title="Bold"
              type="button"
            >
              <Bold size={14} />
            </button>
            <button
              className={style.typography?.fontStyle === 'italic' ? 'active' : ''}
              onClick={() =>
                updateStyle({
                  typography: {
                    ...requiredTypography(style),
                    fontStyle: style.typography?.fontStyle === 'italic' ? 'normal' : 'italic',
                  },
                })
              }
              title="Italic"
              type="button"
            >
              <Italic size={14} />
            </button>
            <button
              className={style.typography?.decoration === 'underline' ? 'active' : ''}
              onClick={() =>
                updateStyle({
                  typography: {
                    ...requiredTypography(style),
                    decoration: style.typography?.decoration === 'underline' ? 'none' : 'underline',
                  },
                })
              }
              title="Underline"
              type="button"
            >
              <Underline size={14} />
            </button>
          </div>
          <div className="segmented-control" aria-label="Text alignment">
            {textAlignButtons.map(({ value: align, icon: Icon }) => (
              <button
                className={(style.typography?.align ?? 'left') === align ? 'active' : ''}
                key={align}
                onClick={() =>
                  updateStyle({
                    typography: {
                      ...requiredTypography(style),
                      align,
                    },
                  })
                }
                title={`Align ${align}`}
                type="button"
              >
                <Icon size={14} />
              </button>
            ))}
          </div>
          <label className="label">
            Case
            <select
              className="select"
              onChange={(event) =>
                updateStyle({
                  typography: {
                    ...requiredTypography(style),
                    textTransform: event.target.value as 'none' | 'uppercase' | 'lowercase' | 'capitalize',
                  },
                })
              }
              value={style.typography?.textTransform ?? 'none'}
            >
              <option value="none">Normal</option>
              <option value="uppercase">Uppercase</option>
              <option value="lowercase">Lowercase</option>
              <option value="capitalize">Capitalize</option>
            </select>
          </label>
          <ColorField
            label="Text Color"
            value={style.typography?.color ?? '#111827'}
            onChange={(color) => updateStyle({ typography: { ...requiredTypography(style), color } })}
          />
          <button className="command-button" onClick={onNest} type="button">
            Nest in containing shape
          </button>
        </section>
      )}
      <section className="panel-section stack">
        <div className="section-title">Appearance</div>
        {element.type !== 'text' && (
          <ImageSourceField
            value={element.src ?? ''}
            onChange={(src) =>
              onUpdate({
                src: src || undefined,
                style: { ...element.style, imageFit: src ? 'cover' : element.style.imageFit },
              })
            }
          />
        )}
        {element.src && (
          <>
            <label className="label">
              Image Fit
              <select
                className="select"
                onChange={(event) =>
                  updateStyle({
                    imageFit: event.target.value as 'cover' | 'contain' | 'stretch',
                    imageCrop: { x: 0, y: 0, scale: 1 },
                  })
                }
                value={style.imageFit ?? 'cover'}
              >
                <option value="cover">Cover</option>
                <option value="contain">Contain</option>
                <option value="stretch">Stretch</option>
              </select>
            </label>
            <div className="field-grid">
              <NumberField
                label="Img X"
                value={style.imageCrop?.x ?? 0}
                onChange={(x) => updateStyle({ imageCrop: { ...(style.imageCrop ?? { y: 0, scale: 1 }), x } })}
              />
              <NumberField
                label="Img Y"
                value={style.imageCrop?.y ?? 0}
                onChange={(y) => updateStyle({ imageCrop: { ...(style.imageCrop ?? { x: 0, scale: 1 }), y } })}
              />
              <NumberField
                label="Img Scale"
                min={0.1}
                step={0.1}
                value={style.imageCrop?.scale ?? 1}
                onChange={(scale) =>
                  updateStyle({ imageCrop: { ...(style.imageCrop ?? { x: 0, y: 0 }), scale } })
                }
              />
            </div>
          </>
        )}
        <ColorField label="Fill" value={style.fill} onChange={(fill) => updateStyle({ fill })} />
        <div className="field-grid">
          <NumberField
            label="Border"
            value={style.stroke.width}
            onChange={(width) => updateStyle({ stroke: { ...style.stroke, enabled: width > 0, width } })}
          />
          <ColorField
            label="Stroke"
            value={style.stroke.color}
            onChange={(color) => updateStyle({ stroke: { ...style.stroke, color, enabled: true } })}
          />
        </div>
        <div className="field-grid four">
          <NumberField
            label="TL"
            value={style.cornerRadius.topLeft}
            onChange={(topLeft) =>
              updateStyle({ cornerRadius: { ...style.cornerRadius, topLeft } })
            }
          />
          <NumberField
            label="TR"
            value={style.cornerRadius.topRight}
            onChange={(topRight) =>
              updateStyle({ cornerRadius: { ...style.cornerRadius, topRight } })
            }
          />
          <NumberField
            label="BR"
            value={style.cornerRadius.bottomRight}
            onChange={(bottomRight) =>
              updateStyle({ cornerRadius: { ...style.cornerRadius, bottomRight } })
            }
          />
          <NumberField
            label="BL"
            value={style.cornerRadius.bottomLeft}
            onChange={(bottomLeft) =>
              updateStyle({ cornerRadius: { ...style.cornerRadius, bottomLeft } })
            }
          />
        </div>
      </section>
      <section className="panel-section stack">
        <div className="section-title">Shadow</div>
        <label className="asset-chip">
          <span>Enabled</span>
          <input
            checked={style.shadow.enabled}
            onChange={(event) =>
              updateStyle({ shadow: { ...style.shadow, enabled: event.target.checked } })
            }
            type="checkbox"
          />
        </label>
        <div className="field-grid">
          <NumberField label="X" value={style.shadow.x} onChange={(x) => updateStyle({ shadow: { ...style.shadow, x } })} />
          <NumberField label="Y" value={style.shadow.y} onChange={(y) => updateStyle({ shadow: { ...style.shadow, y } })} />
          <NumberField
            label="Blur"
            value={style.shadow.blur}
            onChange={(blur) => updateStyle({ shadow: { ...style.shadow, blur } })}
          />
          <NumberField
            label="Alpha"
            max={1}
            min={0}
            step={0.05}
            value={style.shadow.opacity}
            onChange={(opacity) => updateStyle({ shadow: { ...style.shadow, opacity } })}
          />
        </div>
        <ColorField
          label="Shadow Color"
          value={style.shadow.color}
          onChange={(color) => updateStyle({ shadow: { ...style.shadow, color } })}
        />
      </section>
      <section className="panel-section stack">
        <div className="section-title">Export</div>
        <div className="subtle">Current frame: {frame.name}. Design mode only is enabled in this version.</div>
        <label className="asset-chip">
          <span>Mark for Export</span>
          <input
            checked={Boolean(element.markForExport)}
            onChange={(event) => onUpdate({ markForExport: event.target.checked })}
            type="checkbox"
          />
        </label>
        <button className="command-button" onClick={onDelete} type="button">
          <Trash2 size={14} /> Delete layer
        </button>
      </section>
    </>
  )
}

function ImageSourceField({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="stack">
      <TextField label="Image URL / Fill" value={value} onChange={onChange} />
      <div className="button-row">
        <label className="command-button">
          Upload Image
          <input
            accept="image/*"
            className="hidden-input"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (!file) return
              const reader = new FileReader()
              reader.onload = () => onChange(String(reader.result))
              reader.readAsDataURL(file)
              event.currentTarget.value = ''
            }}
            type="file"
          />
        </label>
        <button className="command-button" onClick={() => onChange('')} type="button">
          Clear Image
        </button>
      </div>
    </div>
  )
}

function requiredTypography(style: ElementStyle) {
  return (
    style.typography ?? {
      fontFamily: 'Inter',
      fontSize: 18,
      fontWeight: 500,
      lineHeight: 1.2,
      letterSpacing: 0,
      align: 'left' as const,
      color: '#111827',
      fontStyle: 'normal' as const,
      decoration: 'none' as const,
      textTransform: 'none' as const,
    }
  )
}

function TextField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options?: string[]
}) {
  return (
    <label className="label">
      {label}
      {options ? (
        <select className="select" onChange={(event) => onChange(event.target.value)} value={value}>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input className="field" onChange={(event) => onChange(event.target.value)} value={value} />
      )}
    </label>
  )
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
}) {
  return (
    <label className="label">
      {label}
      <input
        className="field"
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        step={step}
        type="number"
        value={Number.isFinite(value) ? value : 0}
      />
    </label>
  )
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  const [draft, setDraft] = useState({ source: value, value })
  const currentValue = draft.source === value ? draft.value : value

  const commit = () => {
    if (currentValue !== value) onChange(currentValue)
  }

  const updateColor = (nextValue: string, live = false) => {
    setDraft({ source: value, value: nextValue })
    if (live && nextValue !== value) onChange(nextValue)
  }

  return (
    <label className="label">
      {label}
      <span style={{ display: 'grid', gridTemplateColumns: '32px 1fr', gap: 6 }}>
        <input
          className="field"
          onBlur={commit}
          onChange={(event) => updateColor(event.target.value, true)}
          style={{ padding: 2 }}
          type="color"
          value={currentValue.startsWith('#') ? currentValue : '#ffffff'}
        />
        <input
          className="field"
          onBlur={commit}
          onChange={(event) => updateColor(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') commit()
          }}
          value={currentValue}
        />
      </span>
    </label>
  )
}
