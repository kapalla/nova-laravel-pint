'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var main = {};

const ignoredEditors = new Set();

async function format(editor) {
  if (ignoredEditors.has(editor)) {
    return;
  }

  const process = new Process(
    nova.path.join(nova.workspace.path, "vendor/bin/pint"),
    {
      args: ["--preset", "laravel", editor.document.path],
    }
  );

  process.start();
  process.onDidExit(() => {
    const file = nova.fs.open(editor.document.path);
    editor.edit((textEdit) => {
      textEdit.delete(new Range(0, editor.document.length));
      textEdit.insert(0, file.read());
    }).then(() => {
      ignoredEditors.add(editor);
      editor.save().finally(() => ignoredEditors.delete(editor));
    });
  });
}

function saveWithoutFormatting(editor) {
  ignoredEditors.add(editor);
  editor.save().finally(() => ignoredEditors.delete(editor));
}

var activate = main.activate = function () {
  nova.workspace.activeTextEditor.onDidSave(format);
};

nova.commands.register("kapalla.pint.save-without-formatting", (editor) => {
  saveWithoutFormatting(editor);
});

exports.activate = activate;
exports.default = main;
