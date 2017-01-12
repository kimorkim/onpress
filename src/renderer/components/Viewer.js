import React from 'react';
import MarkdownIt from 'markdown-it';

class Viewer extends React.Component {
	constructor(props) {
		super(props);
		this.md = new MarkdownIt();
	}

	createMarkdownContent() {
	  return {__html: this.md.render(this.props.content)};
	}

  render() {
    return (
    	<div
    		className='viewer'
    		dangerouslySetInnerHTML={this.createMarkdownContent()}
  		/>
	   );
  }
}

export default Viewer
