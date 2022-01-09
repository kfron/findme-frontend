import { PropertyValidator } from 'nativescript-ui-dataform';
export class EmptyValidator extends PropertyValidator {
    constructor() {
        super();
        this.errorMessage = "Choose an image.";
    }

    public validate(value: any, propertyName: string): boolean {
        return value !== '';
    }
}

export class AgeValidator extends PropertyValidator {
    constructor() {
        super();
        this.errorMessage = "Age must be between 0 and 30.";
    }

    public validate(value: any, propertyName: string): boolean {
        return 0 <= value && value <= 30 && value !== '';
    }
}