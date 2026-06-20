import { useEffect, useRef } from 'react'
import { loadLatestProjectFile, saveProjectFile } from '../data/db'
import { useEditorStore } from '../store/editorStore'

export function useAutosave() {
  const file = useEditorStore((state) => state.file)
  const hydrateFile = useEditorStore((state) => state.hydrateFile)
  const hydrated = useRef(false)

  useEffect(() => {
    loadLatestProjectFile().then((latest) => {
      if (latest) hydrateFile(latest)
      hydrated.current = true
    })
  }, [hydrateFile])

  useEffect(() => {
    if (!hydrated.current) return
    const handle = window.setTimeout(() => {
      saveProjectFile(file).catch((error: unknown) => {
        console.error('Failed to autosave amanXD project', error)
      })
    }, 450)
    return () => window.clearTimeout(handle)
  }, [file])
}
