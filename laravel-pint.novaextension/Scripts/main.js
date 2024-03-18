'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var main = {};

let enabled = nova.workspace.config.get("laravel-pint.enable");
let formatOnSave = resolveFormatOnSaveConfig();
let configPath = resolveConfigPath();

const ignoredEditors = new Set();

async function format(editor) {
  const pintPath = nova.path.join(nova.workspace.path, "vendor/bin/pint");

  if (
    !nova.fs.access(pintPath, nova.fs.X_OK) ||
    !enabled ||
    !formatOnSave ||
    ignoredEditors.has(editor)
  ) {
    return;
  }

  const tmpPath = nova.path.join(nova.fs.tempdir, nova.crypto.randomUUID());
  let tmpFile = nova.fs.open(tmpPath, "xw");
  const position = editor.selectedRange.end ?? 0;

  tmpFile.write(editor.getTextInRange(new Range(0, editor.document.length)));
  tmpFile.close();

  const configPathArgs = configPath ? ["--config", configPath] : [];
  const process = new Process(
    nova.path.join(nova.workspace.path, "vendor/bin/pint"),
    {
      args: [...configPathArgs, tmpPath],
    }
  );

  process.onDidExit((code) => {
    tmpFile = nova.fs.open(tmpPath, "r");

    const formattedContent = tmpFile.read();

    editor
      .edit((textEdit) => {
        textEdit.delete(new Range(0, editor.document.length));
        textEdit.insert(0, formattedContent);
      })
      .then(() => {
        editor.selectedRange = new Range(position, position);
        tmpFile.close();
        nova.fs.remove(tmpPath);
        saveWithoutFormatting(editor);
      });
  });

  process.start();
}

function saveWithoutFormatting(editor) {
  ignoredEditors.add(editor);
  editor.save().finally(() => ignoredEditors.delete(editor));
}

function resolveFormatOnSaveConfig() {
  if (
    nova.workspace.config.get("laravel-pint.format-on-save") == "Global Default"
  ) {
    return nova.config.get("laravel-pint.format-on-save");
  }

  return nova.workspace.config.get("laravel-pint.format-on-save") == "Enable"
    ? true
    : false;
}

function resolveConfigPath() {
  const path =
    nova.workspace.config.get("laravel-pint.config-path") ||
    nova.config.get("laravel-pint.config-path") ||
    null;

  if (path && !nova.fs.access(path, nova.fs.R_OK)) {
    return null;
  }

  return path;
}

var activate = main.activate = function () {
  nova.workspace.config.onDidChange(
    "laravel-pint.format-on-save",
    () => (formatOnSave = resolveFormatOnSaveConfig())
  );
  nova.config.onDidChange(
    "laravel-pint.format-on-save",
    () => (formatOnSave = resolveFormatOnSaveConfig())
  );

  nova.workspace.config.onDidChange(
    "laravel-pint.config-path",
    () => (configPath = resolveConfigPath())
  );
  nova.config.onDidChange(
    "laravel-pint.config-path",
    () => (configPath = resolveConfigPath())
  );

  nova.workspace.config.onDidChange(
    "laravel-pint.enable",
    (newValue) => (enabled = newValue)
  );
  nova.workspace.onDidAddTextEditor((editor) => {
    if (editor.document.syntax === "php") {
      editor.onWillSave(format);
    }
  });
};

nova.commands.register("kapalla.pint.save-without-formatting", (editor) => {
  saveWithoutFormatting(editor);
});

exports.activate = activate;
exports.default = main;
