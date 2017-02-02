import Less from 'less';

let styleDom;

class StyleManager {
  constructor(styleText) {
    if (styleText) {
      this.createStlyeDom(styleText);
    }
  }

  createStlyeDom(styleText) {
    const head = document.head || document.getElementsByTagName('head')[0];

    styleDom = document.createElement('style');
    styleDom.type = 'text/css';
    head.appendChild(styleDom);

    Less.render(styleText, (e, output) => {
      if (styleDom.styleSheet) {
        styleDom.styleSheet.cssText = output.css;
      } else {
        styleDom.appendChild(document.createTextNode(output.css));
      }
    });

    return this;
  }
}

export default StyleManager;
