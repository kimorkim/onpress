import { app, Menu, dialog } from 'electron';
import { GlobalCallTypes } from '../sources/Constants';

export default function setMenu(webContents, __) {
  const template = [{
    label: __('File'),
    submenu: [{
      label: __('New File'),
      accelerator: 'CmdOrCtrl+N',
      click: () => {
        webContents.send('GlobalCall', {
          type: GlobalCallTypes.NEW_FILE,
          data: '',
        });
      },
    }, {
      label: __('Open File...'),
      accelerator: 'CmdOrCtrl+O',
      click: () => {
        dialog.showOpenDialog({
          properties: ['openFile'],
          filters: [
            { name: 'Markdown', extensions: ['md', 'mdown', 'markdown', 'markdn'] },
            { name: 'All Files', extensions: ['*'] },
          ],
        }, (filenames) => {
          if (Array.isArray(filenames)) {
            webContents.send('GlobalCall', {
              type: GlobalCallTypes.OPEN_FILE,
              data: filenames[0],
            });
          }
        });
      },
    },
    // {
    //   label: __('Open Folder...')
    // }, {
    //   label: __('Open Recent')
    // },
    {
      type: 'separator',
    }, {
      label: __('Save'),
      accelerator: 'CmdOrCtrl+S',
      click: () => {
        if (global.shareObject.nowFilePath) {
          webContents.send('GlobalCall', {
            type: GlobalCallTypes.SAVE_FILE,
            data: global.shareObject.nowFilePath,
          });
        } else {
          dialog.showSaveDialog({
            filters: [
              { name: 'Markdown', extensions: ['md'] },
              { name: 'All Files', extensions: ['*'] },
            ],
          }, (filename) => {
            if (filename) {
              webContents.send('GlobalCall', {
                type: GlobalCallTypes.SAVE_FILE,
                data: filename,
              });
            }
          });
        }
      },
    }, {
      label: __('Save As...'),
      accelerator: 'CmdOrCtrl+Shift+S',
      click: () => {
        dialog.showSaveDialog({
          defaultPath: global.shareObject.nowFileName,
          filters: [
            { name: 'Markdown', extensions: ['md'] },
            { name: 'All Files', extensions: ['*'] },
          ],
        }, (filename) => {
          if (filename) {
            webContents.send('GlobalCall', {
              type: GlobalCallTypes.SAVE_FILE,
              data: filename,
            });
          }
        });
      },
    },
    // {
    //   label: __('Save All')
    // },
    {
      type: 'separator',
    }, {
      label: __('Exit'),
      role: 'quit',
    }],
  }, {
    label: __('Edit'),
    submenu: [{
      label: __('Undo'),
      accelerator: 'CmdOrCtrl+Z',
      click: () => {
        webContents.send('GlobalCall', {
          type: GlobalCallTypes.UNDO,
          data: 'undo',
        });
      },
    }, {
      label: __('Redo'),
      accelerator: 'CmdOrCtrl+Shift+Z',
      click: () => {
        webContents.send('GlobalCall', {
          type: GlobalCallTypes.REDO,
          data: 'paste',
        });
      },
    }, {
      type: 'separator',
    }, {
      label: __('Cut'),
      role: 'cut',
    }, {
      label: __('Copy'),
      role: 'copy',
    }, {
      label: __('Paste'),
      role: 'paste',
    }, {
      label: __('Delete'),
      role: 'delete',
    }, {
      label: __('Select All'),
      accelerator: 'CmdOrCtrl+A',
      click: () => {
        webContents.send('GlobalCall', {
          type: GlobalCallTypes.SELECT_ALL,
          data: 'selectAll',
        });
      },
    }],
  }];

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [{
        role: 'about',
      }, {
        type: 'separator',
      }, {
        role: 'services',
        submenu: [],
      }, {
        type: 'separator',
      }, {
        role: 'hide',
      }, {
        role: 'hideothers',
      }, {
        role: 'unhide',
      }, {
        type: 'separator',
      }, {
        role: 'quit',
      }],
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
