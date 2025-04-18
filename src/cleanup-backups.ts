import * as fs from 'fs';
import * as path from 'path';

// Function to recursively find and delete backup files
export function deleteBackupFiles(dir: string): number {
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
export function runBackupCleanup(): void {
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

// Export functions but don't run automatically
// This allows index.ts to import and run when needed 