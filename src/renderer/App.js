import React from 'react';
import SplitPane from 'react-split-pane';
import Editor from './components/Editor';
import WebviewWrapper from './components/WebviewWrapper';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleEditorChange = this.handleEditorChange.bind(this);

    this.state = {
      content: '',
      id: -1,
    };

    // this.styleManager = new StyleManager(`.onPressViewer {${localStorage.getItem('test')}}`);
  }

  handleEditorChange(content, id) {
    this.setState({
      content,
      id,
    });
  }

  render() {
    return (
      <SplitPane
        direction='vertical'
        defaultSize='50%'
      >
        <Editor
          onChange={this.handleEditorChange}
        />
        <WebviewWrapper
          content={this.state.content}
          id={this.state.id}
        />
      </SplitPane>
    );
  }
}
