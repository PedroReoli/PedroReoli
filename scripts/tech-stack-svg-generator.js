/**
 * Tech Stack Reporter - Versão Simplificada
 * Apenas reporta o status das tecnologias
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuração
const TECH_DATA_FILE = path.join(__dirname, "../data/tech-stack.json")

async function reportTechStack() {
  console.log("📊 Relatório da Tech Stack...")

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

    // Atualizar timestamp
    techData.lastUpdated = new Date().toISOString()
    fs.writeFileSync(TECH_DATA_FILE, JSON.stringify(techData, null, 2))

    console.log(`✅ Tech Stack verificada!`)
    console.log(`📊 Total de tecnologias: ${technologies.length}`)
    console.log(`🕒 Última atualização: ${new Date().toLocaleString("pt-BR")}`)

    // Listar tecnologias
    console.log("\n📋 Tecnologias:")
    technologies.forEach((tech, index) => {
      console.log(`   ${index + 1}. ${tech.name}`)
    })

    return {
      totalTechs: technologies.length,
      lastUpdated: techData.lastUpdated,
    }
  } catch (error) {
    console.error("❌ Erro ao verificar tech stack:", error)
    throw error
  }
}

reportTechStack().catch(console.error)
