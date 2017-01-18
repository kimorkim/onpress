import React from 'react';

class Viewer extends React.Component {
	constructor(props) {
		super(props);
		
    this.option = {
      nodeintegration: 'nodeintegration'
    }
	}

  componentWillReceiveProps(nextPros) {
    this.refs.webview.send('render', nextPros.content);
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    this.refs.webview.setAttribute('nodeintegration', 'nodeintegration');
    window.w = this.refs.webview;
    this.refs.webview.addEventListener('did-start-loading', function () {
      console.log('로딩 시작');
    })
    this.refs.webview.addEventListener('did-stop-loading', function () {
      console.log('로딩 끝');
    })
    this.refs.webview.addEventListener('did-fail-loading', function () {
      console.log('오류 발생 ', arguments);
    })

    this.refs.webview.addEventListener('dom-ready', () => {
      this.refs.webview.openDevTools()
    })
  }

  render() {
    return (
      <webview 
        className='onPressViewer2'
        ref='webview'
        src='view.html'
      >
      </webview>
     );
  }

  // render() {
  //   return (
  //   	<div
  //   		className='onPressViewer'
  //   		dangerouslySetInnerHTML={this.createMarkdownContent()}
  // 		/>
	 //   );
  // }
}

export default Viewer
