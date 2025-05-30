const fs = require("fs")
const path = require("path")

const readmePath = path.join(__dirname, "..", "README.md")
const reportsDir = path.join(__dirname, "..", "reports")

function updateReadme() {
  const reportFiles = fs.readdirSync(reportsDir).filter((file) => file.endsWith(".json"))

  let observatoryData = ""

  reportFiles.forEach((file) => {
    const reportFile = path.join(reportsDir, file)
    if (fs.existsSync(reportFile)) {
      const reportContent = fs.readFileSync(reportFile, "utf-8")
      try {
        const report = JSON.parse(reportContent)
        observatoryData += `\n### ${report.name}\n`
        observatoryData += `\n- Date: ${report.date}\n`
        observatoryData += `\n- Score: ${report.score}\n`
        observatoryData += `\n- [Report](${path.relative(path.join(__dirname, ".."), reportFile)})\n` // Create relative path to report
      } catch (error) {
        console.error(`Error parsing report file ${file}: ${error}`)
      }
    } else {
      console.warn(`Report file ${file} does not exist.`)
    }
  })

  const startMarker = "## Observatory Reports"
  const endMarker = "<!-- END OBSERVATORY REPORTS -->"

  const readmeContent = fs.readFileSync(readmePath, "utf-8")

  const startIndex = readmeContent.indexOf(startMarker)
  const endIndex = readmeContent.indexOf(endMarker)

  if (startIndex === -1 || endIndex === -1) {
    console.error("Markers not found in README.md")
    return
  }

  const updatedReadmeContent =
    readmeContent.substring(0, startIndex + startMarker.length) +
    "\n" +
    observatoryData +
    "\n" +
    readmeContent.substring(endIndex)

  fs.writeFileSync(readmePath, updatedReadmeContent, "utf-8")
  console.log("README.md updated successfully!")
}

updateReadme()
