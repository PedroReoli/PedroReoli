/**
 * Atualiza a seção de tech stack no README - Versão HTML
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
  console.log("Atualizando README com HTML da tech stack...")

  try {
    // Ler README atual
    let readme = fs.readFileSync(README_FILE, "utf8")

    // Verificar se arquivos HTML existem
    const darkHTMLPath = path.join(__dirname, "../assets/tech-stack-dark.html")
    const lightHTMLPath = path.join(__dirname, "../assets/tech-stack-light.html")

    const darkHTMLExists = fs.existsSync(darkHTMLPath)
    const lightHTMLExists = fs.existsSync(lightHTMLPath)

    // Ler dados para estatísticas
    let totalTechs = "carregando"
    if (fs.existsSync(TECH_DATA_FILE)) {
      const techData = JSON.parse(fs.readFileSync(TECH_DATA_FILE, "utf8"))
      totalTechs = techData.technologies.length
    }

    // Gerar conteúdo baseado na disponibilidade dos HTMLs
    let techStackContent

    if (darkHTMLExists && lightHTMLExists) {
      // Ler conteúdo dos arquivos HTML
      const darkHTML = fs.readFileSync(darkHTMLPath, "utf8")
      const lightHTML = fs.readFileSync(lightHTMLPath, "utf8")

      techStackContent = `<!-- Dark theme -->
<div class="tech-stack-dark" style="display: block;">
${darkHTML}
</div>

<!-- Light theme (hidden by default, can be toggled) -->
<div class="tech-stack-light" style="display: none;">
${lightHTML}
</div>

<style>
@media (prefers-color-scheme: light) {
  .tech-stack-dark { display: none !important; }
  .tech-stack-light { display: block !important; }
}
</style>`
    } else {
      // Fallback se HTMLs não existirem
      techStackContent = `<div align="center">
  <p><strong>🔧 Tech Stack em construção...</strong></p>
  <p>Os componentes estão sendo gerados pelos GitHub Actions</p>
  <sub><i>${totalTechs} tecnologias • Stack sempre em evolução</i></sub>
</div>`
    }

    // Substituir APENAS entre os marcadores específicos
    const techStackRegex = /(<!-- INICIO_TECH_STACK -->)([\s\S]*?)(<!-- FIM_TECH_STACK -->)/

    if (techStackRegex.test(readme)) {
      readme = readme.replace(techStackRegex, `$1\n${techStackContent}\n$3`)
      console.log("✅ Tech Stack atualizada com sucesso!")

      if (!darkHTMLExists || !lightHTMLExists) {
        console.log("⚠️  HTMLs não encontrados, usando fallback")
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
