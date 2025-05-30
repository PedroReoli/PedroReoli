/**
 * Atualiza README com dados de presença
 */

const fs = require("fs")
const path = require("path")

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

    const badgesHtml = status.badges
      .map((badge) => {
        const url = `https://img.shields.io/badge/${encodeURIComponent(badge.text)}-${badge.color}?style=for-the-badge&logo=${badge.logo}&logoColor=${badge.logoColor}`
        return `    <img src="${url}" alt="${badge.text}" />`
      })
      .join("\n")

    const statusSection = `<div>
  <h2>Status Live</h2>
  <p align="center">
${badgesHtml}
    <br>
    <sub><i>Última atualização: ${new Date(status.lastUpdated).toLocaleString("pt-BR")}</i></sub>
  </p>
</div>`

    const newReadme = readme.replace(/<div>\s*<h2>Status Live<\/h2>[\s\S]*?<\/div>/, statusSection)

    fs.writeFileSync(readmeFile, newReadme)
    console.log("README atualizado com sucesso!")
  } catch (error) {
    console.error("Erro ao atualizar README:", error)
  }
}

updateReadmePresence()
