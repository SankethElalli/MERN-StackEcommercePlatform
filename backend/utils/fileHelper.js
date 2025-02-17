import fs from 'fs';
import path from 'path';

export const deleteFile = (filePath) => {
  // Remove the leading slash and 'uploads' from the path
  const relativePath = filePath.replace(/^\/uploads\//, '');
  const absolutePath = path.join(process.cwd(), 'uploads', relativePath);
  
  if (fs.existsSync(absolutePath)) {
    fs.unlink(absolutePath, (err) => {
      if (err) console.error('Error deleting file:', err);
    });
  }
};
