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
