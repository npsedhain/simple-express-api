const fs = require("fs");

function read(fileName, callback) {
  if (!fileName) {
    callback("file name is missing");
  }
  fs.readFile(fileName, "utf-8", (err, success) => {
    if (err) {
      callback("err");
    }
    callback(null, success);
  });
}

function write(fileName, content, callback) {
  if (!fileName) {
    callback("file name is missing");
  } else if (!content) {
    callback("file name is missing");
  }
  fs.writeFile(fileName, content, (err, success) => {
    if (err) {
      callback("err");
    }
    callback(null, "success");
  });
}

module.exports = {
  read,
  write
};
