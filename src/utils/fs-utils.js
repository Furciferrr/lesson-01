const fs = require("fs");

exports.readFile = (path) => {
  return new Promise((resolve, rej) => {
    fs.readFile(path, (err, buf) => {
      if (err) {
        rej(err);
      } else {
        resolve(JSON.parse(buf.toString()));
      }
    });
  });
};

exports.writeJSONToFile = (path, data) => {
  return new Promise((resolve, rej) => {
    fs.writeFile(path, JSON.stringify(data), (err, buf) => {
      if (err) {
        console.log("write file error:", err)
        rej(err);
      } else {
        console.log("write file okay")
        resolve();
      }
    });
  });
};
