export function safeDownloadName(name: string) {
  return (name || 'untitled')
    .trim()
    .replace(/[\\/:*?"<>|]+/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 96) || 'untitled'
}

interface SaveFilePickerOptions {
  suggestedName?: string
  types?: Array<{
    description: string
    accept: Record<string, string[]>
  }>
}

interface FileSystemWritableFileStream {
  write: (data: Blob) => Promise<void>
  close: () => Promise<void>
}

interface FileSystemFileHandle {
  createWritable: () => Promise<FileSystemWritableFileStream>
}

declare global {
  interface Window {
    showSaveFilePicker?: (options?: SaveFilePickerOptions) => Promise<FileSystemFileHandle>
  }
}

function extensionFor(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase()
  return ext ? `.${ext}` : ''
}

function mimeFor(filename: string, fallback: string) {
  const ext = extensionFor(filename)
  if (ext === '.png') return 'image/png'
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg'
  if (ext === '.json' || ext === '.amanxd') return 'application/json'
  return fallback
}

async function saveBlob(filename: string, blob: Blob, description: string) {
  if (window.showSaveFilePicker) {
    try {
      const extension = extensionFor(filename)
      const handle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [
          {
            description,
            accept: { [blob.type || mimeFor(filename, 'application/octet-stream')]: extension ? [extension] : [] },
          },
        ],
      })
      const writable = await handle.createWritable()
      await writable.write(blob)
      await writable.close()
      return
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
    }
  }
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export async function downloadText(filename: string, contents: string, type = 'application/json') {
  const blob = new Blob([contents], { type })
  await saveBlob(filename, blob, 'amanXD document')
}

export async function downloadDataUrl(filename: string, dataUrl: string) {
  const response = await fetch(dataUrl)
  const blob = await response.blob()
  await saveBlob(filename, blob, 'amanXD export')
}
