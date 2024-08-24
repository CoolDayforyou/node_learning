const fs = require("fs");
const path = require("path");

const folderName = "./some/nested/folder/test";
const folderPath = "./some/nested/folder";

const isFolderExists = (folder_name) => {
  try {
    if (!fs.existsSync(folder_name)) {
      return fs.mkdirSync(folder_name);
    } else {
      return "Folder already exists";
    }
  } catch (error) {
    console.log(error);
  }
};

isFolderExists(folderName);

// console.log(fs.readdirSync(folderPath));

const folderFullPath = (folder_path) => {
  try {
    return fs.readdirSync(folder_path).map((filename) => {
      return path.join(folder_path, filename);
    });
  } catch (error) {
    console.log(error);
  }
};

// console.log(folderFullPath(folderPath));

const isFile = (fileName) => {
  return fs.lstatSync(fileName).isFile();
};

// console.log(folderFullPath(folderPath).filter(isFile));

const folderRename = (oldPath, newPath) => {
  try {
    return fs.renameSync(oldPath, newPath);
  } catch (error) {
    console.log(error);
  }
};

const folderRemove = () => {
  try {
    fs.rmdirSync(folderName);
  } catch (error) {
    console.log(error);
  }
};

// folderRemove();
