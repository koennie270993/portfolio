import * as fs from 'fs';
import * as path from 'path';
const sharp = require('sharp');

// Main optimization function
export function optimizeImages(directory: string, quality: number = 80): void {
  console.log(`Optimizing images in ${directory}...`);
  
  // Check if directory exists
  if (!fs.existsSync(directory)) {
    console.error(`Directory not found: ${directory}`);
    return;
  }
  
  // Get all files in directory
  const files = fs.readdirSync(directory);
  
  // Process each file
  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Recursively process subdirectories
      optimizeImages(filePath, quality);
    } else if (/\.(jpe?g|png)$/i.test(file)) {
      // Process image files
      const outputPath = filePath.replace(/(\.[^.]+)$/, '.optimized$1');
      
      // Skip if optimized version already exists
      if (fs.existsSync(outputPath)) {
        console.log(`Skipping already optimized: ${file}`);
        continue;
      }
      
      // Get file size before optimization
      const originalSize = stat.size;
      
      // Optimize the image
      sharp(filePath)
        .jpeg({ quality })
        .toFile(outputPath)
        .then(() => {
          // Get optimized file size
          const optimizedSize = fs.statSync(outputPath).size;
          const reduction = 100 - (optimizedSize / originalSize * 100);
          
          console.log(`Optimized ${file}: ${reduction.toFixed(2)}% reduction`);
          
          // Replace original with optimized version
          fs.unlinkSync(filePath);
          fs.renameSync(outputPath, filePath);
        })
        .catch(err => {
          console.error(`Error optimizing ${file}:`, err);
        });
    }
  }
}

// Export function for use in index.ts
// Don't run automatically
// optimizeImages('img'); 