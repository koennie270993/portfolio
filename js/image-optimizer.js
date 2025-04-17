const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configure compression options for different image types
const pngOptions = { 
  quality: 80, 
  compressionLevel: 9 
};

const jpgOptions = { 
  quality: 80, 
  mozjpeg: true 
};

// Function to recursively find all image files
function findImageFiles(dir, extensions) {
  let results = [];
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Recursively search directories
      results = results.concat(findImageFiles(filePath, extensions));
    } else {
      // Check if file extension matches
      const ext = path.extname(file).toLowerCase();
      if (extensions.includes(ext)) {
        results.push(filePath);
      }
    }
  }
  
  return results;
}

// Function to optimize an image by creating a new optimized version
async function optimizeImage(imagePath) {
  try {
    // Get the file extension
    const ext = path.extname(imagePath).toLowerCase();
    const originalSize = fs.statSync(imagePath).size;
    
    // Get directory and filename
    const dir = path.dirname(imagePath);
    const filename = path.basename(imagePath);
    const name = filename.substring(0, filename.lastIndexOf('.'));
    
    // Path for optimized image
    const optimizedPath = path.join(dir, `${name}-optimized${ext}`);
    
    // Create sharp instance
    const image = sharp(imagePath);
    
    // Optimize based on image type
    if (ext === '.png') {
      await image
        .png(pngOptions)
        .toFile(optimizedPath);
    } else if (ext === '.jpg' || ext === '.jpeg') {
      await image
        .jpeg(jpgOptions)
        .toFile(optimizedPath);
    } else if (ext === '.gif') {
      // For GIFs we'll just resize if they're over 1000px wide
      const metadata = await image.metadata();
      if (metadata.width > 1000) {
        await image
          .resize({ width: 1000 })
          .toFile(optimizedPath);
      } else {
        // Just copy the file if we're not changing it
        fs.copyFileSync(imagePath, optimizedPath);
      }
    }
    
    // Calculate compression savings
    const newSize = fs.statSync(optimizedPath).size;
    const savingsPercent = ((originalSize - newSize) / originalSize * 100).toFixed(2);
    
    console.log(`Optimized: ${imagePath}`);
    console.log(`  Original: ${(originalSize / 1024).toFixed(2)} KB`);
    console.log(`  New: ${(newSize / 1024).toFixed(2)} KB`);
    console.log(`  Savings: ${savingsPercent}%`);
    
    // If compression didn't save at least 5%, delete the optimized version
    if (parseFloat(savingsPercent) < 5) {
      fs.unlinkSync(optimizedPath);
      console.log(`  Deleted optimized version (savings too small)`);
      return null;
    }
    
    return {
      originalPath: imagePath,
      optimizedPath: optimizedPath,
      originalSize: originalSize,
      newSize: newSize,
      savings: savingsPercent
    };
    
  } catch (error) {
    console.error(`Error optimizing ${imagePath}:`, error);
    return null;
  }
}

// Function to generate HTML for preloading images
function generatePreloadHTML(optimizedImages) {
  let html = '<!-- Preload optimized images for faster loading -->\n';
  
  for (const img of optimizedImages) {
    if (img) {
      // Use a relative path for the web
      const relativePath = img.optimizedPath.replace(/\\/g, '/').split('img/')[1];
      html += `<link rel="preload" href="img/${relativePath}" as="image">\n`;
    }
  }
  
  return html;
}

// Main function
async function optimizeImages() {
  // Set up directories and extensions
  const imgDir = path.join(__dirname, '..', 'img');
  const extensions = ['.jpg', '.jpeg', '.png', '.gif'];
  
  console.log('Searching for images to optimize...');
  const imageFiles = findImageFiles(imgDir, extensions);
  console.log(`Found ${imageFiles.length} images.`);
  
  // Optimize each image
  let optimized = 0;
  const optimizedImages = [];
  
  for (const imagePath of imageFiles) {
    const result = await optimizeImage(imagePath);
    if (result) {
      optimizedImages.push(result);
    }
    optimized++;
    console.log(`Progress: ${optimized}/${imageFiles.length}\n`);
  }
  
  console.log(`Successfully optimized ${optimizedImages.length} out of ${imageFiles.length} images.`);
  
  // Generate preload HTML
  if (optimizedImages.length > 0) {
    const preloadHTML = generatePreloadHTML(optimizedImages);
    const preloadPath = path.join(__dirname, 'image-preload.html');
    fs.writeFileSync(preloadPath, preloadHTML);
    console.log(`Preload HTML generated at: ${preloadPath}`);
    console.log(`You can include this in your HTML head section to improve loading speed.`);
  }
  
  console.log('Image optimization complete!');
}

// Run the optimizer
optimizeImages().catch(console.error); 