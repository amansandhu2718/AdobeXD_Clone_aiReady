export interface IconAsset {
  id: string
  name: string
  category: string
  svgPath: string
}

export const iconAssets: IconAsset[] = [
  {
    id: 'icon-home',
    name: 'Home',
    category: 'Navigation',
    svgPath: '<path d="m3 11 9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
  },
  {
    id: 'icon-search',
    name: 'Search',
    category: 'Navigation',
    svgPath: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  },
  {
    id: 'icon-user',
    name: 'User',
    category: 'People',
    svgPath: '<path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/>',
  },
  {
    id: 'icon-settings',
    name: 'Settings',
    category: 'System',
    svgPath:
      '<path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1A2 2 0 1 1 4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1A2 2 0 1 1 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1A2 2 0 1 1 19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.1a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>',
  },
  {
    id: 'icon-bell',
    name: 'Bell',
    category: 'System',
    svgPath: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
  },
  {
    id: 'icon-mail',
    name: 'Mail',
    category: 'Communication',
    svgPath: '<rect width="18" height="14" x="3" y="5" rx="2"/><path d="m3 7 9 6 9-6"/>',
  },
  {
    id: 'icon-heart',
    name: 'Heart',
    category: 'Social',
    svgPath:
      '<path d="M19.5 12.6 12 20l-7.5-7.4a5 5 0 0 1 7.1-7.1l.4.4.4-.4a5 5 0 0 1 7.1 7.1Z"/>',
  },
  {
    id: 'icon-plus',
    name: 'Plus',
    category: 'Actions',
    svgPath: '<path d="M12 5v14"/><path d="M5 12h14"/>',
  },
  {
    id: 'icon-check',
    name: 'Check',
    category: 'Actions',
    svgPath: '<path d="m20 6-11 11-5-5"/>',
  },
  {
    id: 'icon-arrow-right',
    name: 'Arrow Right',
    category: 'Navigation',
    svgPath: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  },
  {
    id: 'icon-cart',
    name: 'Cart',
    category: 'Commerce',
    svgPath:
      '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2 2h3l3 14h10l3-9H6"/>',
  },
  {
    id: 'icon-credit-card',
    name: 'Credit Card',
    category: 'Commerce',
    svgPath: '<rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/>',
  },
]

export function iconToDataUrl(icon: IconAsset, color = '#202124') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icon.svgPath}</svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
