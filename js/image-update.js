const fs = require('fs');
const path = require('path');

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
      const aPath = path.join(__dirname, '..', a[1]);
      const bPath = path.join(__dirname, '..', b[1]);
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