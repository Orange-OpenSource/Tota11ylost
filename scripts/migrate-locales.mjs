/**
 * Migration script: merges Tota11y Lost locale files into Nuxt i18n locale files.
 * Keeps the original keys from the game (common.*, welcome.*, intro.*, etc.)
 * and merges them alongside the existing Nuxt template keys (HEADER.*, FOOTER.*, etc.)
 */
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const nuxtLangDir = resolve(root, 'i18n/lang')
const gameLangDir = resolve(root, 'app/totally-lost/src/locales')

const locales = ['en', 'fr', 'es']

for (const locale of locales) {
  const gameFile = resolve(gameLangDir, `${locale}.json`)
  const nuxtFile = resolve(nuxtLangDir, `${locale}.json`)

  if (!existsSync(gameFile)) {
    console.warn(`⚠ Game locale ${locale}.json not found, skipping`)
    continue
  }

  const gameData = JSON.parse(readFileSync(gameFile, 'utf-8'))

  let nuxtData = {}
  if (existsSync(nuxtFile)) {
    nuxtData = JSON.parse(readFileSync(nuxtFile, 'utf-8'))
  }

  // Add LANG keys for the language switcher if missing
  if (!nuxtData.HEADER?.NAV?.LANG?.ARIA_ES) {
    nuxtData.HEADER = nuxtData.HEADER || {}
    nuxtData.HEADER.NAV = nuxtData.HEADER.NAV || {}
    nuxtData.HEADER.NAV.LANG = nuxtData.HEADER.NAV.LANG || {}
    nuxtData.HEADER.NAV.LANG.ARIA_ES = locale === 'fr' ? 'Espagnol' : locale === 'es' ? 'Español' : 'Spanish'
    nuxtData.HEADER.NAV.LANG.ES = 'ES'
  }

  // Merge game keys into the nuxt locale file (game keys go at root level)
  const merged = { ...nuxtData, ...gameData }

  writeFileSync(nuxtFile, JSON.stringify(merged, null, 2), 'utf-8')
  console.log(`✓ Merged ${locale}.json (${Object.keys(gameData).length} game sections added)`)
}

console.log('\nDone! Locale files merged successfully.')
