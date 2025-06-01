/**
 * Atualiza a seção de tech stack no README - Versão com Marcadores Seguros
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuração
const README_FILE = path.join(__dirname, "../README.md")
const TECH_DATA_FILE = path.join(__dirname, "../data/tech-stack.json")

function updateReadmeTechStack() {
  console.log("Atualizando README com SVG da tech stack...")

  try {
    // Ler README atual
    let readme = fs.readFileSync(README_FILE, "utf8")

    // Verificar se SVGs existem
    const darkSVGPath = path.join(__dirname, "../assets/tech-stack-dark.svg")
    const lightSVGPath = path.join(__dirname, "../assets/tech-stack-light.svg")

    const darkSVGExists = fs.existsSync(darkSVGPath)
    const lightSVGExists = fs.existsSync(lightSVGPath)

    // Ler dados para estatísticas
    let totalTechs = "carregando"
    if (fs.existsSync(TECH_DATA_FILE)) {
      const techData = JSON.parse(fs.readFileSync(TECH_DATA_FILE, "utf8"))
      totalTechs = techData.technologies.length
    }

    // Gerar conteúdo baseado na disponibilidade dos SVGs
    let techStackContent

    if (darkSVGExists && lightSVGExists) {
      techStackContent = `<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/tech-stack-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="./assets/tech-stack-light.svg">
    <img src="./assets/tech-stack-dark.svg" alt="Tech Stack" width="100%">
  </picture>
  
  <br>
  <sub><i>${totalTechs} tecnologias • Stack sempre em evolução • Atualizado via GitHub Actions</i></sub>
</div>`
    } else {
      // Fallback se SVGs não existirem
      techStackContent = `<div align="center">
  <p>🚀 <strong>Tech Stack em construção...</strong></p>
  <p>Os SVGs estão sendo gerados pelos GitHub Actions</p>
  <sub><i>Stack sempre em evolução • Atualizado via GitHub Actions</i></sub>
</div>`
    }

    // Substituir APENAS entre os marcadores específicos
    const techStackRegex = /(<!-- INICIO_TECH_STACK -->)([\s\S]*?)(<!-- FIM_TECH_STACK -->)/

    if (techStackRegex.test(readme)) {
      readme = readme.replace(techStackRegex, `$1\n${techStackContent}\n$3`)
      console.log("✅ Tech Stack atualizada com sucesso!")

      if (!darkSVGExists || !lightSVGExists) {
        console.log("⚠️  SVGs não encontrados, usando fallback")
      }
    } else {
      console.error("❌ Marcadores de Tech Stack não encontrados no README!")
      return
    }

    // Salvar README atualizado
    fs.writeFileSync(README_FILE, readme)
  } catch (error) {
    console.error("Erro ao atualizar README:", error)
    throw error
  }
}

// Executar
updateReadmeTechStack()
