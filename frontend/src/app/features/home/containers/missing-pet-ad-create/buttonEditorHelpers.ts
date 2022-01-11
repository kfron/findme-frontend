import { Position } from 'nativescript-google-maps-sdk';
import { CustomPropertyEditor } from "nativescript-ui-dataform";

export class ImageButtonEditorHelper {
    public buttonValue: string;
    public editor: CustomPropertyEditor;

    public updateEditorValue(editorView, newValue) {
        this.buttonValue = newValue;
    }
}

export class PositionButtonEditorHelper {
    public buttonValue: string;
    public editor: CustomPropertyEditor;

    public updateEditorValue(editorView, newValue) {
        this.buttonValue = newValue;
    }
}