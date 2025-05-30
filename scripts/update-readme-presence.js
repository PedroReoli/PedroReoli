/**
 * Atualiza README com status de presença - Versão Markdown Puro
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

    // Gerar seção de status usando apenas Markdown e HTML simples
    const githubActivity = status.github

    const statusSection = `
## 📊 Últimas Atualizações

<div align="center">
  <table>
    <tr>
      <td align="center">
        <b>Status</b><br>
        <span>${githubActivity.isOnline ? "🟢 Online" : "⚪ Offline"}</span>
      </td>
      <td align="center">
        <b>Projeto Ativo</b><br>
        <span>${githubActivity.activeRepo}</span>
      </td>
      <td align="center">
        <b>Última Atividade</b><br>
        <span>${githubActivity.lastActive}</span>
      </td>
      <td align="center">
        <b>Commits Hoje</b><br>
        <span>${githubActivity.todayCommits}</span>
      </td>
    </tr>
  </table>
  <sub><i>Atualizado em: ${new Date().toLocaleString("pt-BR")}</i></sub>
</div>
`

    // Substituir seção de Status Live/Últimas Atualizações
    const statusRegex =
      /<div class="status-live-container">[\s\S]*?<\/div>(?:\s*<\/div>)?|<!-- Status Live -->[\s\S]*?<\/div>/

    let newReadme
    if (statusRegex.test(readme)) {
      newReadme = readme.replace(statusRegex, statusSection)
    } else {
      // Se não encontrar, adicionar após o typing SVG
      const typingRegex = /(alt="Typing SVG" \/>\s*<\/div>)/
      newReadme = readme.replace(typingRegex, `$1\n\n${statusSection}`)
    }

    fs.writeFileSync(readmeFile, newReadme)
    console.log("README atualizado com status em Markdown puro!")
  } catch (error) {
    console.error("Erro ao atualizar README:", error)
  }
}

updateReadmePresence()
