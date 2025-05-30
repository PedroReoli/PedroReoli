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

    // Substituir seção de Status Live/Últimas Atualizações
    const statusRegex = /<div class="status-live-container">[\s\S]*?<\/div>(?:\s*<\/div>)?/

    let newReadme
    if (statusRegex.test(readme)) {
      newReadme = readme.replace(statusRegex, statusSection)
    } else {
      // Se não encontrar, procurar por comentário
      const commentRegex = /(<!-- Status Live -->)/
      if (commentRegex.test(readme)) {
        newReadme = readme.replace(commentRegex, `$1\n${statusSection}`)
      } else {
        // Fallback: adicionar após o typing SVG
        const typingRegex = /(alt="Typing SVG" \/>\s*<\/div>)/
        newReadme = readme.replace(typingRegex, `$1\n\n${statusSection}`)
      }
    }

    fs.writeFileSync(readmeFile, newReadme)
    console.log("README atualizado com cards de status corrigidos!")
  } catch (error) {
    console.error("Erro ao atualizar README:", error)
  }
}

updateReadmePresence()
