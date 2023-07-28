'use strict';

// import { accessSync, constants } from "fs";
//
// function getExecutable() {}
//
// function checkLocalExecutableIsPresent() {}
//
// function checkGlobalExecutableIsPresent() {}
//
// function canExecuteFile(file) {
//   try {
//     accessSync(file, constants.X_OK);
//
//     return true;
//   } catch (e) {
//     return false;
//   }
// }

function format(editor) {
  const process = new Process(
    nova.path.join(nova.workspace.path, "vendor/bin/pint"),
    {
      args: ["--preset", "laravel", editor.document.path],
    }
  );

  process.start();
}

exports.activate = function () {
  nova.workspace.activeTextEditor.onDidSave((editor) => {
    format(editor);
  });
};

nova.commands.register("kapalla.pint.format", (editor) => {
  format(editor);
});
