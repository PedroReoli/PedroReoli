/**
 * README Integrity Checker
 * Verifica se todas as seções e arquivos estão funcionando corretamente
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuração
const README_FILE = path.join(__dirname, "../README.md")
const ASSETS_DIR = path.join(__dirname, "../assets")

/**
 * Lista de arquivos esperados
 */
const EXPECTED_FILES = [
  "assets/github-stats-dark.svg",
  "assets/github-stats-light.svg",
  "assets/tech-stack-dark.svg",
  "assets/tech-stack-light.svg",
  "assets/skill-evolution-dark.svg",
  "assets/skill-evolution-light.svg",
  "assets/presence-status.json",
  "assets/github-stats-data.json",
  "data/about-me.json",
  "data/tech-stack.json",
]

/**
 * Marcadores esperados no README
 */
const EXPECTED_MARKERS = [
  "<!-- INICIO_STATUS_LIVE -->",
  "<!-- FIM_STATUS_LIVE -->",
  "<!-- INICIO_SOBRE_MIM -->",
  "<!-- FIM_SOBRE_MIM -->",
  "<!-- INICIO_TECH_STACK -->",
  "<!-- FIM_TECH_STACK -->",
  "<!-- INICIO_GITHUB_STATS -->",
  "<!-- FIM_GITHUB_STATS -->",
  "<!-- INICIO_SKILL_EVOLUTION -->",
  "<!-- FIM_SKILL_EVOLUTION -->",
  "<!-- INICIO_CONTRIBUICOES -->",
  "<!-- FIM_CONTRIBUICOES -->",
]

/**
 * URLs externas para verificar
 */
const EXTERNAL_URLS = [
  "https://raw.githubusercontent.com/PedroReoli/PedroReoli/output/pacman-contribution-graph.svg",
  "https://raw.githubusercontent.com/PedroReoli/PedroReoli/output/github-snake.svg",
  "./profile-3d-contrib/profile-night-green.svg",
]

/**
 * Verifica se arquivos existem
 */
function checkFiles() {
  console.log("🔍 Verificando arquivos...")

  const results = {
    existing: [],
    missing: [],
  }

  EXPECTED_FILES.forEach((file) => {
    const fullPath = path.join(__dirname, "..", file)
    if (fs.existsSync(fullPath)) {
      results.existing.push(file)
      console.log(`✅ ${file}`)
    } else {
      results.missing.push(file)
      console.log(`❌ ${file}`)
    }
  })

  return results
}

/**
 * Verifica marcadores no README
 */
function checkMarkers() {
  console.log("\n🏷️  Verificando marcadores no README...")

  if (!fs.existsSync(README_FILE)) {
    console.log("❌ README.md não encontrado!")
    return { existing: [], missing: EXPECTED_MARKERS }
  }

  const readme = fs.readFileSync(README_FILE, "utf8")
  const results = {
    existing: [],
    missing: [],
  }

  EXPECTED_MARKERS.forEach((marker) => {
    if (readme.includes(marker)) {
      results.existing.push(marker)
      console.log(`✅ ${marker}`)
    } else {
      results.missing.push(marker)
      console.log(`❌ ${marker}`)
    }
  })

  return results
}

/**
 * Verifica se seções estão balanceadas (início e fim)
 */
function checkSectionBalance() {
  console.log("\n⚖️  Verificando balanceamento de seções...")

  const readme = fs.readFileSync(README_FILE, "utf8")
  const sections = ["STATUS_LIVE", "SOBRE_MIM", "TECH_STACK", "GITHUB_STATS", "SKILL_EVOLUTION", "CONTRIBUICOES"]

  const results = {
    balanced: [],
    unbalanced: [],
  }

  sections.forEach((section) => {
    const startMarker = `<!-- INICIO_${section} -->`
    const endMarker = `<!-- FIM_${section} -->`

    const hasStart = readme.includes(startMarker)
    const hasEnd = readme.includes(endMarker)

    if (hasStart && hasEnd) {
      results.balanced.push(section)
      console.log(`✅ ${section} (balanceada)`)
    } else {
      results.unbalanced.push(section)
      console.log(`❌ ${section} (${hasStart ? "tem início" : "sem início"}, ${hasEnd ? "tem fim" : "sem fim"})`)
    }
  })

  return results
}

/**
 * Gera relatório de integridade
 */
function generateIntegrityReport() {
  console.log("📋 RELATÓRIO DE INTEGRIDADE DO README\n")
  console.log("=" * 50)

  const fileResults = checkFiles()
  const markerResults = checkMarkers()
  const balanceResults = checkSectionBalance()

  console.log("\n📊 RESUMO:")
  console.log(`Arquivos: ${fileResults.existing.length}/${EXPECTED_FILES.length} existem`)
  console.log(`Marcadores: ${markerResults.existing.length}/${EXPECTED_MARKERS.length} encontrados`)
  console.log(`Seções: ${balanceResults.balanced.length}/6 balanceadas`)

  // Calcular score de integridade
  const totalChecks = EXPECTED_FILES.length + EXPECTED_MARKERS.length + 6
  const passedChecks = fileResults.existing.length + markerResults.existing.length + balanceResults.balanced.length
  const integrityScore = Math.round((passedChecks / totalChecks) * 100)

  console.log(`\n🎯 SCORE DE INTEGRIDADE: ${integrityScore}%`)

  if (integrityScore >= 90) {
    console.log("🟢 README está em excelente estado!")
  } else if (integrityScore >= 70) {
    console.log("🟡 README está funcional, mas pode ser melhorado")
  } else {
    console.log("🔴 README precisa de atenção urgente!")
  }

  // Sugestões de correção
  if (fileResults.missing.length > 0) {
    console.log("\n🔧 ARQUIVOS FALTANDO:")
    fileResults.missing.forEach((file) => console.log(`   - ${file}`))
  }

  if (markerResults.missing.length > 0) {
    console.log("\n🔧 MARCADORES FALTANDO:")
    markerResults.missing.forEach((marker) => console.log(`   - ${marker}`))
  }

  if (balanceResults.unbalanced.length > 0) {
    console.log("\n🔧 SEÇÕES DESBALANCEADAS:")
    balanceResults.unbalanced.forEach((section) => console.log(`   - ${section}`))
  }

  return {
    score: integrityScore,
    files: fileResults,
    markers: markerResults,
    balance: balanceResults,
  }
}

// Executar verificação
generateIntegrityReport()
