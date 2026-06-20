export type ElementType =
  | 'rectangle'
  | 'ellipse'
  | 'line'
  | 'text'
  | 'image'
  | 'group'
  | 'componentInstance'

export type EditorTool =
  | 'select'
  | 'frame'
  | 'rectangle'
  | 'ellipse'
  | 'line'
  | 'text'
  | 'image'
  | 'hand'

export type EditorMode = 'design' | 'prototype' | 'preview'

export interface ColorAsset {
  id: string
  name: string
  value: string
}

export interface TextStyleAsset {
  id: string
  name: string
  fontFamily: string
  fontSize: number
  fontWeight: number
  lineHeight: number
  letterSpacing: number
  color: string
}

export interface ImageAsset {
  id: string
  name: string
  src: string
  source: 'local' | 'unsplash' | 'remote'
}

export interface ComponentAsset {
  id: string
  name: string
  elementIds: string[]
}

export interface ProjectAssets {
  colors: ColorAsset[]
  textStyles: TextStyleAsset[]
  images: ImageAsset[]
  components: ComponentAsset[]
}

export interface StrokeStyle {
  color: string
  width: number
  enabled: boolean
  dash?: number[]
}

export interface ShadowStyle {
  enabled: boolean
  color: string
  x: number
  y: number
  blur: number
  opacity: number
}

export interface CornerRadius {
  topLeft: number
  topRight: number
  bottomRight: number
  bottomLeft: number
}

export interface GradientStop {
  color: string
  offset: number
}

export interface GradientStyle {
  enabled: boolean
  type: 'linear'
  from: { x: number; y: number }
  to: { x: number; y: number }
  stops: GradientStop[]
}

export interface TypographyStyle {
  fontFamily: string
  fontSize: number
  fontWeight: number
  lineHeight: number
  letterSpacing: number
  align: 'left' | 'center' | 'right'
  color: string
}

export interface ElementStyle {
  fill: string
  gradient?: GradientStyle
  stroke: StrokeStyle
  cornerRadius: CornerRadius
  shadow: ShadowStyle
  typography?: TypographyStyle
  imageFit?: 'cover' | 'contain' | 'stretch'
  imageCrop?: {
    x: number
    y: number
    scale: number
  }
  blendMode?: 'normal' | 'multiply' | 'screen' | 'overlay'
}

export interface DesignElement {
  id: string
  type: ElementType
  name: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  opacity: number
  locked: boolean
  visible: boolean
  style: ElementStyle
  content?: string
  assetId?: string
  src?: string
  children?: DesignElement[]
  componentId?: string
  markForExport?: boolean
}

export interface Frame {
  id: string
  name: string
  x: number
  y: number
  width: number
  height: number
  background: string
  elements: DesignElement[]
}

export interface Page {
  id: string
  name: string
  frames: Frame[]
}

export interface PrototypeLink {
  id: string
  fromFrameId: string
  triggerElementId?: string
  toFrameId: string
  transition: 'instant' | 'dissolve' | 'slide-left' | 'slide-right'
}

export interface AmanXDProject {
  id: string
  name: string
  pages: Page[]
  assets: ProjectAssets
  prototypeLinks: PrototypeLink[]
  updatedAt: string
}

export interface AmanXDFile {
  schemaVersion: 1
  project: AmanXDProject
}

export interface SelectionState {
  frameId?: string
  elementId?: string
  elementIds?: string[]
}
