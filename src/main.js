import format from "./format.js";

exports.activate = function () {
  nova.workspace.activeTextEditor.onDidSave((editor) => {
    format(editor);
  });
};

nova.commands.register("kapalla.pint.format", (editor) => {
  format(editor);
});
