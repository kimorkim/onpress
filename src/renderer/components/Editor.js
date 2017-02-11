import React from 'react';
import _ from 'lodash';
import { ipcRenderer } from 'electron';
import BaseComponent, { GlobalCallTypes } from './BaseComponent';

class Editor extends BaseComponent {
  constructor(props) {
    super(props);

    this.handleChangeEvent = this.handleChangeEvent.bind(this);
    this.state = {
      theme: 'one-dark',
      fontSize: 14,
    };

    this.id = 0;
    this.nowUndoStack = 0;
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.fontSize !== nextState.fontSize) {
      this.setCodeMirrorStyle({
        fontSize: `${nextState.fontSize}px`,
      });
    }
  }

  componentDidMount() {
    this.editor = CodeMirror(this.editorWrapper, {
      historyEventDelay: 300,
      styleActiveLine: true,
      styleSelectiveLine: true,
      lineNumbers: true,
      lineWrapping: true,
      mode: 'markdown',
      theme: this.state.theme,
    });
    this.editor.setSize('100%', '100%');
    this.editor.setOption("styleActiveLine", {nonEmpty: true});
    this.editor.setOption("styleSelectiveLine", {nonEmpty: true});
    this.editor.on('change', _.debounce(this.handleChangeEvent, 300));
    this.setCodeMirrorStyle({
      fontSize: `${this.state.fontSize}px`,
    });

    ipcRenderer.on('GlobalCall', (event, { type, data }) => {
      switch (type) {
        case GlobalCallTypes.NEW_FILE: {
          this.setMarkdownData(data);
          this.nowFilePath = '';
          this.nowUndoStack = 0;
          break;
        }
        case GlobalCallTypes.OPEN_FILE: {
          this.nowFilePath = data;
          this.Utils.readFile(data)
            .then((readData) => {
              this.nowUndoStack = 0;
              this.setMarkdownData(readData);
            })
            .catch((err) => {
              console.log(err);
            });
          break;
        }
        case GlobalCallTypes.SAVE_FILE: {
          const textData = this.getMarkdownData();
          this.Utils.writeFile(data, textData)
            .then(() => {
              this.nowFilePath = data;
              this.nowUndoStack = this.editor.historySize().undo;
              ipcRenderer.send('GlobalCall', {
                type: GlobalCallTypes.MODIFY_CONTENT,
                data: false,
              });
            })
            .catch((err) => {
              console.log(err);
            });
          break;
        }
        case GlobalCallTypes.UNDO:
        case GlobalCallTypes.REDO:
        case GlobalCallTypes.SELECT_ALL: {
          this.editor.focus();
          this.editor.execCommand(data);
          break;
        }
        case GlobalCallTypes.CUT:
        case GlobalCallTypes.COPY:
        case GlobalCallTypes.PASTE:
        case GlobalCallTypes.DELETE: {
          this.editor.focus();
          document.execCommand(data);
          break;
        }
        default : {
          break;
        }
      }
    });
  }

  setMarkdownData(data) {
    this.editor.setValue(data);
    this.editor.clearHistory();
  }

  getMarkdownData() {
    return this.editor.getValue();
  }

  isModifyContent() {
    return this.editor.historySize().undo !== this.nowUndoStack;
  }

  handleChangeEvent(cm) {
    ipcRenderer.send('GlobalCall', {
      type: GlobalCallTypes.MODIFY_CONTENT,
      data: this.isModifyContent(),
    });
    this.props.onChange(cm.getValue(), this.id += 1);
  }

  setCodeMirrorStyle(style) {
    Object.assign(this.editor.display.wrapper.style, style);
    this.editor.refresh();
  }

  render() {
    return (
      <div
        className='editorArea'
        ref={(dom) => {
          this.editorWrapper = dom;
        }}
      />
    );
  }
}

export default Editor;
