export const DEFAULT_PROJECT_PATH = 'projects/current.amanxd.json'

const pathProperty = {
  type: 'string',
  description: 'Project file path relative to the amanXD repository root.',
  default: DEFAULT_PROJECT_PATH,
}

const frameIdProperty = {
  type: 'string',
  description: 'Target artboard/frame id. Use list_project to inspect existing frame ids.',
}

const styleProperty = {
  type: 'object',
  description:
    'Partial amanXD style override. Supports fill, stroke, cornerRadius, shadow, opacity metadata, typography, imageFit, imageCrop, gradient, and blendMode.',
  additionalProperties: true,
}

const geometryProperties = {
  x: { type: 'number', description: 'X position in frame coordinates.' },
  y: { type: 'number', description: 'Y position in frame coordinates.' },
  width: { type: 'number', description: 'Element width in pixels.' },
  height: { type: 'number', description: 'Element height in pixels.' },
}

export const toolDefinitions = [
  {
    name: 'create_landing_page',
    description:
      'High-level low-token tool: create a polished landing page project from a compact brief using modern Dribbble/Stitch/Lovable-style patterns.',
    inputSchema: {
      type: 'object',
      required: ['name', 'brief'],
      properties: {
        path: pathProperty,
        name: { type: 'string' },
        brief: { type: 'string', description: 'Short product/design brief.' },
        brandName: { type: 'string' },
        stylePreset: { type: 'string', description: 'Examples: dribbble-showcase, stitch-product, lovable-product, food-delivery, saas-calm.' },
        platform: { type: 'string', enum: ['web', 'android', 'ios', 'cross-platform'], default: 'web' },
        width: { type: 'number', default: 1440 },
        height: { type: 'number', default: 1200 },
      },
    },
  },
  {
    name: 'create_mobile_screen',
    description:
      'High-level low-token tool: create a polished mobile app screen from a compact brief using platform-aware app UI patterns.',
    inputSchema: {
      type: 'object',
      required: ['name', 'brief'],
      properties: {
        path: pathProperty,
        name: { type: 'string' },
        brief: { type: 'string' },
        brandName: { type: 'string' },
        stylePreset: { type: 'string', description: 'Examples: ios-clean, material-3, dribbble-showcase, food-delivery, fintech.' },
        platform: { type: 'string', enum: ['android', 'ios', 'cross-platform'], default: 'cross-platform' },
        width: { type: 'number', default: 390 },
        height: { type: 'number', default: 844 },
      },
    },
  },
  {
    name: 'create_dashboard',
    description:
      'High-level low-token tool: create a polished SaaS/admin/dashboard project from a compact brief with sidebar, metrics, charts, and activity panels.',
    inputSchema: {
      type: 'object',
      required: ['name', 'brief'],
      properties: {
        path: pathProperty,
        name: { type: 'string' },
        brief: { type: 'string' },
        brandName: { type: 'string' },
        stylePreset: { type: 'string', description: 'Examples: saas-calm, glass-dashboard, ai-futuristic, fintech.' },
        platform: { type: 'string', enum: ['web', 'android', 'ios', 'cross-platform'], default: 'web' },
        width: { type: 'number', default: 1440 },
        height: { type: 'number', default: 900 },
      },
    },
  },
  {
    name: 'create_asset_pack',
    description:
      'High-level low-token tool: create a multi-frame image asset pack such as hero image, social preview, app card, and icon-style asset from a compact brief.',
    inputSchema: {
      type: 'object',
      required: ['name', 'brief'],
      properties: {
        path: pathProperty,
        name: { type: 'string' },
        brief: { type: 'string' },
        brandName: { type: 'string' },
        stylePreset: { type: 'string', description: 'Examples: dribbble-showcase, luxury-editorial, ai-futuristic, food-delivery.' },
      },
    },
  },
  {
    name: 'create_project',
    description:
      'Create a new amanXD project JSON file with one page and one or more artboards. Use this as the first tool for a new AI-generated UI.',
    inputSchema: {
      type: 'object',
      required: ['name'],
      properties: {
        path: pathProperty,
        name: { type: 'string', description: 'Human-readable project name.' },
        frames: {
          type: 'array',
          description: 'Initial artboards. Defaults to one 390x844 mobile artboard if omitted.',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              x: { type: 'number' },
              y: { type: 'number' },
              width: { type: 'number' },
              height: { type: 'number' },
              background: { type: 'string' },
            },
          },
        },
      },
    },
  },
  {
    name: 'list_project',
    description:
      'Read a project summary including pages, frames, element ids, element hierarchy, assets, and component ids. Use before editing an existing project.',
    inputSchema: {
      type: 'object',
      properties: { path: pathProperty },
    },
  },
  {
    name: 'add_frame',
    description: 'Add an artboard/frame to an existing amanXD project.',
    inputSchema: {
      type: 'object',
      required: ['name', 'width', 'height'],
      properties: {
        path: pathProperty,
        id: { type: 'string' },
        name: { type: 'string' },
        x: { type: 'number', default: 80 },
        y: { type: 'number', default: 80 },
        width: { type: 'number' },
        height: { type: 'number' },
        background: { type: 'string', default: '#ffffff' },
      },
    },
  },
  {
    name: 'add_rectangle',
    description:
      'Add a rectangle, card, button background, input field, panel, or image-mask shape. Supports fill, stroke, radius, shadow, opacity, and children.',
    inputSchema: {
      type: 'object',
      required: ['frameId', 'x', 'y', 'width', 'height'],
      properties: {
        path: pathProperty,
        frameId: frameIdProperty,
        id: { type: 'string' },
        name: { type: 'string', default: 'Rectangle' },
        ...geometryProperties,
        style: styleProperty,
        children: { type: 'array', description: 'Optional nested amanXD elements.', items: { type: 'object' } },
      },
    },
  },
  {
    name: 'add_ellipse',
    description: 'Add a circle/ellipse element. Useful for avatars, pills, indicators, and icon backgrounds.',
    inputSchema: {
      type: 'object',
      required: ['frameId', 'x', 'y', 'width', 'height'],
      properties: {
        path: pathProperty,
        frameId: frameIdProperty,
        id: { type: 'string' },
        name: { type: 'string', default: 'Ellipse' },
        ...geometryProperties,
        style: styleProperty,
      },
    },
  },
  {
    name: 'add_line',
    description: 'Add a line/divider element. Use stroke style to control color and thickness.',
    inputSchema: {
      type: 'object',
      required: ['frameId', 'x', 'y', 'width', 'height'],
      properties: {
        path: pathProperty,
        frameId: frameIdProperty,
        id: { type: 'string' },
        name: { type: 'string', default: 'Line' },
        ...geometryProperties,
        style: styleProperty,
      },
    },
  },
  {
    name: 'add_text',
    description:
      'Add a text layer. Use for headings, labels, button text, navigation labels, form copy, and body text.',
    inputSchema: {
      type: 'object',
      required: ['frameId', 'content', 'x', 'y', 'width', 'height'],
      properties: {
        path: pathProperty,
        frameId: frameIdProperty,
        id: { type: 'string' },
        name: { type: 'string', default: 'Text' },
        content: { type: 'string' },
        ...geometryProperties,
        typography: {
          type: 'object',
          description: 'fontFamily, fontSize, fontWeight, lineHeight, letterSpacing, align, color.',
          additionalProperties: true,
        },
      },
    },
  },
  {
    name: 'add_image_fill_shape',
    description:
      'Add a shape-owned image fill, matching XD mask behavior. The image cannot exist independently; it is clipped inside a rectangle or ellipse.',
    inputSchema: {
      type: 'object',
      required: ['frameId', 'src', 'x', 'y', 'width', 'height'],
      properties: {
        path: pathProperty,
        frameId: frameIdProperty,
        id: { type: 'string' },
        name: { type: 'string', default: 'Image Shape' },
        shape: { type: 'string', enum: ['rectangle', 'ellipse'], default: 'rectangle' },
        src: { type: 'string', description: 'Remote URL, data URL, or imported local image reference.' },
        ...geometryProperties,
        imageFit: { type: 'string', enum: ['cover', 'contain', 'stretch'], default: 'cover' },
        imageCrop: { type: 'object', additionalProperties: true },
        style: styleProperty,
      },
    },
  },
  {
    name: 'add_icon',
    description:
      'Add a reusable lucide-style icon as an SVG image element. Use list_icons first to discover icon ids.',
    inputSchema: {
      type: 'object',
      required: ['frameId', 'iconId', 'x', 'y'],
      properties: {
        path: pathProperty,
        frameId: frameIdProperty,
        iconId: { type: 'string', description: 'Icon id from list_icons, such as icon-home or icon-search.' },
        id: { type: 'string' },
        name: { type: 'string' },
        x: { type: 'number' },
        y: { type: 'number' },
        size: { type: 'number', default: 24 },
        color: { type: 'string', default: '#202124' },
      },
    },
  },
  {
    name: 'list_icons',
    description: 'List built-in icon ids, names, and categories available for add_icon.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'group_elements',
    description:
      'Group two or more elements in a frame while preserving absolute visual positions. Children become relative to the new group.',
    inputSchema: {
      type: 'object',
      required: ['frameId', 'elementIds'],
      properties: {
        path: pathProperty,
        frameId: frameIdProperty,
        elementIds: { type: 'array', items: { type: 'string' }, minItems: 2 },
        id: { type: 'string' },
        name: { type: 'string', default: 'Group' },
      },
    },
  },
  {
    name: 'align_elements',
    description:
      'Align selected elements left, center, right, top, middle, or bottom. Defaults to selection bounds for multiple elements and frame bounds for a single element.',
    inputSchema: {
      type: 'object',
      required: ['frameId', 'elementIds', 'alignment'],
      properties: {
        path: pathProperty,
        frameId: frameIdProperty,
        elementIds: { type: 'array', items: { type: 'string' }, minItems: 1 },
        alignment: { type: 'string', enum: ['left', 'center', 'right', 'top', 'middle', 'bottom'] },
        scope: { type: 'string', enum: ['selection', 'frame'], default: 'selection' },
      },
    },
  },
  {
    name: 'distribute_elements',
    description: 'Distribute three or more selected elements evenly horizontally or vertically.',
    inputSchema: {
      type: 'object',
      required: ['frameId', 'elementIds', 'direction'],
      properties: {
        path: pathProperty,
        frameId: frameIdProperty,
        elementIds: { type: 'array', items: { type: 'string' }, minItems: 3 },
        direction: { type: 'string', enum: ['horizontal', 'vertical'] },
      },
    },
  },
  {
    name: 'update_element',
    description:
      'Patch an existing element geometry, content, src, style, visibility, locking, export marker, or children.',
    inputSchema: {
      type: 'object',
      required: ['elementId', 'patch'],
      properties: {
        path: pathProperty,
        elementId: { type: 'string' },
        patch: { type: 'object', additionalProperties: true },
      },
    },
  },
  {
    name: 'apply_operations',
    description:
      'Apply many UI creation/edit operations in one tool call to reduce AI token usage. Supports add_frame, add_rectangle, add_ellipse, add_line, add_text, add_image_fill_shape, add_icon, group_elements, align_elements, distribute_elements, and update_element operation objects.',
    inputSchema: {
      type: 'object',
      required: ['operations'],
      properties: {
        path: pathProperty,
        operations: {
          type: 'array',
          description:
            'Ordered operations. Each item must include op plus the same fields used by the matching individual tool.',
          items: {
            type: 'object',
            additionalProperties: true,
            properties: {
              op: {
                type: 'string',
                enum: [
                  'add_frame',
                  'add_rectangle',
                  'add_ellipse',
                  'add_line',
                  'add_text',
                  'add_image_fill_shape',
                  'add_icon',
                  'group_elements',
                  'align_elements',
                  'distribute_elements',
                  'update_element',
                ],
              },
            },
          },
        },
      },
    },
  },
  {
    name: 'export_frame_image',
    description:
      'Render one frame/artboard from an amanXD project to a PNG or JPEG file for use as an image asset in another project. Supports optional region export.',
    inputSchema: {
      type: 'object',
      required: ['frameId'],
      properties: {
        path: pathProperty,
        frameId: frameIdProperty,
        region: {
          type: 'object',
          description: 'Optional region inside the frame to export instead of the whole artboard.',
          properties: {
            x: { type: 'number' },
            y: { type: 'number' },
            width: { type: 'number' },
            height: { type: 'number' },
          },
        },
        outputPath: {
          type: 'string',
          description: 'Output image path relative to repo root.',
          default: 'exports/frame.png',
        },
        format: { type: 'string', enum: ['png', 'jpeg'], default: 'png' },
        scale: { type: 'number', default: 2 },
        quality: { type: 'number', default: 0.92 },
      },
    },
  },
  {
    name: 'export_region_image',
    description:
      'Render a specific rectangular area inside one frame/artboard to PNG or JPEG. Use for exporting a particular board area, crop, section, card, or asset region.',
    inputSchema: {
      type: 'object',
      required: ['frameId', 'x', 'y', 'width', 'height'],
      properties: {
        path: pathProperty,
        frameId: frameIdProperty,
        x: { type: 'number' },
        y: { type: 'number' },
        width: { type: 'number' },
        height: { type: 'number' },
        outputPath: { type: 'string', default: 'exports/region.png' },
        format: { type: 'string', enum: ['png', 'jpeg'], default: 'png' },
        quality: { type: 'number', default: 0.92 },
      },
    },
  },
  {
    name: 'validate_layout',
    description:
      'Check a project/frame for accidental layout mistakes such as out-of-frame layers, suspicious large overlaps, duplicate ids, and invalid geometry before export.',
    inputSchema: {
      type: 'object',
      properties: {
        path: pathProperty,
        frameId: frameIdProperty,
        strict: { type: 'boolean', default: false },
      },
    },
  },
  {
    name: 'export_project_json',
    description:
      'Return the full amanXD project JSON as text so an agent can attach it, inspect it, or hand it to the app importer.',
    inputSchema: {
      type: 'object',
      properties: { path: pathProperty },
    },
  },
]
