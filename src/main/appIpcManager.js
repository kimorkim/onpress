import { ipcMain } from 'electron';
import { GlobalCallTypes } from '../sources/Constants';

export default function setIpc(mainWindow, __) {
  const startTime = new Date();

  ipcMain.on('RunningTime', () => {
    console.log(new Date() - startTime);
  });

  ipcMain.on('GlobalCall', (event, { type, data }) => {
    switch (type) {
      case GlobalCallTypes.MODIFY_CONTENT: {
        if (data) {
          mainWindow.setTitle(`${global.shareObject.mainWindowName} (${__('Modify')})`);
        } else {
          mainWindow.setTitle(global.shareObject.mainWindowName);
        }
        break;
      }
      default : {
        break;
      }
    }
  });
}
