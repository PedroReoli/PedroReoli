/**
 * English README Updater
 * Sincroniza dados do README principal com a versão em inglês
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
 * Atualiza README em inglês com dados traduzidos
 */
async function updateEnglishReadme() {
  console.log("Atualizando README em inglês...")

  try {
    // Verificar se arquivo README em inglês existe
    if (!fs.existsSync(EN_README_PATH)) {
      console.log("Arquivo README.en.md não encontrado, criando...")
      fs.mkdirSync(path.dirname(EN_README_PATH), { recursive: true })
      fs.writeFileSync(EN_README_PATH, "# Pedro Reoli | Full Stack Developer Jr\n\n*English version coming soon...*")
    }

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
