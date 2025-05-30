/**
 * Sistema de Cache Inteligente
 */

const fs = require("fs")
const path = require("path")
const crypto = require("crypto")

const CACHE_DIR = path.join(__dirname, "../.cache")
const CACHE_DURATION = {
  presence: 30 * 60 * 1000, // 30 minutos
  skills: 6 * 60 * 60 * 1000, // 6 horas
  constellation: 24 * 60 * 60 * 1000, // 24 horas
  analytics: 12 * 60 * 60 * 1000, // 12 horas
}

/**
 * Gera hash para chave de cache
 */
function generateCacheKey(data) {
  return crypto.createHash("md5").update(JSON.stringify(data)).digest("hex")
}

/**
 * Verifica se cache é válido
 */
function isCacheValid(cacheFile, duration) {
  if (!fs.existsSync(cacheFile)) return false

  const stats = fs.statSync(cacheFile)
  const age = Date.now() - stats.mtime.getTime()

  return age < duration
}

/**
 * Salva no cache
 */
function saveToCache(key, data, type = "default") {
  try {
    fs.mkdirSync(CACHE_DIR, { recursive: true })

    const cacheFile = path.join(CACHE_DIR, `${type}_${key}.json`)
    const cacheData = {
      timestamp: Date.now(),
      data,
    }

    fs.writeFileSync(cacheFile, JSON.stringify(cacheData, null, 2))
    console.log(`💾 Cache salvo: ${type}_${key}`)
  } catch (error) {
    console.error("Erro ao salvar cache:", error)
  }
}

/**
 * Carrega do cache
 */
function loadFromCache(key, type = "default", duration = CACHE_DURATION.default) {
  try {
    const cacheFile = path.join(CACHE_DIR, `${type}_${key}.json`)

    if (!isCacheValid(cacheFile, duration)) {
      return null
    }

    const cacheData = JSON.parse(fs.readFileSync(cacheFile, "utf8"))
    console.log(`📦 Cache carregado: ${type}_${key}`)

    return cacheData.data
  } catch (error) {
    console.error("Erro ao carregar cache:", error)
    return null
  }
}

/**
 * Limpa cache expirado
 */
function cleanExpiredCache() {
  if (!fs.existsSync(CACHE_DIR)) return

  const files = fs.readdirSync(CACHE_DIR)
  let cleaned = 0

  files.forEach((file) => {
    const filePath = path.join(CACHE_DIR, file)
    const stats = fs.statSync(filePath)
    const age = Date.now() - stats.mtime.getTime()

    // Remove cache com mais de 7 dias
    if (age > 7 * 24 * 60 * 60 * 1000) {
      fs.unlinkSync(filePath)
      cleaned++
    }
  })

  if (cleaned > 0) {
    console.log(`🧹 ${cleaned} arquivos de cache expirados removidos`)
  }
}

module.exports = {
  generateCacheKey,
  saveToCache,
  loadFromCache,
  cleanExpiredCache,
  CACHE_DURATION,
}
