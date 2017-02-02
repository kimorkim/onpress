import { app, Menu, ipcMain, dialog } from 'electron';
import { GlobalCallTypes, FileStatus } from '../sources/Constants';
import Utils from '../sources/Utils';

export default function setIpc(mainWindow, __) {
  ipcMain.on('GlobalCall', (event, {type, data})=> {
    switch(type) {
      case GlobalCallTypes.MODIFY_CONTENT:
        if(data) {
          mainWindow.setTitle(`${global.shareObject.mainWindowName} (${__('Modify')})`);
        } else {
          mainWindow.setTitle(global.shareObject.mainWindowName);
        }
      break;
    }
  });
};
