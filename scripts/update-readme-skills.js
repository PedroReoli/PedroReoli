/**
 * Atualiza README com dados de skill evolution - Versão com Marcadores Seguros
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function updateReadmeSkills() {
  try {
    const skillFile = path.join(__dirname, "../assets/skill-evolution.json")
    const readmeFile = path.join(__dirname, "../README.md")
    let readme = fs.readFileSync(readmeFile, "utf8")

    let skillEvolutionContent

    if (!fs.existsSync(skillFile)) {
      console.log("⚠️  Arquivo de skill evolution não encontrado, usando fallback!")

      skillEvolutionContent = `<div align="center">
  <h4>Análise dos últimos 30 dias de commits</h4>
  
  | Linguagem | Commits | Tendência |
  |:----------|:-------:|:----------|
  | Carregando... | ... | ... |
  
  <br>
  
  <p>📊 <strong>Análise de skills em construção...</strong></p>
  <p>Os dados estão sendo processados pelos GitHub Actions</p>
  
  <br>
  <sub><i>Atualizando análise de skills...</i></sub>
</div>`
    } else {
      const skillData = JSON.parse(fs.readFileSync(skillFile, "utf8"))
      const currentWeek = Math.max(...Object.keys(skillData.weeklyData).map(Number))
      const currentLanguages = skillData.weeklyData[currentWeek].languages

      const topLanguages = Object.entries(currentLanguages)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([language, count]) => ({
          name: language,
          count,
          trend: skillData.trends.languages[language]?.trend || "stable",
          change: skillData.trends.languages[language]?.change || 0,
        }))

      // Gerar tabela de linguagens
      const languageRows = topLanguages
        .map((lang) => {
          const trendIcon = lang.trend === "up" ? "⬆️" : lang.trend === "down" ? "⬇️" : "↔️"
          const trendText = lang.trend === "up" ? `+${lang.change}` : lang.trend === "down" ? `-${lang.change}` : "0"
          return `| **${lang.name}** | ${lang.count} | ${trendIcon} ${trendText} |`
        })
        .join("\n")

      // Verificar se SVGs existem
      const darkSVGExists = fs.existsSync(path.join(__dirname, "../assets/skill-evolution-dark.svg"))
      const lightSVGExists = fs.existsSync(path.join(__dirname, "../assets/skill-evolution-light.svg"))

      skillEvolutionContent = `<div align="center">
  <h4>Análise dos últimos ${skillData.period.days} dias de commits</h4>
  
  | Linguagem | Commits | Tendência |
  |:----------|:-------:|:----------|
  ${languageRows}
  
  <br>
  
  ${
    darkSVGExists && lightSVGExists
      ? `
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/skill-evolution-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="./assets/skill-evolution-light.svg">
    <img src="./assets/skill-evolution-dark.svg" alt="Skill Evolution" width="800">
  </picture>
  `
      : `<p>📊 <strong>Gráfico de evolução sendo gerado...</strong></p>`
  }
  
  <br>
  <sub><i>Atualizado em: ${new Date(skillData.lastUpdated).toLocaleString("pt-BR")}</i></sub>
</div>`
    }

    // Substituir APENAS entre os marcadores específicos
    const skillRegex = /(<!-- INICIO_SKILL_EVOLUTION -->)([\s\S]*?)(<!-- FIM_SKILL_EVOLUTION -->)/

    if (skillRegex.test(readme)) {
      readme = readme.replace(skillRegex, `$1\n${skillEvolutionContent}\n$3`)
      console.log("✅ Skill Evolution atualizada com sucesso!")
    } else {
      console.error("❌ Marcadores de Skill Evolution não encontrados no README!")
      return
    }

    fs.writeFileSync(readmeFile, readme)
  } catch (error) {
    console.error("Erro ao atualizar README:", error)
  }
}

updateReadmeSkills()
