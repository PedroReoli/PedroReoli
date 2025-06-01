/**
 * Atualiza README com status de presença - Versão com Marcadores Seguros
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
    let readme = fs.readFileSync(readmeFile, "utf8")

    // Gerar seção de status limpa
    const githubActivity = status.github

    const statusSection = `<div align="center">
  <table>
    <tr>
      <td align="center"><strong>Status</strong></td>
      <td align="center"><strong>Projeto Ativo</strong></td>
      <td align="center"><strong>Ultima Atividade</strong></td>
      <td align="center"><strong>Commits Hoje</strong></td>
    </tr>
    <tr>
      <td align="center">${githubActivity.isOnline ? "🟢 Online" : "🔴 Offline"}</td>
      <td align="center">${githubActivity.activeRepo}</td>
      <td align="center">${githubActivity.lastActive}</td>
      <td align="center">${githubActivity.todayCommits}</td>
    </tr>
  </table>
  <sub><i>Última atualização: ${new Date(status.lastUpdated).toLocaleString("pt-BR")}</i></sub>
</div>`

    // Substituir APENAS entre os marcadores específicos
    const statusRegex = /(<!-- INICIO_STATUS_LIVE -->)([\s\S]*?)(<!-- FIM_STATUS_LIVE -->)/

    if (statusRegex.test(readme)) {
      readme = readme.replace(statusRegex, `$1\n${statusSection}\n$3`)
      console.log("✅ Status atualizado com sucesso!")
    } else {
      console.error("❌ Marcadores de status não encontrados no README!")
      return
    }

    fs.writeFileSync(readmeFile, readme)
  } catch (error) {
    console.error("Erro ao atualizar README:", error)
  }
}

updateReadmePresence()
