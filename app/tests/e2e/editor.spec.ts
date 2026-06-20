import { expect, test } from '@playwright/test'

test('loads amanXD editor shell', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('amanXD / amanXD Material Light Theme')).toBeVisible()
  await expect(page.getByText('Document Assets')).toBeVisible()
  await expect(page.getByText('Frame', { exact: true })).toBeVisible()
})

for (const viewport of [
  { width: 1280, height: 800 },
  { width: 900, height: 800 },
  { width: 390, height: 844 },
]) {
  test(`keeps core editor usable at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto('/')
    await expect(page.getByRole('button', { name: 'Design' })).toBeVisible()
    await expect(page.locator('canvas')).toBeVisible()
    const overflow = await page.evaluate(() => document.body.scrollWidth - document.documentElement.clientWidth)
    expect(overflow).toBeLessThanOrEqual(2)
  })
}
