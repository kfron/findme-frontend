import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'timeSinceDate'
})
export class TimeSinceDatePipe implements PipeTransform {

	transform(foundAt: Date): string {
		const now = Date.now();
		const diff = Math.abs(now.valueOf() - foundAt.valueOf());
		const weeks = Math.floor(diff / 604800000);
		const days = Math.floor((diff - weeks * 604800000) / 86400000);
		const hours = Math.floor((diff - weeks * 604800000 - days * 86400000) / 3600000);
		const minutes = Math.floor((diff - weeks * 604800000 - days * 86400000 - hours * 3600000) / 60000);
		let result = '';
		result += weeks === 1 ? weeks + ' week ' : weeks > 1 ? weeks + ' weeks ' : '';
		result += days === 1 ? days + ' day ' : days > 1 ? days + ' days ' : '';
		if (weeks > 0) return result + 'ago';
		result += hours === 1 ? hours + ' hour ' : hours > 1 ? hours + ' hours ' : '';
		if (days > 0) return result + 'ago';
		result += minutes === 1 ? minutes + ' minute ' : minutes > 1 ? minutes + ' minutes ' : '';
		if (diff < 60000) return 'seconds ago';
		return result + 'ago';
	}

}
