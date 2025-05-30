/**
 * English README Updater
 * Sincroniza dados do README principal com a versão em inglês
 */

const fs = require("fs")
const path = require("path")

// Configuração
const ASSETS_DIR = path.join(__dirname, "../assets")
const EN_README_PATH = path.join(__dirname, "../EnglishVersion/README.en.md")

// Templates de tradução para insights
const TRANSLATION_TEMPLATES = {
  cronotipo: {
    matinal: "morning",
    vespertino: "afternoon",
    noturno: "night",
    madrugador: "late-night",
  },
  insights: {
    "Esta semana você foi um verdadeiro Dev Matinal": "This week you were a true Morning Dev",
    "Tarde produtiva": "Productive afternoon",
    "Coruja do código": "Code owl",
    "Insônia produtiva": "Productive insomnia",
    commits: "commits",
    linguagem: "language",
    "em alta": "trending up",
    crescimento: "growth",
  },
  badges: {
    "Commit Master": "Commit Master",
    Polyglot: "Polyglot",
    "Consistency King": "Consistency King",
    "Night Owl": "Night Owl",
    "Early Bird": "Early Bird",
  },
  goals: {
    Finalizar: "Complete",
    Implementar: "Implement",
    Estudar: "Study",
    Refatorar: "Refactor",
    Escrever: "Write",
  },
}

/**
 * Traduz texto do português para inglês
 */
function translateText(text) {
  let translated = text

  // Traduzir frases comuns
  Object.entries(TRANSLATION_TEMPLATES.insights).forEach(([pt, en]) => {
    translated = translated.replace(new RegExp(pt, "gi"), en)
  })

  // Traduzir badges
  Object.entries(TRANSLATION_TEMPLATES.badges).forEach(([pt, en]) => {
    translated = translated.replace(new RegExp(pt, "gi"), en)
  })

  return translated
}

/**
 * Traduz dados do observatório
 */
function translateObservatoryData(data) {
  const translated = JSON.parse(JSON.stringify(data))

  // Traduzir cronotipo
  if (translated.cronotipo && translated.cronotipo.type) {
    const cronotypeMap = {
      matinal: "morning ☀️",
      vespertino: "afternoon 🌅",
      noturno: "night 🌙",
      madrugador: "late-night 🦉",
    }
    translated.cronotipo.typeEn = cronotypeMap[translated.cronotipo.type] || translated.cronotipo.type
  }

  // Traduzir insights
  if (translated.insights) {
    translated.insightsEn = translated.insights.map((insight) => translateText(insight))
  }

  // Traduzir badges
  if (translated.gamification && translated.gamification.badges) {
    translated.gamification.badgesEn = translated.gamification.badges.map((badge) => translateText(badge))
  }

  // Traduzir título
  if (translated.gamification && translated.gamification.title) {
    const titleMap = {
      "Code Architect": "Code Architect",
      "Senior Developer": "Senior Developer",
      "Full Stack Developer": "Full Stack Developer",
      "Frontend Specialist": "Frontend Specialist",
      "Junior Developer": "Junior Developer",
      "Code Apprentice": "Code Apprentice",
    }
    translated.gamification.titleEn = titleMap[translated.gamification.title] || translated.gamification.title
  }

  return translated
}

/**
 * Traduz metas da semana
 */
function translateGoals(goals) {
  return goals.map((goal) => ({
    ...goal,
    nameEn: translateText(goal.name),
  }))
}

/**
 * Atualiza README em inglês com dados traduzidos
 */
async function updateEnglishReadme() {
  console.log("Atualizando README em inglês...")

  try {
    // Verificar se arquivos de dados existem
    const observatoryFile = path.join(ASSETS_DIR, "observatory-report.json")
    const skillFile = path.join(ASSETS_DIR, "skill-evolution.json")
    const presenceFile = path.join(ASSETS_DIR, "presence-status.json")

    let readme = fs.readFileSync(EN_README_PATH, "utf8")

    // Atualizar status de presença
    if (fs.existsSync(presenceFile)) {
      const presenceData = JSON.parse(fs.readFileSync(presenceFile, "utf8"))

      const badgesHtml = presenceData.badges
        .map((badge) => {
          // Traduzir texto do badge
          const translatedText = translateText(badge.text)
          const url = `https://img.shields.io/badge/${encodeURIComponent(translatedText)}-${badge.color}?style=for-the-badge&logo=${badge.logo}&logoColor=${badge.logoColor}`
          return `    <img src="${url}" alt="${translatedText}" />`
        })
        .join("\n")

      const statusSection = `<div id="live-status">
  <h2>🟢 Live Status</h2>
  <p align="center">
${badgesHtml}
    <br>
    <sub><i>Last updated: ${new Date(presenceData.lastUpdated).toLocaleString("en-US")}</i></sub>
  </p>
</div>`

      readme = readme.replace(/<div id="live-status">[\s\S]*?<\/div>/, statusSection)
    }

    // Atualizar skill evolution
    if (fs.existsSync(skillFile)) {
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

      const skillEvolutionHtml = `<details id="skill-evolution">
  <summary><h2>📈 Skill Evolution</h2></summary>
  <div align="center">
    <p>Analysis of the last ${skillData.period.days} days of commits</p>
    
    <table>
      <thead>
        <tr>
          <th>Language</th>
          <th>Commits</th>
          <th>Trend</th>
        </tr>
      </thead>
      <tbody>
        ${topLanguages
          .map((lang) => {
            const trendIcon = lang.trend === "up" ? "⬆️" : lang.trend === "down" ? "⬇️" : "↔️"
            const trendText = lang.trend === "up" ? `+${lang.change}` : lang.trend === "down" ? `-${lang.change}` : "0"

            return `<tr>
            <td><strong>${lang.name}</strong></td>
            <td align="center">${lang.count}</td>
            <td align="center">${trendIcon} ${trendText}</td>
          </tr>`
          })
          .join("\n        ")}
      </tbody>
    </table>
    
    <br>
    
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="../assets/skill-evolution-dark.svg">
      <source media="(prefers-color-scheme: light)" srcset="../assets/skill-evolution-light.svg">
      <img src="../assets/skill-evolution-dark.svg" alt="Skill Evolution" width="800">
    </picture>
    
    <br>
    <sub><i>Updated on: ${new Date(skillData.lastUpdated).toLocaleString("en-US")}</i></sub>
  </div>
</details>`

      readme = readme.replace(/<details id="skill-evolution">[\s\S]*?<\/details>/, skillEvolutionHtml)
    }

    // Atualizar observatório
    if (fs.existsSync(observatoryFile)) {
      const observatoryData = JSON.parse(fs.readFileSync(observatoryFile, "utf8"))
      const translatedData = translateObservatoryData(observatoryData)

      const observatoryHtml = `<details id="observatory">
  <summary><h2>🔭 Dev Observatory</h2></summary>
  <div align="center">
    
    <!-- Gamification -->
    <div style="background: linear-gradient(145deg, #1e1e2e, #2a2a3e); border-radius: 12px; padding: 20px; margin: 20px; box-shadow: 0 8px 16px rgba(0,0,0,0.3);">
      <h3>🎮 Developer Status</h3>
      <p>
        <img src="https://img.shields.io/badge/Level-${translatedData.gamification.level}-6E56CF?style=for-the-badge&logo=levelsdotfyi&logoColor=white" alt="Level" />
        <img src="https://img.shields.io/badge/XP-${translatedData.gamification.totalXP}-4CAF50?style=for-the-badge&logo=xp&logoColor=white" alt="XP" />
        <img src="https://img.shields.io/badge/Title-${encodeURIComponent(translatedData.gamification.titleEn || translatedData.gamification.title)}-FF9800?style=for-the-badge&logo=crown&logoColor=white" alt="Title" />
      </p>
      
      <h4>🏆 Earned Badges</h4>
      <p>
        ${(translatedData.gamification.badgesEn || translatedData.gamification.badges)
          .map(
            (badge) =>
              `<img src="https://img.shields.io/badge/${encodeURIComponent(badge)}-Earned-success?style=flat-square" alt="${badge}" />`,
          )
          .join(" ")}
      </p>
    </div>
    
    <!-- Dev Chronotype -->
    <div style="background: linear-gradient(145deg, #2d1b69, #3d2b79); border-radius: 12px; padding: 20px; margin: 20px; box-shadow: 0 8px 16px rgba(0,0,0,0.3);">
      <h3>🧭 Dev Chronotype</h3>
      <p><strong>You are a ${translatedData.cronotipo.typeEn || translatedData.cronotipo.type} Dev</strong></p>
      <p>Peak productivity hours: <strong>${translatedData.cronotipo.peakStart}h - ${translatedData.cronotipo.peakEnd}h</strong></p>
      <p>Total commits analyzed: <strong>${translatedData.cronotipo.totalCommits}</strong></p>
    </div>
    
    <!-- Weekly Insights -->
    <div style="background: linear-gradient(145deg, #0f3460, #1f4470); border-radius: 12px; padding: 20px; margin: 20px; box-shadow: 0 8px 16px rgba(0,0,0,0.3);">
      <h3>💡 Weekly Insights</h3>
      ${(translatedData.insightsEn || translatedData.insights).map((insight) => `<p>• ${insight}</p>`).join("")}
    </div>
    
    <!-- Weekly Goals -->
    <div style="background: linear-gradient(145deg, #1e1e2e, #2a2a3e); border-radius: 12px; padding: 20px; margin: 20px; box-shadow: 0 8px 16px rgba(0,0,0,0.3);">
      <h3>🎯 Weekly Goals</h3>
      <table>
        <thead>
          <tr>
            <th>Goal</th>
            <th>Progress</th>
          </tr>
        </thead>
        <tbody>
          ${translatedData.weeklyGoals
            .slice(0, 5)
            .map((goal) => {
              const percentage = Math.round((goal.progress / goal.target) * 100)
              const progressBar = "█".repeat(Math.floor(percentage / 10)) + "░".repeat(10 - Math.floor(percentage / 10))
              return `<tr>
              <td>${goal.nameEn || goal.name}</td>
              <td>${progressBar} ${percentage}%</td>
            </tr>`
            })
            .join("")}
        </tbody>
      </table>
    </div>
    
    <br>
    <sub><i>Report updated on: ${new Date(translatedData.lastUpdated).toLocaleString("en-US")}</i></sub>
  </div>
</details>`

      readme = readme.replace(/<details id="observatory">[\s\S]*?<\/details>/, observatoryHtml)
    }

    // Salvar README atualizado
    fs.writeFileSync(EN_README_PATH, readme)
    console.log("README em inglês atualizado com sucesso!")
  } catch (error) {
    console.error("Erro ao atualizar README em inglês:", error)
    throw error
  }
}

// Executar
updateEnglishReadme().catch(console.error)
