# Kindle Highlights Extractor and Formatter

This project automates the process of extracting highlights from a Kindle export file and formatting them into a Word document with proper indentation and spacing. The workflow ensures that your Kindle highlights are easy to read and ready for use in documentation or personal reference.

---

## Table of Contents

- [Overview](#overview)
- [Requirements](#requirements)
- [Installation](#installation)
- [Workflow](#workflow)
  - [Step 1: Export Highlights from Kindle](#step-1-export-highlights-from-kindle)
  - [Step 2: Set Up Your Project Environment](#step-2-set-up-your-project-environment)
  - [Step 3: Install Node.js and Dependencies](#step-3-install-nodejs-and-dependencies)
  - [Step 4: Extract Highlights](#step-4-extract-highlights)
  - [Step 5: Format Highlights into a Word Document](#step-5-format-highlights-into-a-word-document)
- [Output](#output)
- [Troubleshooting](#troubleshooting)
- [Technology Stack](#Technology)

---

## Overview

This project extracts highlights from a Kindle XHTML export file and formats them into a Word document. The process includes:
1. Parsing highlights from an `input.xhtml` file.
2. Saving them as a JSON file (`output.json`).
3. Formatting the JSON highlights into a structured Word document (`formatted_output.docx`).

---

## Requirements

### Software Requirements
- **Node.js**: Install from [Node.js Official Website](https://nodejs.org/).
- **npm**: Comes bundled with Node.js.

### File Requirements
- Kindle export file in **XHTML format**, saved as `input.xhtml`.

### Dependencies
- [docx](https://www.npmjs.com/package/docx): Library for creating Word documents in Node.js.

---

## Installation

1. Clone or create a new project folder on your system.
2. Place the exported Kindle file (`input.xhtml`) into the folder.
3. Open a terminal and navigate to the project folder.
4. Initialize a new Node.js project:
   ```bash
   npm init -y
    ```
5. Install the `docx` package:
    ```bash
    npm install docx
    ```

## Workflow
### Step 1: Export Highlights from Kindle
1. Export your highlights in XHTML format from your Kindle device or app.
2. Save the file as input.xhtml.


### Step 2: Set Up Your Project Environment
1. Ensure the exported input.xhtml file is copied into the project folder


### Step 3: Install Node.js and Dependencies
1. Install Node.js and npm on your system.
2. verify Node.js installation by running:
    ```bash
    node -v
    ```
3. Install the `docx` package by running:
    ```bash
    npm install docx
    ```
### Step 4: Extract Highlights
1. Create a file named **extract.js** and add the following code: 

```javascript
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

```

2. Run the script to generate the **output.json** file:
    ```bash
    node extract.js
    ```

### Step 5: Format Highlights into a Word Document
1. Create a new file named **prettify-word.js** and add the following code:
```javascript
const fs = require('fs');
const { Document, Packer, Paragraph, TextRun } = require('docx');

// Read the JSON file
fs.readFile('output.json', 'utf8', async (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  // Parse the JSON content
  const entries = JSON.parse(data);

  // Create paragraphs for each entry
  const paragraphs = entries.map(entry =>
    new Paragraph({
      children: [
        new TextRun({
          text: `• ${entry.trim()}`,
          break: 1, // Add line breaks between bullet points
        }),
      ],
    })
  );

  // Create a new document
  const doc = new Document({
    sections: [
      {
        properties: {}, // You can add properties here if needed
        children: paragraphs,
      },
    ],
  });

  // Write the document to a Word file
  try {
    const buffer = await Packer.toBuffer(doc);
    fs.writeFile('formatted_output.docx', buffer, err => {
      if (err) {
        console.error('Error writing the Word document:', err);
        return;
      }
      console.log('Formatted content written to formatted_output.docx');
    });
  } catch (error) {
    console.error('Error packing the document:', error);
  }
});

```

2. Run the script to generate the **formatted_output.docx** file:
    ```bash
    node prettify-word.js
    ```

---
## Output
1. output.json: JSON file containing extracted highlights.
2. formatted_output.docx: Word document with formatted highlights.

---

## troubleshooting
1. Error: Cannot find module 'docx'
    - Run `npm install docx` to install the docx package.
2. File not found error
    - Ensure that the input.xhtml file is in the project folder and correctly named.
3. Invalid XHTML format
    - Ensure input.xhtml contains valid XHTML content with Kindle highlights.


---
## Technology
- Node.js
- npm
- docx