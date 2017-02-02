import fs from 'fs';

class Utils {
  static readFile(file) {
    return new Promise((resolve, reject) => {
      fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  }

  static writeFile(file, data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(file, data, 'utf8', (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }
}

export default Utils;
