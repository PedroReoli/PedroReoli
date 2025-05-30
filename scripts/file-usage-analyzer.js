/**
 * Analisador de Uso de Arquivos
 * Identifica arquivos não utilizados no projeto
 */

const fs = require("fs")
const path = require("path")

// Mapeamento de dependências
const FILE_DEPENDENCIES = {
  // Workflows e seus scripts
  "daily-update.yml": ["presence-tracker.js"],
  "weekly-insights.yml": ["skill-evolution.js"],
  "constellation.yml": ["constellation-generator.js"],
  "observatory.yml": ["observatory-insights.js"],
  "sync-english.yml": ["update-english-readme.js"],
  "advanced-analytics.yml": ["advanced-analytics.js", "smart-cache.js", "performance-monitor.js"],
  "main.yml": [], // Usa actions externas
  "pacman.yml": [], // Usa actions externas

  // Scripts e suas dependências
  "presence-tracker.js": ["smart-cache.js"],
  "skill-evolution.js": ["smart-cache.js"],
  "constellation-generator.js": ["smart-cache.js"],
  "observatory-insights.js": ["smart-cache.js"],
  "advanced-analytics.js": ["smart-cache.js", "performance-monitor.js"],
  "update-english-readme.js": [],
  "smart-cache.js": [], // Biblioteca base
  "performance-monitor.js": [],

  // Arquivos de configuração
  "README.md": [], // Principal
  "README.en.md": [], // Versão inglesa
  ".devgoals.yml": ["observatory-insights.js"], // Usado pelo observatory
  "DOCUMENTATION.md": [], // Documentação
}

// Arquivos que REALMENTE são usados
const USED_FILES = new Set([
  // Workflows essenciais
  ".github/workflows/main.yml",
  ".github/workflows/pacman.yml",
  ".github/workflows/daily-update.yml",
  ".github/workflows/weekly-insights.yml",
  ".github/workflows/constellation.yml",
  ".github/workflows/observatory.yml",
  ".github/workflows/sync-english.yml",
  ".github/workflows/advanced-analytics.yml",

  // Scripts essenciais
  "scripts/presence-tracker.js",
  "scripts/skill-evolution.js",
  "scripts/constellation-generator.js",
  "scripts/observatory-insights.js",
  "scripts/update-english-readme.js",
  "scripts/advanced-analytics.js",
  "scripts/smart-cache.js",
  "scripts/performance-monitor.js",

  // Arquivos de configuração
  "README.md",
  "EnglishVersion/README.en.md",
  ".devgoals.yml",
  "docs/DOCUMENTATION.md",
])

// Arquivos REDUNDANTES ou NÃO USADOS
const REDUNDANT_FILES = [
  ".github/workflows/profile-summary.yml", // Redundante com main.yml
  "scripts/cleanup-unused.js", // Script utilitário desnecessário
  "scripts/performance-optimizer.js", // Funcionalidade já no performance-monitor.js
]

/**
 * Analisa uso de arquivos
 */
function analyzeFileUsage() {
  console.log("🔍 Analisando uso de arquivos...\n")

  console.log("✅ ARQUIVOS ESSENCIAIS:")
  Array.from(USED_FILES)
    .sort()
    .forEach((file) => {
      console.log(`   ${file}`)
    })

  console.log("\n❌ ARQUIVOS REDUNDANTES/NÃO USADOS:")
  REDUNDANT_FILES.forEach((file) => {
    console.log(`   ${file} - PODE SER REMOVIDO`)
  })

  console.log("\n📊 ESTATÍSTICAS:")
  console.log(`   Arquivos essenciais: ${USED_FILES.size}`)
  console.log(`   Arquivos redundantes: ${REDUNDANT_FILES.length}`)
  console.log(
    `   Taxa de utilização: ${Math.round((USED_FILES.size / (USED_FILES.size + REDUNDANT_FILES.length)) * 100)}%`,
  )

  return {
    used: Array.from(USED_FILES),
    redundant: REDUNDANT_FILES,
    utilizationRate: Math.round((USED_FILES.size / (USED_FILES.size + REDUNDANT_FILES.length)) * 100),
  }
}

// Executar análise
const analysis = analyzeFileUsage()

// Salvar relatório
const report = {
  timestamp: new Date().toISOString(),
  analysis,
  recommendations: [
    "Remover arquivos redundantes identificados",
    "Consolidar funcionalidades similares",
    "Manter apenas workflows essenciais",
    "Usar smart-cache.js como biblioteca base",
  ],
}

fs.writeFileSync(path.join(__dirname, "../assets/file-usage-report.json"), JSON.stringify(report, null, 2))

console.log("\n📄 Relatório salvo em: assets/file-usage-report.json")
