const fs = require('fs');
const cheerio = require('cheerio');

function extractContent(filePath) {
    try {
        console.log("Reading file from:", filePath);
        const xhtmlContent = fs.readFileSync(filePath, 'utf8');
        console.log("File read successfully!");

        const $ = cheerio.load(xhtmlContent, { xmlMode: true });

        console.log("Looking for the section heading...");
        const startDiv = $('div.sectionHeading:contains("Introduction: My Story")');

        if (!startDiv.length) {
            console.error("Starting div not found. Ensure 'Introduction: My Story' matches the input file content.");
            return;
        }

        console.log("Section heading found. Extracting content...");
        let extractedContent = [];
        startDiv.nextAll('div').each((_, div) => {
            extractedContent.push($(div).html());
        });

        const outputFilePath = './output.json';
        console.log("Saving content to:", outputFilePath);
        fs.writeFileSync(outputFilePath, JSON.stringify(extractedContent, null, 2));
        console.log("Content extracted and saved to output.json");
    } catch (error) {
        console.error("Error reading or processing file:", error);
    }
}

// Use the file path correctly
extractContent('./input.xhtml');
