/**
 * Atualiza README com dados da constelação
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

    const constellationHtml = `<details>
  <summary><h2>Constelação de Projetos</h2></summary>
  <div align="center">
    <p>Visualização interativa dos repositórios como uma constelação estelar</p>
    
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="./assets/constellation-dark.svg">
      <source media="(prefers-color-scheme: light)" srcset="./assets/constellation-light.svg">
      <img src="./assets/constellation-dark.svg" alt="Constelação de Projetos" width="900">
    </picture>
    
    <p><i>Cada estrela representa um repositório. Tamanho = commits, brilho = stars, cor = linguagem.</i></p>
    <p><i>Clique nas estrelas para visitar os repositórios.</i></p>
    
    <br>
    <sub><i>Atualizado em: ${new Date(constellationData.lastUpdated).toLocaleString("pt-BR")}</i></sub>
  </div>
</details>`

    const newReadme = readme.replace(
      /<details>\s*<summary><h2>Constelação de Projetos<\/h2><\/summary>[\s\S]*?<\/details>/,
      constellationHtml,
    )

    fs.writeFileSync(readmeFile, newReadme)
    console.log("README atualizado com sucesso!")
  } catch (error) {
    console.error("Erro ao atualizar README:", error)
  }
}

updateReadmeConstellation()
