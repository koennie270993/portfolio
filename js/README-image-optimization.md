# Image Optimization

This directory contains scripts for optimizing images to improve the website's loading speed. 

## Scripts

1. **`image-optimizer.js`** - Compresses images and creates optimized versions
2. **`image-update.js`** - Updates HTML to reference optimized images and adds preloading
3. **`image-swap.js`** - Client-side script that swaps image sources to optimized versions
4. **`cleanup-backups.js`** - Removes backup image files to save disk space

## Optimization Strategy

The optimization approach consists of several steps:

1. **Image Compression:** 
   - PNG files are compressed with quality level 80 and compression level 9
   - JPG files are compressed with quality level 80 using mozjpeg optimization
   - GIF files over 1000px wide are resized to 1000px width

2. **Preloading:**
   - The 10 largest optimized images are preloaded in the HTML head
   - This helps the browser start downloading important images early

3. **Dynamic Image Swapping:**
   - A JavaScript file runs on page load to replace image sources with optimized versions
   - This approach ensures compatibility even if preloading isn't supported

## Results

The optimization has significantly reduced image file sizes:

- Most PNG files were reduced by 60-75%
- Most JPG files were reduced by 90-95% 
- The overall page load time should be much faster, especially on slower connections

## How to Run

If you need to optimize new images:

1. Add the new images to the appropriate folders in `/img`
2. Run `node js/image-optimizer.js` to create optimized versions
3. Run `node js/image-update.js` to update the image mapping and preloading
4. Run `node js/cleanup-backups.js` if you want to clean up backup files

## Best Practices for New Images

When adding new images to the site:

1. Prefer WebP format when possible (supported by all modern browsers)
2. Resize images to the display size before uploading
3. Run images through the optimization process
4. Consider lazy loading for below-the-fold images
5. Always include appropriate alt attributes for accessibility 