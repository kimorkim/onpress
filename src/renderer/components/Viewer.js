import React from 'react';
import MarkdownIt from 'markdown-it';
import Emoji from 'markdown-it-emoji';

class Viewer extends React.Component {
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

  render() {
    return (
    	<div
    		className='onPressViewer'
    		dangerouslySetInnerHTML={this.createMarkdownContent()}
  		/>
	   );
  }
}

export default Viewer
