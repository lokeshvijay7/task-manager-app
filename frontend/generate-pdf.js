// Node.js script to generate PDF from HTML
const puppeteer = require("puppeteer")
const fs = require("fs")
const path = require("path")

async function generatePDF() {
  try {
    console.log("🚀 Starting PDF generation...")

    // Launch browser
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })

    const page = await browser.newPage()

    // Read HTML file
    const htmlPath = path.join(__dirname, "assignment-report.html")
    const htmlContent = fs.readFileSync(htmlPath, "utf8")

    // Set content
    await page.setContent(htmlContent, {
      waitUntil: "networkidle0",
    })

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        right: "15mm",
        bottom: "20mm",
        left: "15mm",
      },
      displayHeaderFooter: true,
      headerTemplate: `
                <div style="font-size: 10px; color: #666; width: 100%; text-align: center; margin-top: 10px;">
                    Task Manager Application - Assignment Report
                </div>
            `,
      footerTemplate: `
                <div style="font-size: 10px; color: #666; width: 100%; text-align: center; margin-bottom: 10px;">
                    Page <span class="pageNumber"></span> of <span class="totalPages"></span>
                </div>
            `,
    })

    // Save PDF
    const outputPath = path.join(__dirname, "Task-Manager-Assignment-Report.pdf")
    fs.writeFileSync(outputPath, pdfBuffer)

    console.log("✅ PDF generated successfully!")
    console.log(`📄 File saved as: ${outputPath}`)

    await browser.close()

    return outputPath
  } catch (error) {
    console.error("❌ Error generating PDF:", error)
    throw error
  }
}

// Run if called directly
if (require.main === module) {
  generatePDF()
    .then((filePath) => {
      console.log(`\n🎉 Your assignment PDF is ready!`)
      console.log(`📍 Location: ${filePath}`)
      console.log(`\n📋 What's included:`)
      console.log(`   ✓ Complete project documentation`)
      console.log(`   ✓ Technical specifications`)
      console.log(`   ✓ API documentation`)
      console.log(`   ✓ Database schema`)
      console.log(`   ✓ Testing results`)
      console.log(`   ✓ Deployment details`)
      console.log(`   ✓ Professional formatting`)
    })
    .catch((error) => {
      console.error("Failed to generate PDF:", error)
      process.exit(1)
    })
}

module.exports = generatePDF
