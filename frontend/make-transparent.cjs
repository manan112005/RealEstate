const { Jimp } = require('jimp');
const path = require('path');

async function makeTransparent() {
  const imagePath = path.join(__dirname, 'public', 'logo.png');
  try {
    const image = await Jimp.read(imagePath);
    
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];
      
      // If the pixel is very close to white
      if (red > 230 && green > 230 && blue > 230) {
        // Set alpha to 0 (transparent)
        this.bitmap.data[idx + 3] = 0;
      }
    });

    // Jimp v1 write
    await image.write(imagePath);
    console.log('Successfully made white background transparent!');
  } catch (err) {
    console.error('Error processing image:', err);
  }
}

makeTransparent();
