import { CustomPropertyEditor } from "nativescript-ui-dataform";

export class ButtonEditorHelper {
    public buttonValue: string;
    public editor: CustomPropertyEditor;

    public updateEditorValue(editorView, newValue) {
        this.buttonValue = newValue;
    }
}
