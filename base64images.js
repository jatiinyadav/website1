const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'public/images/cars');
const outputFile = path.join(__dirname, 'cars.txt');

fs.readdir(imagesDir, (err, files) => {
  if (err) {
    console.error('❌ Error reading images directory:', err.message);
    return;
  }

  const webpFiles = files.filter(file => path.extname(file).toLowerCase() === '.webp');
  let output = '';

  webpFiles.forEach(file => {
    const fullPath = path.join(imagesDir, file);
    const baseName = path.basename(file, '.webp');

    const data = fs.readFileSync(fullPath);
    const base64 = `data:image/webp;base64,${data.toString('base64')}`;

    output += `${baseName}: ${base64}\n\n`;
  });

  fs.writeFileSync(outputFile, output.trim());
  console.log(`✅ Base64 strings written to ${outputFile}`);
});
