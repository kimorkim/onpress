import React from 'react';
import _ from 'lodash';
import $ from 'jquery';

class Editor extends React.Component {
	constructor(props) {
		super(props);

		this.handleChangeEvent = this.handleChangeEvent.bind(this);
		this.state = {
			// theme: 'monokai',
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		console.log(this.props, nextProps);
		console.log(this.state, nextState);
		return false;
	}

	handleChangeEvent(cm) {
		this.props.onChange(cm.getValue());
	}

  render() {
    return (
    	<div
    		className='editorArea'
    		ref={dom=>{
    			this.editor = CodeMirror(dom, {
    				lineNumbers: true,
				    lineWrapping: true,
				    mode: 'markdown',
				    theme: 'twilight',
				    // scrollbarStyle: 'null',
    			});
    			this.editor.setSize("100%", "100%");
    			this.editor.on('change', _.debounce(this.handleChangeEvent, 200));
    		}}
    	/>
	   );
  }
}

export default Editor;
