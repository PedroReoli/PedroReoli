/**
 * About Me Updater - Versão com Marcadores Seguros
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuração
const ABOUT_ME_FILE = path.join(__dirname, "../data/about-me.json")
const README_FILE = path.join(__dirname, "../README.md")

function updateAboutMe() {
  console.log("Atualizando seção Sobre Mim...")

  try {
    // Verificar se arquivo de dados existe
    if (!fs.existsSync(ABOUT_ME_FILE)) {
      console.error("❌ Arquivo data/about-me.json não encontrado!")
      return
    }

    // Ler dados do about-me
    const aboutMeData = JSON.parse(fs.readFileSync(ABOUT_ME_FILE, "utf8"))
    let readme = fs.readFileSync(README_FILE, "utf8")

    // Formatar tecnologias que está aprendendo
    const learningTechs = aboutMeData.learningTechs.join(", ")
    const hobbies = aboutMeData.hobbies.join(", ")

    // Gerar seção "Sobre Mim"
    const aboutMeContent = `<img align="right" alt="Chill gif" src="https://cdn.shopify.com/s/files/1/0578/3696/1997/t/9/assets/lofiboy.gif?v=103461765217895835051680702279" width="300" height="160" />

${aboutMeData.description}

- Atualmente na **${aboutMeData.company}**, ${aboutMeData.companyRole}
- Desenvolvendo o [${aboutMeData.currentProject}](${aboutMeData.currentProjectUrl}) - ${aboutMeData.currentProjectDescription}
- Sempre aprendendo algo novo em **${learningTechs}**
- Meu portfólio: [${aboutMeData.portfolio.replace(/^https?:\/\//, "")}](${aboutMeData.portfolio})
- Blog onde escrevo sobre código: [${aboutMeData.blog.replace(/^https?:\/\/www\./, "")}](${aboutMeData.blog})
- **Plot twist:** Quando não estou debugando, estou tocando guitarra - viciado em ${hobbies}`

    // Substituir APENAS entre os marcadores específicos
    const aboutMeRegex = /(<!-- INICIO_SOBRE_MIM -->)([\s\S]*?)(<!-- FIM_SOBRE_MIM -->)/

    if (aboutMeRegex.test(readme)) {
      readme = readme.replace(aboutMeRegex, `$1\n${aboutMeContent}\n$3`)
      console.log("✅ Seção Sobre Mim atualizada com sucesso!")
    } else {
      console.error("❌ Marcadores de Sobre Mim não encontrados no README!")
      return
    }

    // Salvar README atualizado
    fs.writeFileSync(README_FILE, readme)
  } catch (error) {
    console.error("Erro ao atualizar Sobre Mim:", error)
    throw error
  }
}

// Executar
updateAboutMe()
