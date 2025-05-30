/**
 * Atualiza README com dados da constelação - Versão Melhorada
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

    // Estatísticas dos repositórios
    const totalRepos = constellationData.repos.length
    const totalStars = constellationData.repos.reduce((sum, repo) => sum + repo.stars, 0)
    const languages = [...new Set(constellationData.repos.map((repo) => repo.mainLanguage))].length

    // Gerar seção de constelação melhorada
    const constellationMarkdown = `## Constelacao de Projetos

<div align="center">
  
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/constellation-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="./assets/constellation-light.svg">
    <img src="./assets/constellation-dark.svg" alt="Constelacao de Projetos" width="900">
  </picture>
  
  <table>
    <tr>
      <td align="center"><strong>Repositorios</strong><br>${totalRepos}</td>
      <td align="center"><strong>Stars Totais</strong><br>${totalStars}</td>
      <td align="center"><strong>Linguagens</strong><br>${languages}</td>
      <td align="center"><strong>Interativo</strong><br>Clique nas estrelas</td>
    </tr>
  </table>
  
  <br>
  
  **Como ler a constelacao:**
  - Tamanho da estrela = atividade do repositorio
  - Brilho da estrela = popularidade (stars)
  - Cor da estrela = linguagem principal
  - Conexoes = repositorios da mesma linguagem
  
  <br>
  <sub><i>Atualizado via GitHub Actions</i></sub>
</div>
`

    const newReadme = readme.replace(/## 🌌 Constelação de Projetos[\s\S]*?(?=##|$)/, constellationMarkdown)

    fs.writeFileSync(readmeFile, newReadme)
    console.log("README atualizado com constelação melhorada!")
  } catch (error) {
    console.error("Erro ao atualizar README:", error)
  }
}

updateReadmeConstellation()
