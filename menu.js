{
	// Load native UI library
	var gui = require('nw.gui');
	var fdialogs = require('node-webkit-fdialogs');
	var Dialog;
	// Create menu
	var menu = new gui.Menu({
		type : 'menubar'
	});

	// this should indicate you're on Mac OSX
	if (process.platform === 'darwin') {
		// create MacBuiltin
		menu.createMacBuiltin('Sample App', {
			hideEdit : true,
			hideWindow : true
		});
	} else {
		Dialog = new fdialogs.FDialog({
		    type: 'open',
		    accept: ['.md','.txt','text/plain'],
		    path: stor.getLocalData('openFilePath', '~/Documents')
		});
	}

	// Create file-menu
	var fileMenu = new gui.Menu();

	fileMenu.append(new gui.MenuItem({
		label : '새 문서'
	}));
	fileMenu.append(new gui.MenuItem({
		label : '열기'
	}));
	fileMenu.append(new gui.MenuItem({
		type : 'separator'
	}));
	fileMenu.append(new gui.MenuItem({
		label : '저장'
	}));
	fileMenu.append(new gui.MenuItem({
		label : '새 이름으로 저장'
	}));
	fileMenu.append(new gui.MenuItem({
		type : 'separator'
	}));
	fileMenu.append(new gui.MenuItem({
		label : '종료'
	}));

	// Create edit-menu
	var editMenu = new gui.Menu();
	editMenu.append(new gui.MenuItem({
		label : '실행취소'
	}));
	editMenu.append(new gui.MenuItem({
		label : '다시실행'
	}));

	// Create css-menu
	var cssMenu = new gui.Menu();
	cssMenu.append(new gui.MenuItem({
		label : 'CSS Load'
	}));

	// Create edit-menu
	var helpMenu = new gui.Menu();
	helpMenu.append(new gui.MenuItem({
		label : '...'
	}));

	fileMenu.items[0].click = function() {
		var text = $('.mdEditor').val();
		if (text.length > 0) {
			if (confirm('작성하신 내용을 저장 하시겠습니까?')) {

			}
		}

		$('.mdEditor').val('');
		$('.liveView').html('');
	}

	fileMenu.items[1].click = function() {
		Dialog.readFile(function (err, content, path) {
			console.log(path);
			var arrPath = path.split("\\");
			arrPath.pop();
			var folderPath = arrPath.join("\\");
			stor.setLocalData("openFilePath", folderPath);
			$('.mdEditor').val(content.toString('utf8'));
			if($('.mdEditor').val().length > 0) {
				$('.mdEditor').trigger('keyup');
			}
		});
	}

	fileMenu.items[6].click = function() {
		gui.App.quit();
	}

	// Append MenuItem as a Submenu
	menu.append(new gui.MenuItem({
		label : '파일',
		submenu : fileMenu
	// menu elements from fileMenu object
	}));

	menu.append(new gui.MenuItem({
		label : '편집',
		submenu : editMenu
	// menu elements from fileMenu object
	}));

	menu.append(new gui.MenuItem({
		label : 'CSS',
		submenu : cssMenu
	// menu elements from fileMenu object
	}));

	menu.append(new gui.MenuItem({
		label : '도움말',
		submenu : helpMenu
	// menu elements from fileMenu object
	}));

	// Append Menu to Window
	gui.Window.get().menu = menu;
}
