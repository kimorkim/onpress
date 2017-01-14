import React from 'react';
import _ from 'lodash';

class Editor extends React.Component {
	constructor(props) {
		super(props);

		this.handleChangeEvent = this.handleChangeEvent.bind(this);
		this.state = {
			theme: 'twilight',
      fontSize: 16,
		}
	}

  componentWillUpdate(nextProps, nextState) {
    if(this.state.fontSize !== nextState.fontSize) {
      this.setCodeMirrorStyle({
        fontSize: `${nextState.fontSize}px`,
      });
    }
  }

  componentDidMount() {
    this.editor = CodeMirror(this.editorWrapper, {
      lineNumbers: true,
      lineWrapping: true,
      mode: 'markdown',
      theme: this.state.theme,
    });
    this.editor.setSize("100%", "100%");
    this.editor.on('change', _.debounce(this.handleChangeEvent, 200));
    this.setCodeMirrorStyle({
      fontSize: `${this.state.fontSize}px`,
    });
  }

	handleChangeEvent(cm) {
		this.props.onChange(cm.getValue());
	}

  setCodeMirrorStyle(style) {
    Object.assign(this.editor.display.wrapper.style, style);
    this.editor.refresh();
  }

  render() {
    return (
    	<div
    		className='editorArea'
    		ref={ dom => {
          this.editorWrapper = dom 
        }}
    	/>
	   );
  }
}

export default Editor;
