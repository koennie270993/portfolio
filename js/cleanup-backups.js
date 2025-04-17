const fs = require('fs');
const path = require('path');

// Function to recursively find and delete backup files
function deleteBackupFiles(dir) {
  let deleted = 0;
  
  // Get all files in directory
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Recursively search directories
      deleted += deleteBackupFiles(filePath);
    } else if (file.includes('.backup')) {
      // Delete backup files
      console.log(`Deleting: ${filePath}`);
      fs.unlinkSync(filePath);
      deleted++;
    }
  }
  
  return deleted;
}

// Main function
function main() {
  console.log('Starting backup file cleanup...');
  
  // Clean up img directory
  const imgDir = path.join(__dirname, '..', 'img');
  if (fs.existsSync(imgDir)) {
    const deletedCount = deleteBackupFiles(imgDir);
    console.log(`Deleted ${deletedCount} backup files`);
  } else {
    console.error(`Directory not found: ${imgDir}`);
  }
  
  console.log('Cleanup complete!');
}

// Run the main function
main(); 