import type { AmanXDProject, DesignElement } from '../types/project'

interface ElementHandoffMetadata {
  id: string
  name: string
  type: string
  x: number
  y: number
  width: number
  height: number
  fill: string
  stroke: DesignElement['style']['stroke']
  cornerRadius: DesignElement['style']['cornerRadius']
  shadow: DesignElement['style']['shadow']
  typography: DesignElement['style']['typography']
  imageFit: DesignElement['style']['imageFit']
  imageCrop: DesignElement['style']['imageCrop']
  markForExport: boolean
  children: ElementHandoffMetadata[]
}

function elementMetadata(element: DesignElement): ElementHandoffMetadata {
  return {
    id: element.id,
    name: element.name,
    type: element.type,
    x: element.x,
    y: element.y,
    width: element.width,
    height: element.height,
    fill: element.style.fill,
    stroke: element.style.stroke,
    cornerRadius: element.style.cornerRadius,
    shadow: element.style.shadow,
    typography: element.style.typography,
    imageFit: element.style.imageFit,
    imageCrop: element.style.imageCrop,
    markForExport: Boolean(element.markForExport),
    children: element.children?.map(elementMetadata) ?? [],
  }
}

export function createHandoffMetadata(project: AmanXDProject) {
  return {
    project: {
      id: project.id,
      name: project.name,
      updatedAt: project.updatedAt,
    },
    frames: project.pages.flatMap((page) =>
      page.frames.map((frame) => ({
        page: page.name,
        id: frame.id,
        name: frame.name,
        width: frame.width,
        height: frame.height,
        background: frame.background,
        elements: frame.elements.map(elementMetadata),
      })),
    ),
    assets: project.assets,
    prototypeLinks: project.prototypeLinks,
  }
}
