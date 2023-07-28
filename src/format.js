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

export default function format(editor) {
  const process = new Process(
    nova.path.join(nova.workspace.path, "vendor/bin/pint"),
    {
      args: ["--preset", "laravel", editor.document.path],
    }
  );

  process.start();
}
