import React from 'react';
import BaseComponent from './BaseComponent';

class WebViewWrapper extends BaseComponent {
  constructor(props) {
    super(props);

    this.option = {
      nodeintegration: 'nodeintegration',
    };

    this.state = {
      isLoaderActive: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.content !== nextProps.content) {
      this.webview.send('render', nextProps.content);
      this.setState({
        isLoaderActive: true,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.isLoaderActive !== nextState.isLoaderActive) {
      return true;
    }
    return false;
  }

  componentDidMount() {
    this.webview.setAttribute('nodeintegration', 'nodeintegration');
    this.webview.addEventListener('ipc-message', ({ channel }) => {
      if (channel === 'renderEnd') {
        this.setState({
          isLoaderActive: false,
        });
      }
    });
    this.webview.addEventListener('dom-ready', () => {
      // this.webview.openDevTools();
    });
  }

  render() {
    console.log(this.state.isLoaderActive);
    return (
      <div
        className='webviewWrapper'
      >
        { this.state.isLoaderActive && (
          <div
            className='loadingWrapper'
          >
            <div 
              className='sk-folding-cube'
            >
              <div 
                className='sk-cube1 sk-cube' 
              />
              <div 
                className='sk-cube2 sk-cube' 
              />
              <div 
                className='sk-cube4 sk-cube' 
              />
              <div 
                className='sk-cube3 sk-cube' 
              />
            </div>
          </div>
        )}
        <webview
          className='webviewWrapper-webview'
          ref={(webview) => {
            this.webview = webview;
          }}
          src='view.html'
        />
      </div>
    );
  }
}

export default WebViewWrapper;
