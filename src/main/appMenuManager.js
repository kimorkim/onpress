import { app, Menu } from 'electron';

export default function setMenu(__) {
  const template = [{
    label: __('File'),
    submenu: [{
        label: __('New File'),
      }, {
        label: __('Open File...')
      },
      // {
      //   label: __('Open Folder...')
      // }, {
      //   label: __('Open Recent')
      // }, 
      {
        type: 'separator'
      }, {
        label: __('Save')
      }, {
        label: __('Save As...')
      },
      // {
      //   label: __('Save All')
      // }, 
      {
        type: 'separator'
      }, {
        label: __('Exit')
      }
    ]
  }, {
    label: __('Edit'),
    submenu: [{
      label: __('Undo'),
      role: 'undo'
    }, {
      label: __('Redo'),
      role: 'redo'
    }, {
      type: 'separator'
    }, {
      label: __('Cut'),
      role: 'cut'
    }, {
      label: __('Copy'),
      role: 'copy'
    }, {
      label: __('Paste'),
      role: 'paste'
    }, {
      label: __('Delete'),
      role: 'delete'
    }, {
      label: __('Select All'),
      role: 'selectall'
    }]
  }]

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [{
        role: 'about'
      }, {
        type: 'separator'
      }, {
        role: 'services',
        submenu: []
      }, {
        type: 'separator'
      }, {
        role: 'hide'
      }, {
        role: 'hideothers'
      }, {
        role: 'unhide'
      }, {
        type: 'separator'
      }, {
        role: 'quit'
      }]
    })
  }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
};
