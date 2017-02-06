import { app } from 'electron';
import path from 'path';
import childProcess from 'child_process';

export function createShortcut(locations, done) {
  const updateExe = path.resolve(path.dirname(process.execPath), '..', 'Update.exe');
  const target = path.basename(process.execPath);
  const args = ['--createShortcut', target, '-l', locations];
  const child = childProcess.spawn(updateExe, args, { detached: true });
  child.on('close', () => {
    if (done) {
      done();
    }
  });
}

export function removeShortcut(locations, done) {
  const updateExe = path.resolve(path.dirname(process.execPath), '..', 'Update.exe');
  const target = path.basename(process.execPath);
  const args = ['--removeShortcut', target, '-l', locations];
  const child = childProcess.spawn(updateExe, args, { detached: true });
  child.on('close', () => {
    // const desktopEng = path.resolve(process.env.USERPROFILE, 'Desktop', 'Entry_HW.lnk');
    // const startMenuEng = path.resolve(process.env.APPDATA,
    // 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'EntryLabs', 'Entry_HW.lnk');
    // deleteRecursiveSync(desktopEng);
    // deleteRecursiveSync(startMenuEng);
    if (done) {
      done();
    }
  });
}

export function handleStartupEvent() {
  if (process.platform !== 'win32') {
    return false;
  }

  const defaultLocations = 'Desktop,StartMenu';
  const squirrelCommand = process.argv[1];
  switch (squirrelCommand) {
    case '--squirrel-install':
    case '--squirrel-updated':
      createShortcut(defaultLocations, app.quit);
      return true;
    case '--squirrel-uninstall':
      removeShortcut(defaultLocations, app.quit);
      return true;
    case '--squirrel-obsolete':
      app.quit();
      return true;
    default:
      return false;
  }
}
