import { createId } from '../lib/ids'
import type { AmanXDFile } from '../types/project'

export function createEmptyProject(): AmanXDFile {
  return {
    schemaVersion: 1,
    project: {
      id: createId('project'),
      name: 'Untitled amanXD Project',
      updatedAt: new Date().toISOString(),
      pages: [
        {
          id: createId('page'),
          name: 'Page 1',
          frames: [
            {
              id: createId('frame'),
              name: 'Desktop Frame',
              x: 120,
              y: 90,
              width: 1440,
              height: 900,
              background: '#ffffff',
              elements: [],
            },
          ],
        },
      ],
      assets: {
        colors: [
          { id: createId('color'), name: 'White', value: '#ffffff' },
          { id: createId('color'), name: 'Black', value: '#111827' },
          { id: createId('color'), name: 'Accent', value: '#7b2fff' },
        ],
        textStyles: [],
        images: [],
        components: [],
      },
      prototypeLinks: [],
    },
  }
}
