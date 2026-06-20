import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

vi.mock('./hooks/useAutosave', () => ({
  useAutosave: () => undefined,
}))

vi.mock('./components/canvas/CanvasBoard', () => ({
  CanvasBoard: () => <div>Canvas board</div>,
}))

describe('App', () => {
  it('renders the amanXD editor shell', () => {
    render(<App />)
    expect(screen.getByText('amanXD / amanXD Material Light Theme')).toBeInTheDocument()
    expect(screen.getByText('Design')).toBeInTheDocument()
    expect(screen.getByText('Document Assets')).toBeInTheDocument()
    expect(screen.getByText('Inspector')).toBeInTheDocument()
  })
})
