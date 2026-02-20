const Jimp = require('jimp');
const path = require('path');

async function removeBackground(imagePath, outputPath) {
    try {
        const image = await Jimp.read(imagePath);

        // Target color (white)
        const targetColor = { r: 255, g: 255, b: 255, a: 255 };
        const threshold = 15; // Tolerance for non-pure white

        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
            const r = this.bitmap.data[idx + 0];
            const g = this.bitmap.data[idx + 1];
            const b = this.bitmap.data[idx + 2];

            // Check if pixel is close to white
            if (Math.abs(r - targetColor.r) < threshold &&
                Math.abs(g - targetColor.g) < threshold &&
                Math.abs(b - targetColor.b) < threshold) {
                this.bitmap.data[idx + 3] = 0; // Set alpha to 0 (transparent)
            }
        });

        await image.writeAsync(outputPath);
        console.log(`Success: Background removed from ${imagePath}`);
    } catch (err) {
        console.error(`Error processing ${imagePath}:`, err);
    }
}

const logoPath = path.join(__dirname, 'public', 'fwsa-logo.png');
const faviconPath = path.join(__dirname, 'public', 'favicon-fwsa.png');

async function run() {
    await removeBackground(logoPath, logoPath);
    await removeBackground(faviconPath, faviconPath);
}

run();
