import { test, expect } from '@playwright/test'

test.describe('Hub Routing E2E Smoke Tests', () => {

  test('1. Hub homepage renders at http://lvh.me:3000', async ({ page }) => {
    const response = await page.goto('http://lvh.me:3000')
    expect(response).not.toBeNull()
    expect(response!.status()).toBe(200)

    const headers = response!.headers()
    expect(headers['x-middleware-subdomain']).toBe('hub')
    expect(headers['x-middleware-matched-route']).toBe('/(hub)')

    await expect(page.locator('h1')).toContainText('Solusi Energi & Infrastruktur Terpercaya untuk Indonesia')
  })

  test('2. Hub about page renders at http://lvh.me:3000/about', async ({ page }) => {
    const response = await page.goto('http://lvh.me:3000/about')
    expect(response).not.toBeNull()
    expect(response!.status()).toBe(200)

    const headers = response!.headers()
    expect(headers['x-middleware-subdomain']).toBe('hub')

    // Page title or major content check
    await expect(page.locator('h1')).toContainText('Membangun Masa Depan Energi Berkelanjutan')
  })

  test('3. Hub contact page renders at http://lvh.me:3000/contact', async ({ page }) => {
    const response = await page.goto('http://lvh.me:3000/contact')
    expect(response).not.toBeNull()
    expect(response!.status()).toBe(200)

    const headers = response!.headers()
    expect(headers['x-middleware-subdomain']).toBe('hub')

    await expect(page.locator('h1')).toContainText('Pusat Kontak & Kemitraan')
  })

  test('4. Hub products page renders at http://lvh.me:3000/products', async ({ page }) => {
    const response = await page.goto('http://lvh.me:3000/products')
    expect(response).not.toBeNull()
    expect(response!.status()).toBe(200)

    const headers = response!.headers()
    expect(headers['x-middleware-subdomain']).toBe('hub')

    await expect(page.locator('h1')).toContainText('Katalog Produk & Solusi Infrastruktur')
  })

  test('5. Hub certifications page renders at http://lvh.me:3000/certifications', async ({ page }) => {
    const response = await page.goto('http://lvh.me:3000/certifications')
    expect(response).not.toBeNull()
    expect(response!.status()).toBe(200)

    const headers = response!.headers()
    expect(headers['x-middleware-subdomain']).toBe('hub')

    await expect(page.locator('h1')).toContainText('Sertifikasi')
  })

  test('6. Hub FAQ page renders at http://lvh.me:3000/faq', async ({ page }) => {
    const response = await page.goto('http://lvh.me:3000/faq')
    expect(response).not.toBeNull()
    expect(response!.status()).toBe(200)

    const headers = response!.headers()
    expect(headers['x-middleware-subdomain']).toBe('hub')

    await expect(page.locator('h1')).toContainText('Pertanyaan yang Sering Diajukan')
  })

  test('7. Hub portfolio page renders at http://lvh.me:3000/portfolio', async ({ page }) => {
    const response = await page.goto('http://lvh.me:3000/portfolio')
    expect(response).not.toBeNull()
    expect(response!.status()).toBe(200)

    const headers = response!.headers()
    expect(headers['x-middleware-subdomain']).toBe('hub')

    await expect(page.locator('h1')).toContainText('Portofolio Proyek Kami')
  })

  test('8. Hub articles page renders at http://lvh.me:3000/articles', async ({ page }) => {
    const response = await page.goto('http://lvh.me:3000/articles')
    expect(response).not.toBeNull()
    expect(response!.status()).toBe(200)

    const headers = response!.headers()
    expect(headers['x-middleware-subdomain']).toBe('hub')

    await expect(page.locator('h1')).toContainText('Artikel & Berita')
  })

  test('9. Negative test: Nonexistent page returns 404', async ({ page }) => {
    const response = await page.goto('http://lvh.me:3000/nonexistent-page-xyz')
    expect(response).not.toBeNull()
    expect(response!.status()).toBe(404)
  })
})
