import React from 'react';
import SplitPane from 'react-split-pane';
import Editor from './components/Editor';
import Viewer from './components/Viewer';
import StyleManager from './sources/StyleManager';

export default class App extends React.Component {
	constructor(props) {
		super(props);

		this.handleEditorChange = this.handleEditorChange.bind(this);

		this.state = {
			content: '',
		}

    // this.styleManager = new StyleManager(`.onPressViewer {${localStorage.getItem('test')}}`);
	}

	handleEditorChange(content) {
		this.setState({
			content
		});
	}

  render() {
    return (
    	<SplitPane
    		direction='vertical'
        defaultSize='50%'
    	>
      	<Editor 
      		onChange={ this.handleEditorChange }
      	/>
      	<Viewer
      		content={ this.state.content } />
	    </SplitPane>
	   );
  }
}
