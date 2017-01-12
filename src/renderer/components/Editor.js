import React from 'react';
import _ from 'lodash';
import $ from 'jquery';

class Editor extends React.Component {
	constructor(props) {
		super(props);

		this.handleChangeEvent = this.handleChangeEvent.bind(this);
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
				    // scrollbarStyle: 'null',
    			});
    			this.editor.setSize("100%", "100%");
    			this.editor.on('change', _.debounce(this.handleChangeEvent, 300));
    		}}
    	/>
	   );
  }
}

export default Editor;
