import { z } from 'zod'
import type { AmanXDFile } from '../types/project'

const id = z.string().min(1)

const strokeSchema = z.object({
  enabled: z.boolean(),
  color: z.string().min(1),
  width: z.number().min(0),
  dash: z.array(z.number().min(0)).optional(),
})

const cornerRadiusSchema = z.object({
  topLeft: z.number().min(0),
  topRight: z.number().min(0),
  bottomRight: z.number().min(0),
  bottomLeft: z.number().min(0),
})

const shadowSchema = z.object({
  enabled: z.boolean(),
  color: z.string().min(1),
  x: z.number(),
  y: z.number(),
  blur: z.number().min(0),
  opacity: z.number().min(0).max(1),
})

const typographySchema = z.object({
  fontFamily: z.string().min(1),
  fontSize: z.number().min(1),
  fontWeight: z.number().min(100).max(1000),
  fontStyle: z.enum(['normal', 'italic']).optional(),
  decoration: z.enum(['none', 'underline']).optional(),
  textTransform: z.enum(['none', 'uppercase', 'lowercase', 'capitalize']).optional(),
  lineHeight: z.number().min(0.5),
  letterSpacing: z.number(),
  align: z.enum(['left', 'center', 'right']),
  color: z.string().min(1),
})

const gradientSchema = z.object({
  enabled: z.boolean(),
  type: z.literal('linear'),
  from: z.object({ x: z.number(), y: z.number() }),
  to: z.object({ x: z.number(), y: z.number() }),
  stops: z
    .array(z.object({ color: z.string().min(1), offset: z.number().min(0).max(1) }))
    .min(2),
})

const styleSchema = z.object({
  fill: z.string(),
  gradient: gradientSchema.optional(),
  stroke: strokeSchema,
  cornerRadius: cornerRadiusSchema,
  shadow: shadowSchema,
  typography: typographySchema.optional(),
  imageFit: z.enum(['cover', 'contain', 'stretch']).optional(),
  imageCrop: z
    .object({
      x: z.number(),
      y: z.number(),
      scale: z.number().min(0.1),
    })
    .optional(),
  blendMode: z.enum(['normal', 'multiply', 'screen', 'overlay']).optional(),
})

export const elementSchema: z.ZodTypeAny = z.lazy(() =>
  z.object({
    id,
    type: z.enum([
      'rectangle',
      'ellipse',
      'line',
      'text',
      'image',
      'group',
      'componentInstance',
    ]),
    name: z.string().min(1),
    x: z.number(),
    y: z.number(),
    width: z.number().min(0),
    height: z.number().min(0),
    rotation: z.number(),
    opacity: z.number().min(0).max(1),
    locked: z.boolean(),
    visible: z.boolean(),
    style: styleSchema,
    content: z.string().optional(),
    assetId: z.string().optional(),
    src: z.string().optional(),
    children: z.array(elementSchema).optional(),
    componentId: z.string().optional(),
    markForExport: z.boolean().optional(),
  }),
)

export const projectFileSchema = z.object({
  schemaVersion: z.literal(1),
  project: z.object({
    id,
    name: z.string().min(1),
    updatedAt: z.string(),
    pages: z
      .array(
        z.object({
          id,
          name: z.string().min(1),
          frames: z
            .array(
              z.object({
                id,
                name: z.string().min(1),
                x: z.number(),
                y: z.number(),
                width: z.number().min(1),
                height: z.number().min(1),
                background: z.string().min(1),
                elements: z.array(elementSchema),
              }),
            )
            .min(1),
        }),
      )
      .min(1),
    assets: z.object({
      colors: z.array(z.object({ id, name: z.string().min(1), value: z.string().min(1) })),
      textStyles: z.array(
        z.object({
          id,
          name: z.string().min(1),
          fontFamily: z.string().min(1),
          fontSize: z.number().min(1),
          fontWeight: z.number().min(100).max(1000),
          lineHeight: z.number().min(0.5),
          letterSpacing: z.number(),
          color: z.string().min(1),
        }),
      ),
      images: z.array(
        z.object({
          id,
          name: z.string().min(1),
          src: z.string().min(1),
          source: z.enum(['local', 'unsplash', 'remote']),
        }),
      ),
      components: z.array(
        z.object({
          id,
          name: z.string().min(1),
          elementIds: z.array(z.string()),
        }),
      ),
    }),
    prototypeLinks: z.array(
      z.object({
        id,
        fromFrameId: z.string().min(1),
        triggerElementId: z.string().optional(),
        toFrameId: z.string().min(1),
        transition: z.enum(['instant', 'dissolve', 'slide-left', 'slide-right']),
      }),
    ),
  }),
})

export type ProjectFileInput = z.infer<typeof projectFileSchema>

export function parseProjectFile(input: unknown) {
  return projectFileSchema.parse(input) as AmanXDFile
}
