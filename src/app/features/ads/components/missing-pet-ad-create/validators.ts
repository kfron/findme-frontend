import { PropertyValidator } from 'nativescript-ui-dataform';
export class ImageValidator extends PropertyValidator {
	constructor() {
		super();
		this.errorMessage = 'Choose an image.';
	}

	public validate(value: string): boolean {
		return value !== '';
	}
}

export class PositionValidator extends PropertyValidator {
	constructor() {
		super();
		this.errorMessage = 'Choose a position.';
	}

	public validate(value: string): boolean {
		return value !== '' && value !== '0 0';
	}
}

export class AgeValidator extends PropertyValidator {
	constructor() {
		super();
		this.errorMessage = 'Age must be between 0 and 30.';
	}

	public validate(value: string): boolean {
		return 0 <= +value && +value <= 30 && value !== null && value !== '';
	}
}