const sharp = require("sharp");
const fs = require("fs-extra");
const path = require("path");

const inputDir = path.join(__dirname, "public/images/cit");
const outputDir = path.join(__dirname, "public/images/cities");

(async () => {
  await fs.ensureDir(outputDir);
  const files = await fs.readdir(inputDir);

  const imageFiles = files.filter((file) => /\.(jpg|jpeg|png)$/i.test(file));

  for (const file of imageFiles) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, path.parse(file).name + ".webp");

    try {
      await sharp(inputPath)
        .webp({ quality: 60 }) // adjust quality if needed
        .toFile(outputPath);

      console.log(`✅ Converted: ${file}`);
    } catch (error) {
      console.error(`❌ Error converting ${file}:`, error.message);
    }
  }

  console.log("🎉 All images converted to WebP!");
})();
