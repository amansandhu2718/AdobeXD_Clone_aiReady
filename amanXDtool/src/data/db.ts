import Dexie, { type Table } from 'dexie'
import type { AmanXDFile } from '../types/project'

interface StoredProject {
  id: string
  name: string
  updatedAt: string
  file: AmanXDFile
}

class AmanXDDatabase extends Dexie {
  projects!: Table<StoredProject, string>

  constructor() {
    super('amanxd')
    this.version(1).stores({
      projects: 'id, name, updatedAt',
    })
  }
}

export const db = new AmanXDDatabase()

export async function saveProjectFile(file: AmanXDFile) {
  await db.projects.put({
    id: file.project.id,
    name: file.project.name,
    updatedAt: file.project.updatedAt,
    file,
  })
}

export async function loadLatestProjectFile() {
  return (await db.projects.orderBy('updatedAt').last())?.file
}
