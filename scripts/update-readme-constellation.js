/**
 * Atualiza README com dados da constelação - Versão Markdown Puro
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function updateReadmeConstellation() {
  try {
    const dataFile = path.join(__dirname, "../assets/constellation-data.json")
    const readmeFile = path.join(__dirname, "../README.md")

    if (!fs.existsSync(dataFile)) {
      console.log("Arquivo de dados da constelação não encontrado!")
      return
    }

    const constellationData = JSON.parse(fs.readFileSync(dataFile, "utf8"))
    const readme = fs.readFileSync(readmeFile, "utf8")

    // Gerar seção de constelação usando apenas Markdown e HTML simples
    const constellationMarkdown = `## 🌌 Constelação de Projetos

<div align="center">
  <h4>Visualização interativa dos repositórios como uma constelação estelar</h4>
  
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/constellation-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="./assets/constellation-light.svg">
    <img src="./assets/constellation-dark.svg" alt="Constelação de Projetos" width="900">
  </picture>
  
  <table>
    <tr>
      <td align="center">⭐ <b>Tamanho</b><br>Número de commits</td>
      <td align="center">✨ <b>Brilho</b><br>Quantidade de stars</td>
      <td align="center">🎨 <b>Cor</b><br>Linguagem principal</td>
      <td align="center">🔗 <b>Interação</b><br>Clique para visitar</td>
    </tr>
  </table>
  
  <br>
  <sub><i>Atualizado em: ${new Date(constellationData.lastUpdated).toLocaleString("pt-BR")}</i></sub>
</div>
`

    const newReadme = readme.replace(
      /<details>\s*<summary><h2>Constelação de Projetos<\/h2><\/summary>[\s\S]*?<\/details>/,
      constellationMarkdown,
    )

    fs.writeFileSync(readmeFile, newReadme)
    console.log("README atualizado com constelação em Markdown puro!")
  } catch (error) {
    console.error("Erro ao atualizar README:", error)
  }
}

updateReadmeConstellation()
