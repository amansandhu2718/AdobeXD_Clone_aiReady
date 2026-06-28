export interface FontOption {
  family: string
  weights: number[]
}

export const googleFonts: FontOption[] = [
  { family: 'Inter', weights: [400, 500, 600, 700] },
  { family: 'Roboto', weights: [400, 500, 700] },
  { family: 'Poppins', weights: [400, 500, 600, 700] },
  { family: 'Montserrat', weights: [400, 500, 700] },
  { family: 'Lato', weights: [400, 700] },
  { family: 'Playfair Display', weights: [400, 700] },
  { family: 'Source Sans 3', weights: [400, 600, 700] },
]

export async function loadGoogleFont(family: string) {
  const id = `font-${family.toLowerCase().replace(/\s+/g, '-')}`
  if (!document.getElementById(id)) {
    const link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    link.href = `https://fonts.googleapis.com/css2?family=${family.replace(/\s+/g, '+')}:wght@400;500;600;700&display=swap`
    document.head.appendChild(link)
  }
  if ('fonts' in document) {
    await document.fonts.load(`16px "${family}"`)
  }
}
