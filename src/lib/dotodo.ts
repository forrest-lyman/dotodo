import fs from 'fs';
import path from 'path';

export class DoToDo {
  static readonly cacheDir = '.dotodo';
  static readonly backupDir = '.dotodo/backups';

  static init() {
    if (!fs.existsSync(DoToDo.cacheDir)) {
      fs.mkdirSync(DoToDo.cacheDir);
    }
    if (!fs.existsSync(DoToDo.backupDir)) {
      fs.mkdirSync(DoToDo.backupDir);
    }
  }

  static update(filepath: string, content: string) {
    DoToDo.backup(filepath);
    fs.writeFileSync(filepath, content);
  }

  static backup(filepath: string) {
    const timestamp = Date.now();
    const backupPath = path.join(DoToDo.backupDir, `${filepath}.${timestamp}.bak`);

    // recursively create the backup path
    fs.mkdirSync(path.dirname(backupPath), { recursive: true });

    // Save existing file to backup
    fs.copyFileSync(filepath, backupPath);
  }

  static restore(filepath: string) {
    // Find the most recent backup file and restore it
    const backupFiles = fs.readdirSync(DoToDo.backupDir)
      .filter(file => file.startsWith(filepath))
      .sort((a, b) => parseInt(b.split('.').slice(-2, -1)[0]) - parseInt(a.split('.').slice(-2, -1)[0]));

    if (backupFiles.length > 0) {
      const mostRecentBackup = path.join(DoToDo.backupDir, backupFiles[0]);
      fs.copyFileSync(mostRecentBackup, filepath);
    } else {
      throw new Error('No backup found to restore.');
    }
  }

  static reset() {
    // Clear all files in the cache and backup directories, then reinitialize the class - DoToDo: 2023-11-02T12:00:00Z
    const clearDirectory = (directory: string) => {
      if (fs.existsSync(directory)) {
        fs.readdirSync(directory).forEach(file => {
          const filePath = path.join(directory, file);
          if (fs.lstatSync(filePath).isDirectory()) {
            fs.rmdirSync(filePath, { recursive: true });
          } else {
            fs.unlinkSync(filePath);
          }
        });
      }
    };

    clearDirectory(DoToDo.cacheDir);
    clearDirectory(DoToDo.backupDir);
    DoToDo.init();
  }
}
