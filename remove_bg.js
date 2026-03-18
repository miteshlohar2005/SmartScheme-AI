import fs from 'fs';
import { createCanvas, loadImage } from 'canvas';

async function removeBackground() {
    const imgPath = 'public/farmer3d.png';
    const outPath = 'public/farmer3d_transparent.png';

    // Load the image
    const image = await loadImage(imgPath);

    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');

    // Draw original image
    ctx.drawImage(image, 0, 0);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Pick the color of the top-left pixel as the background color to remove
    const bgR = data[0];
    const bgG = data[1];
    const bgB = data[2];

    const tolerance = 40; // color distance tolerance

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Calculate distance
        const dist = Math.sqrt(Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2));

        if (dist < tolerance) {
            data[i + 3] = 0; // set alpha to 0
        }
    }

    ctx.putImageData(imageData, 0, 0);

    const outBuffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outPath, outBuffer);
    console.log('Saved transparent image to ' + outPath);
}

removeBackground().catch(console.error);
