import * as fs from 'fs';
import * as path from 'path';

// Define the directory where images are stored
const imgDir = path.join(__dirname, '..', 'img');

// Function to update image references in HTML files
export function updateImageReferences(htmlFiles: string[] = []): void {
  console.log('Starting image reference update...');
  
  // First, get all images in the img directory
  if (!fs.existsSync(imgDir)) {
    console.error(`Image directory not found: ${imgDir}`);
    return;
  }
  
  // Find all images recursively
  const images = findImages(imgDir);
  console.log(`Found ${images.length} images.`);
  
  // If no HTML files are provided, find all HTML files in the project
  if (htmlFiles.length === 0) {
    const rootDir = path.join(__dirname, '..');
    htmlFiles = findHtmlFiles(rootDir);
  }
  
  console.log(`Processing ${htmlFiles.length} HTML files.`);
  
  // Process each HTML file
  for (const htmlFile of htmlFiles) {
    updateImageReferencesInFile(htmlFile, images);
  }
  
  console.log('Image reference update complete!');
}

// Function to recursively find all images
function findImages(dir: string): string[] {
  let results: string[] = [];
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Recursively search directories
      results = results.concat(findImages(filePath));
    } else if (/\.(jpe?g|png|gif|svg|webp)$/i.test(file)) {
      // Add image files
      results.push(filePath);
    }
  }
  
  return results;
}

// Function to find all HTML files
function findHtmlFiles(dir: string): string[] {
  let results: string[] = [];
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    
    // Skip node_modules and dist folders
    if (file === 'node_modules' || file === 'dist' || file === '.git') {
      continue;
    }
    
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Recursively search directories
      results = results.concat(findHtmlFiles(filePath));
    } else if (/\.html?$/i.test(file)) {
      // Add HTML files
      results.push(filePath);
    }
  }
  
  return results;
}

// Function to update image references in a specific file
function updateImageReferencesInFile(htmlFile: string, images: string[]): void {
  console.log(`Processing: ${htmlFile}`);
  
  // Read the HTML file
  let html = fs.readFileSync(htmlFile, 'utf8');
  let changesMade = false;
  
  // Create a map of image names to paths for quicker lookup
  const imageMap: Record<string, string> = {};
  for (const image of images) {
    const imageName = path.basename(image);
    imageMap[imageName] = image;
  }
  
  // Regular expression to find image references
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let match;
  
  while ((match = imgRegex.exec(html)) !== null) {
    const fullTag = match[0];
    const src = match[1];
    
    // Skip external URLs
    if (src.startsWith('http') || src.startsWith('//')) {
      continue;
    }
    
    // Get the image filename
    const imageName = path.basename(src);
    
    // Check if the image exists in our map
    if (imageMap[imageName]) {
      const newSrc = path.relative(path.dirname(htmlFile), imageMap[imageName]).replace(/\\/g, '/');
      
      // Only update if the path is different
      if (newSrc !== src) {
        const newTag = fullTag.replace(src, newSrc);
        html = html.replace(fullTag, newTag);
        changesMade = true;
        console.log(`  Updated: ${src} → ${newSrc}`);
      }
    }
  }
  
  // Save the file if changes were made
  if (changesMade) {
    fs.writeFileSync(htmlFile, html);
    console.log(`  Changes saved to ${htmlFile}`);
  } else {
    console.log(`  No changes needed for ${htmlFile}`);
  }
}

// Create a simple mapping of original images to optimized versions
function createImageMap() {
  const imageMap = {};
  const optimizedDirs = ['img'];
  
  // Recursive function to find all optimized images
  function findOptimizedImages(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        findOptimizedImages(filePath);
      } else if (file.includes('-optimized')) {
        // Create an entry in the map for the original filename -> optimized filename
        const originalName = file.replace('-optimized', '');
        const relPath = path.relative(path.join(__dirname, '..'), dir);
        imageMap[path.join(relPath, originalName).replace(/\\/g, '/')] = 
          path.join(relPath, file).replace(/\\/g, '/');
      }
    }
  }
  
  // Start the search
  for (const dir of optimizedDirs) {
    findOptimizedImages(path.join(__dirname, '..', dir));
  }
  
  return imageMap;
}

// Create a custom preload HTML with only the real images (no backups)
function createPreloadHtml(imageMap) {
  let html = '<!-- Preload optimized images for faster loading -->\n';
  
  // Filter out backup images
  const filteredMap = Object.entries(imageMap)
    .filter(([original, optimized]) => !original.includes('.backup'));
  
  // Sort by file size (we get the biggest wins from preloading large images)
  const sortedEntries = filteredMap.sort((a, b) => {
    try {
      const aPath = path.join(__dirname, '..', a[1] as string);
      const bPath = path.join(__dirname, '..', b[1] as string);
      const aSize = fs.statSync(aPath).size;
      const bSize = fs.statSync(bPath).size;
      return bSize - aSize;  // Descending order
    } catch (err) {
      return 0;
    }
  });
  
  // Add preload tags for the top 10 largest images
  for (let i = 0; i < Math.min(10, sortedEntries.length); i++) {
    const [_, optimized] = sortedEntries[i];
    html += `<link rel="preload" href="${optimized}" as="image">\n`;
  }
  
  return html;
}

// Create a function to update the head.html file
function updateHeadHtml(preloadHtml) {
  const headPath = path.join(__dirname, '..', '_includes', 'head.html');
  
  if (!fs.existsSync(headPath)) {
    console.error('head.html not found');
    return false;
  }
  
  let content = fs.readFileSync(headPath, 'utf8');
  
  // Check if the preload section already exists
  if (content.includes('<!-- Preload optimized images for faster loading -->')) {
    // Remove existing preload section
    content = content.replace(
      /<!-- Preload optimized images for faster loading -->[\s\S]*?(?=<link|<meta|<\/head>)/,
      ''
    );
  }
  
  // Add the preload HTML before the end of the head tag
  content = content.replace(
    /<\/head>/,
    `  ${preloadHtml}\n</head>`
  );
  
  // Write the updated content
  fs.writeFileSync(headPath, content);
  return true;
}

// Create JS code to swap image sources on page load
function createImageSwapJs(imageMap) {
  const jsContent = `
// Dynamically swap image sources to optimized versions
document.addEventListener('DOMContentLoaded', function() {
  // Mapping of original image paths to optimized versions
  const imageMap = ${JSON.stringify(imageMap, null, 2)};
  
  // Find all images on the page
  const images = document.querySelectorAll('img');
  
  // Loop through images and replace src attributes if optimized version exists
  images.forEach(img => {
    const src = img.getAttribute('src');
    if (src && imageMap[src]) {
      img.setAttribute('src', imageMap[src]);
      console.log('Swapped image:', src, '->', imageMap[src]);
    }
  });
});
`;

  const jsPath = path.join(__dirname, 'image-swap.js');
  fs.writeFileSync(jsPath, jsContent);
  return jsPath;
}

// Update the JS includes
function updateJsIncludes(jsPath) {
  const jsIncludePath = path.join(__dirname, '..', '_includes', 'js.html');
  
  if (!fs.existsSync(jsIncludePath)) {
    console.error('js.html not found');
    return false;
  }
  
  let content = fs.readFileSync(jsIncludePath, 'utf8');
  const relPath = path.relative(path.join(__dirname, '..'), jsPath).replace(/\\/g, '/');
  
  // Check if the script tag already exists
  if (content.includes(relPath)) {
    console.log('Script tag already exists');
    return true;
  }
  
  // Add the script tag before the end of the file
  content += `\n<!-- Image optimization script -->\n<script src="{{ "/${relPath}" | prepend: site.baseurl }}"></script>\n`;
  
  // Write the updated content
  fs.writeFileSync(jsIncludePath, content);
  return true;
}

// Main function
function main() {
  console.log('Creating image map...');
  const imageMap = createImageMap();
  console.log(`Found ${Object.keys(imageMap).length} optimized images`);
  
  console.log('Creating preload HTML...');
  const preloadHtml = createPreloadHtml(imageMap);
  
  console.log('Updating head.html...');
  if (updateHeadHtml(preloadHtml)) {
    console.log('head.html updated successfully');
  }
  
  console.log('Creating image swap JS...');
  const jsPath = createImageSwapJs(imageMap);
  
  console.log('Updating JS includes...');
  if (updateJsIncludes(jsPath)) {
    console.log('JS includes updated successfully');
  }
  
  console.log('Done!');
}

// Run the main function
main(); 