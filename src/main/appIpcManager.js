import { ipcMain, BrowserWindow } from 'electron';
import { GlobalCallTypes } from '../sources/Constants';

export default function setIpc(mainWindow, __) {
  const startTime = new Date();

  ipcMain.on('RunningTime', () => {
    console.log(new Date() - startTime);
  });

  ipcMain.on('GlobalCall', (event, { type, data }) => {
    switch (type) {
      case GlobalCallTypes.MODIFY_CONTENT: {
        const targetWindow = BrowserWindow.fromId(data.windowId);
        if (data.isModify) {
          targetWindow.setTitle(`${global.shareObject.mainWindowName} (${__('Modify')})`);
        } else {
          targetWindow.setTitle(global.shareObject.mainWindowName);
        }
        break;
      }
      default : {
        break;
      }
    }
  });
}
