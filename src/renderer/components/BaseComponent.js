import React from 'react';
import { remote } from 'electron';
import path from 'path';
import Utils from '../../sources/Utils';

class BaseComponent extends React.Component {
  constructor(props) {
    super(props);
    this.sb = remote.getGlobal('shareObject');
  }

  get nowFilePath() {
    return this.sb.nowFilePath;
  }

  set nowFilePath(filepath) {
    const fileInfo = path.parse(filepath);
    this.sb.nowFileName = fileInfo.base;
    this.sb.mainWindowName = fileInfo.base || this.sb.defaultMainWindowName;
    this.sb.nowFilePath = filepath;
  }

  get Utils() {
    return Utils;
  }

  render() {
    return (
      <div>
        BaseComponent
      </div>
    )
  }
}

export { GlobalCallTypes } from '../../sources/Constants';
export default BaseComponent;