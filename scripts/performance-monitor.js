/**
 * Monitor de Performance
 */

const fs = require("fs")
const path = require("path")

const ASSETS_DIR = path.join(__dirname, "../assets")
const PERFORMANCE_LOG = path.join(ASSETS_DIR, "performance.json")

/**
 * Monitora performance dos scripts
 */
function monitorPerformance() {
  const performance = {
    timestamp: new Date().toISOString(),
    metrics: {},
  }

  // Verificar tamanho dos arquivos
  const files = fs.readdirSync(ASSETS_DIR)
  let totalSize = 0

  files.forEach((file) => {
    const filePath = path.join(ASSETS_DIR, file)
    const stats = fs.statSync(filePath)
    totalSize += stats.size

    performance.metrics[file] = {
      size: stats.size,
      lastModified: stats.mtime,
    }
  })

  performance.totalSize = totalSize
  performance.fileCount = files.length

  // Verificar se há arquivos muito grandes
  const largeFiles = files.filter((file) => {
    const filePath = path.join(ASSETS_DIR, file)
    const stats = fs.statSync(filePath)
    return stats.size > 500 * 1024 // 500KB
  })

  if (largeFiles.length > 0) {
    performance.warnings = largeFiles.map((file) => `Large file detected: ${file}`)
  }

  // Salvar log de performance
  fs.writeFileSync(PERFORMANCE_LOG, JSON.stringify(performance, null, 2))

  console.log(`📊 Performance: ${files.length} arquivos, ${Math.round(totalSize / 1024)}KB total`)

  return performance
}

// Executar
monitorPerformance()
