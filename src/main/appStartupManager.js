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

  const ChildProcess = require('child_process');
  const path = require('path');

  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);

  const spawn = function(command, args) {
    let spawnedProcess, error;

    try {
      spawnedProcess = ChildProcess.spawn(command, args, {detached: true});
    } catch (error) {}

    return spawnedProcess;
  };

  const spawnUpdate = function(args) {
    return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      // Optionally do things such as:
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //   explorer context menus

      // Install desktop and start menu shortcuts
      spawnUpdate(['--createShortcut', exeName]);

      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-uninstall':
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      // Remove desktop and start menu shortcuts
      spawnUpdate(['--removeShortcut', exeName]);

      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-obsolete':
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated

      app.quit();
      return true;
  }
}
