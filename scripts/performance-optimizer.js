/**
 * Performance Optimizer
 * Otimiza assets e melhora performance do sistema
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuração
const ASSETS_DIR = path.join(__dirname, "../assets")
const MAX_FILE_SIZE = 1024 * 1024 // 1MB
const CACHE_DURATION = 6 * 60 * 60 * 1000 // 6 horas

/**
 * Otimiza SVGs removendo elementos desnecessários
 */
function optimizeSVG(svgContent) {
  // Remover comentários
  let optimized = svgContent.replace(/<!--[\s\S]*?-->/g, "")

  // Remover espaços desnecessários
  optimized = optimized.replace(/\s+/g, " ")

  // Remover quebras de linha desnecessárias
  optimized = optimized.replace(/>\s+</g, "><")

  return optimized.trim()
}

/**
 * Verifica se o cache ainda é válido
 */
function isCacheValid(filePath) {
  if (!fs.existsSync(filePath)) return false

  const stats = fs.statSync(filePath)
  const now = new Date().getTime()
  const fileTime = new Date(stats.mtime).getTime()

  return now - fileTime < CACHE_DURATION
}

/**
 * Limpa arquivos antigos
 */
function cleanupOldFiles() {
  const files = fs.readdirSync(ASSETS_DIR)
  const now = new Date().getTime()

  files.forEach((file) => {
    const filePath = path.join(ASSETS_DIR, file)
    const stats = fs.statSync(filePath)
    const fileAge = now - new Date(stats.mtime).getTime()

    // Remover arquivos com mais de 7 dias
    if (fileAge > 7 * 24 * 60 * 60 * 1000) {
      if (file.endsWith(".tmp") || file.endsWith(".bak")) {
        fs.unlinkSync(filePath)
        console.log(`Arquivo antigo removido: ${file}`)
      }
    }
  })
}

/**
 * Otimiza todos os assets
 */
function optimizeAssets() {
  console.log("Otimizando assets...")

  const files = fs.readdirSync(ASSETS_DIR)

  files.forEach((file) => {
    const filePath = path.join(ASSETS_DIR, file)

    if (file.endsWith(".svg")) {
      const content = fs.readFileSync(filePath, "utf8")
      const optimized = optimizeSVG(content)

      // Só reescrever se houve mudança significativa
      if (optimized.length < content.length * 0.9) {
        fs.writeFileSync(filePath, optimized)
        console.log(`SVG otimizado: ${file} (${content.length} -> ${optimized.length} bytes)`)
      }
    }

    // Verificar tamanho dos arquivos
    const stats = fs.statSync(filePath)
    if (stats.size > MAX_FILE_SIZE) {
      console.warn(`Arquivo muito grande: ${file} (${stats.size} bytes)`)
    }
  })

  // Limpar arquivos antigos
  cleanupOldFiles()

  console.log("Otimização concluída!")
}

// Executar otimização
optimizeAssets()
