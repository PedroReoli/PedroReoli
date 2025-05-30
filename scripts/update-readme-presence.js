/**
 * Atualiza README com cards de presença minimalistas
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function updateReadmePresence() {
  try {
    const statusFile = path.join(__dirname, "../assets/presence-status.json")
    const readmeFile = path.join(__dirname, "../README.md")

    if (!fs.existsSync(statusFile)) {
      console.log("Arquivo de status não encontrado!")
      return
    }

    const status = JSON.parse(fs.readFileSync(statusFile, "utf8"))
    const readme = fs.readFileSync(readmeFile, "utf8")

    // Usar o HTML gerado pelo presence-tracker
    const statusSection = status.html

    // Substituir seção de Últimas Atualizações
    const statusRegex =
      /<div class="status-live-container">[\s\S]*?<\/div>(?:\s*<\/div>)?|<div>\s*<h2>Últimas Atualizações<\/h2>[\s\S]*?<\/div>/

    let newReadme
    if (statusRegex.test(readme)) {
      newReadme = readme.replace(statusRegex, statusSection)
    } else {
      // Se não encontrar, adicionar após o header
      const headerRegex = /(<!-- Últimas Atualizações -->|<\/div>\s*\n\s*<img src="https:\/\/readme-typing-svg)/
      if (headerRegex.test(readme)) {
        newReadme = readme.replace(headerRegex, `${statusSection}\n\n$1`)
      } else {
        // Fallback: adicionar após o primeiro </div>
        newReadme = readme.replace(/(<\/div>\s*\n)/, `$1\n${statusSection}\n`)
      }
    }

    fs.writeFileSync(readmeFile, newReadme)
    console.log("README atualizado com cards de status minimalistas!")
  } catch (error) {
    console.error("Erro ao atualizar README:", error)
  }
}

updateReadmePresence()
