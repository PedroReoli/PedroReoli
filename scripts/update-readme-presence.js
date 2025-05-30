/**
 * Atualiza README com status de presença - Versão Melhorada
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

    // Gerar seção de status limpa sem emojis
    const githubActivity = status.github

    const statusSection = `
## Ultimas Atualizacoes

<div align="center">
  <table>
    <tr>
      <td align="center"><strong>Status</strong></td>
      <td align="center"><strong>Projeto Ativo</strong></td>
      <td align="center"><strong>Ultima Atividade</strong></td>
      <td align="center"><strong>Commits Hoje</strong></td>
    </tr>
    <tr>
      <td align="center">${githubActivity.isOnline ? "Online" : "Offline"}</td>
      <td align="center">${githubActivity.activeRepo}</td>
      <td align="center">${githubActivity.lastActive}</td>
      <td align="center">${githubActivity.todayCommits}</td>
    </tr>
  </table>
  <sub><i>Atualizado via GitHub Actions</i></sub>
</div>
`

    // Substituir seção de Status Live/Últimas Atualizações
    const statusRegex = /## 📊 Últimas Atualizações[\s\S]*?<\/div>|## Ultimas Atualizacoes[\s\S]*?<\/div>/

    let newReadme
    if (statusRegex.test(readme)) {
      newReadme = readme.replace(statusRegex, statusSection)
    } else {
      // Se não encontrar, adicionar após o typing SVG
      const typingRegex = /(alt="Typing SVG" \/>\s*<\/div>)/
      newReadme = readme.replace(typingRegex, `$1\n\n${statusSection}`)
    }

    fs.writeFileSync(readmeFile, newReadme)
    console.log("README atualizado com status melhorado!")
  } catch (error) {
    console.error("Erro ao atualizar README:", error)
  }
}

updateReadmePresence()
