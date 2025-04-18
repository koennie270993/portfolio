import * as fs from 'fs';
import * as path from 'path';

// Function to copy a file from js/ to src/ and change extension
function moveJsToTs(jsFile: string): void {
  const sourcePath = path.join(__dirname, '..', 'js', jsFile);
  const destPath = path.join(__dirname, path.basename(jsFile, '.js') + '.ts');
  
  try {
    if (fs.existsSync(sourcePath)) {
      const content = fs.readFileSync(sourcePath, 'utf8');
      fs.writeFileSync(destPath, content);
      console.log(`Moved ${jsFile} to ${path.basename(destPath)}`);
    } else {
      console.log(`File not found: ${sourcePath}`);
    }
  } catch (error) {
    console.error(`Error moving ${jsFile}:`, error);
  }
}

// Main function
function main(): void {
  const jsFiles = [
    'jquery-1.11.0.js',
    'jquery.easing.min.js',
    'bootstrap.min.js',
    'bootstrap.js',
    'image-update.js',
    'image-swap.js',
    'image-optimizer.js',
    'analytics-enhanced.js',
    'contact_me_static.js',
    'video-player.js',
    'jqBootstrapValidation.js',
    'cbpAnimatedHeader.js',
    'cbpAnimatedHeader.min.js',
    'classie.js'
  ];
  
  // Move each file
  jsFiles.forEach(moveJsToTs);
  console.log('Completed moving all JavaScript files to TypeScript.');
}

// Run the main function
main(); 