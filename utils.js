const fs = require("fs");
const path = require("path");

export async function checkFileExist(path) {
  try {
    await fs.promises.access(path, fs.constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
}

export async function getAllFilesInFolder(folderPath) {
  try {
    const files = await fs.promises.readdir(folderPath);
    const filePaths = files.map((file) => path.join(folderPath, file));
    const stats = await Promise.all(
      filePaths.map((filePath) => fs.promises.stat(filePath))
    );
    const filesData = stats.map((stat, i) => ({
      path: filePaths[i],
      agent_name: files[i],
      isFile: stat.isFile(),
      isDirectory: stat.isDirectory(),
      size: stat.size,
      createdAt: stat.birthtime,
      modifiedAt: stat.mtime,
    }));
    return filesData;
  } catch (error) {
    console.error(error);
  }
}
