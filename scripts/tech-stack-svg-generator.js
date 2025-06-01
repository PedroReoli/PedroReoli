/**
 * Tech Stack Validator - Verifica URLs do devicons
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuração
const TECH_DATA_FILE = path.join(__dirname, "../data/tech-stack.json")

/**
 * Verifica se URL do devicon está acessível
 */
async function checkDeviconURL(url, techName) {
  try {
    const response = await fetch(url, { method: "HEAD" })
    if (response.ok) {
      console.log(`✅ ${techName}: OK`)
      return true
    } else {
      console.log(`❌ ${techName}: HTTP ${response.status}`)
      return false
    }
  } catch (error) {
    console.log(`❌ ${techName}: ${error.message}`)
    return false
  }
}

async function validateTechStack() {
  console.log("🔍 Validando URLs do devicons...")

  try {
    // Verificar arquivo de dados
    if (!fs.existsSync(TECH_DATA_FILE)) {
      console.error("❌ Arquivo data/tech-stack.json não encontrado!")
      return
    }

    // Ler dados
    const techData = JSON.parse(fs.readFileSync(TECH_DATA_FILE, "utf8"))
    const technologies = techData.technologies

    if (!technologies || technologies.length === 0) {
      console.error("❌ Nenhuma tecnologia encontrada!")
      return
    }

    console.log(`📊 Verificando ${technologies.length} tecnologias...\n`)

    // Verificar cada URL
    let validCount = 0
    let invalidCount = 0

    for (const tech of technologies) {
      const isValid = await checkDeviconURL(tech.url, tech.name)
      if (isValid) {
        validCount++
      } else {
        invalidCount++
      }

      // Pequena pausa para não sobrecarregar
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    // Atualizar timestamp
    techData.lastUpdated = new Date().toISOString()
    fs.writeFileSync(TECH_DATA_FILE, JSON.stringify(techData, null, 2))

    console.log(`\n📊 Resumo da validação:`)
    console.log(`✅ URLs válidas: ${validCount}`)
    console.log(`❌ URLs inválidas: ${invalidCount}`)
    console.log(`📈 Taxa de sucesso: ${Math.round((validCount / technologies.length) * 100)}%`)

    return {
      totalTechs: technologies.length,
      validUrls: validCount,
      invalidUrls: invalidCount,
      lastUpdated: techData.lastUpdated,
    }
  } catch (error) {
    console.error("❌ Erro ao validar tech stack:", error)
    throw error
  }
}

validateTechStack().catch(console.error)
