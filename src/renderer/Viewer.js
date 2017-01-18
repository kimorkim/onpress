import React from 'react';
import MarkdownIt from 'markdown-it';
import Emoji from 'markdown-it-emoji';
import StyleManager from './sources/StyleManager';

export default class Viewer extends React.Component {
  constructor(props) {
    super(props);

    this.md = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
    });
    this.md.use(Emoji);
  }

  createMarkdownContent() {
    return {__html: this.md.render(this.props.content)};
  }

  componentWillUpdate() {
    
    console.log('componentWillUpdate');
  }
  componentDidUpdate() {
    console.log('componentDidUpdate');
  }
  componentDidMount() {
    console.log('componentDidMount');
  }

  render() {
    return (
      <div
        ref='c'
        className='onPressViewer'
        dangerouslySetInnerHTML={this.createMarkdownContent()}
      />
    );
  }
}
