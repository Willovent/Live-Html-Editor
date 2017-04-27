const { remote, ipcRenderer } = require('electron');
const fs = require('fs');

bindEvent = () => {
  restoreLastCode();
  setInterval(() => {
    let code = editbox.editor.getValue();
    if (code == localStorage['code']) return;
    localStorage['code'] = code;
    updateView(code);
    document.title = `${getFileNameFromPath(localStorage['fileName']) || "New file"} *`;
  }, 500);
};

updateView = (code) => {
  var preview = window.dynamicframe.document;
  preview.open();
  preview.write(code);
  preview.close();
};

restoreLastCode = () => {
  var restored = localStorage['code'] || "";
  document.title = getFileNameFromPath(localStorage['fileName']) || "New file *";
  updateView(restored);
  editbox.editor.setValue(restored);
}

loadFile = (fileName) => {
  fileName = unescape(fileName);
  fs.readFile(fileName, "utf-8", function read(err, data) {
    if(err) return;
    updateView(data);
    editbox.editor.setValue(data);
    localStorage['fileName'] = fileName;
    document.title = getFileNameFromPath(fileName);
  });
}

saveFile = (fileName) => {
  fileName = fileName ? unescape(fileName) : localStorage['fileName'];
  if (!fileName) {
    ipcRenderer.send('save-dialog');
  } else {
    localStorage['fileName'] = fileName;
    fs.writeFile(fileName, editbox.editor.getValue());
    document.title = `${getFileNameFromPath(localStorage['fileName'])}`;
  }
}

newFile = () => {
  localStorage.removeItem("fileName");
  editbox.editor.setValue('');
  updateView('');
}

getFileNameFromPath = (path) => {
  if (!path) return;
  var folders = path.split(`\\`);
  return folders[folders.length - 1];
}
