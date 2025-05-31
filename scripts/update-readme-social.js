/**
 * Social Networks Updater - Versão com GIFs Animados
 * Atualiza a seção de redes sociais no README com GIFs personalizados
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuração
const SOCIAL_DATA_FILE = path.join(__dirname, "../data/social-networks.json")
const README_FILE = path.join(__dirname, "../README.md")

/**
 * Remove seções de redes sociais duplicadas ou antigas
 */
function cleanupOldSocialSections(readme) {
  console.log("Limpando seções de redes sociais antigas...")

  // Remover divs de redes sociais antigas (com badges estáticos)
  readme = readme.replace(/<div>\s*<a href="https:\/\/www\.youtube\.com.*?<\/div>/gs, "")

  // Remover seções de social networks duplicadas
  readme = readme.replace(/<div align="center"[^>]*>\s*<h3>.*?Redes Sociais.*?<\/h3>[\s\S]*?<\/div>/g, "")

  // Remover seções antigas de conecte-se
  readme = readme.replace(/##  Conecte-se Comigo[\s\S]*?(?=##|$)/g, "")

  return readme
}

/**
 * Gera HTML para as redes sociais com GIFs
 */
function generateSocialNetworksHTML(socialData) {
  const { socialNetworks, style } = socialData

  // Gerar links com GIFs
  const socialLinks = socialNetworks
    .map((social) => {
      return `    <a href="${social.url}" target="_blank" rel="noopener noreferrer">
      <img src="${social.gif}" 
           alt="${social.alt}" 
           width="${style.gifWidth}" 
           height="${style.gifHeight}"
           style="border-radius: ${style.borderRadius}; margin: ${style.spacing};" />
    </a>`
    })
    .join("\n")

  return `<div align="center">
  <h3> Conecte-se Comigo</h3>
  <p>
${socialLinks}
  </p>
  <sub><i>Redes sociais atualizadas via GitHub Actions</i></sub>
</div>`
}

/**
 * Atualiza o README com as redes sociais animadas
 */
function updateReadmeSocialNetworks() {
  console.log("Atualizando redes sociais com GIFs animados...")

  try {
    // Verificar se arquivo de dados existe
    if (!fs.existsSync(SOCIAL_DATA_FILE)) {
      console.error("Arquivo data/social-networks.json não encontrado!")
      return
    }

    // Ler dados das redes sociais
    const socialData = JSON.parse(fs.readFileSync(SOCIAL_DATA_FILE, "utf8"))

    // Atualizar timestamp
    socialData.lastUpdated = new Date().toISOString()
    fs.writeFileSync(SOCIAL_DATA_FILE, JSON.stringify(socialData, null, 2))

    // Ler README atual
    let readme = fs.readFileSync(README_FILE, "utf8")

    // Limpar seções antigas
    readme = cleanupOldSocialSections(readme)

    // Gerar nova seção de redes sociais
    const socialNetworksHTML = generateSocialNetworksHTML(socialData)

    // Encontrar onde inserir (após o título principal)
    const titleRegex = /( {2}<div>\s*<a href="https:\/\/www\.youtube\.com.*?<\/div>\s*)/s

    if (titleRegex.test(readme)) {
      // Substituir a seção antiga de badges
      readme = readme.replace(titleRegex, `  ${socialNetworksHTML}\n  `)
    } else {
      // Se não encontrar, procurar pelo typing SVG e inserir antes
      const typingRegex =
        /( {2}<img src="https:\/\/readme-typing-svg\.herokuapp\.com.*?" alt="Typing SVG" \/>\s*<\/div>)/s

      if (typingRegex.test(readme)) {
        readme = readme.replace(typingRegex, `  ${socialNetworksHTML}\n  \n  $1`)
      } else {
        // Como último recurso, adicionar após o primeiro </div>
        const firstDivRegex = /(<\/div>)/
        readme = readme.replace(firstDivRegex, `$1\n\n${socialNetworksHTML}`)
      }
    }

    // Salvar README atualizado
    fs.writeFileSync(README_FILE, readme)
    console.log("Redes sociais atualizadas com GIFs animados!")

    // Log das redes sociais carregadas
    console.log(`Redes sociais carregadas: ${socialData.socialNetworks.length}`)
    socialData.socialNetworks.forEach((social) => {
      console.log(`- ${social.name}: ${social.url}`)
    })
  } catch (error) {
    console.error("Erro ao atualizar redes sociais:", error)
    throw error
  }
}

// Executar
updateReadmeSocialNetworks()
