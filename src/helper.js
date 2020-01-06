const $ = require('jquery');

// === === === === === === === === === === === === === === === === ==
// Date
// === === === === === === === === === === === === === === === === ==

/*eslint no-extend-native: ["error", { "exceptions": ["Date", "String", "Number"] }]*/
Date.prototype.format = function(format) {
	this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	this.days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	this.formatKeys = {
		y: () => this.getYear(),
		Y: () => this.getFullYear(),
		mm: () => {
			var month = this.getMonth() + 1;
			return month >= 10 ? month : `0${month}`;
		},
		m: () => this.getMonth() + 1,
		MM: () => this.months[this.getMonth()],
		M: () => this.months[this.getMonth()].slice(0, 3),
		dd: () => this.getDate(),
		d: () => this.getDay(),
		DD: () => this.days[this.getDay()],
		D: () => this.days[this.getDay()].slice(0, 3),
		h: () => {
			var hours = this.getHours();
			return hours === 12 || hours === 0 ? 12 : hours % 12;
		},
		H: () => this.getHours(),
		i: () => {
			var mins = this.getMinutes();
			return mins >= 10 ? mins : `0${mins}`;
		},
		s: () => {
			var secs = this.getSeconds();
			return secs >= 10 ? secs : `0${secs}`;
		},
		a: () => this.getHours() >= 12 ? 'pm' : 'am',
	};
	return format.replace(/y|Y|mm|m|MM|M|dd|d|DD|D|h|H|i|s|a/g, (key) => {
		return this.formatKeys[key].apply(this);
	})
}

String.prototype.truncate = function(length = 100) {
	if (this.toString().length > length) {
		return this.toString().substring(0, length) + "......";
	}
	return this;
};


// Filters
function currencyFormatter (number, places = 2) {
	if (!number) {
		return number;
	}
	if (typeof number == "string") {
		number = number.replace(/,/i, '');
	}
	return Number(number).toFixed(places).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

function numberFormatter (number) {
	if (!number) {
		return number;
	}
	return number.toString().replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

function camelToSentence (string) {
	if (!string) {return string}

	return string.toString().replace(/([A-Z0-9])/g, ' $1');
};

function truncate(string, length = 100) {
	if (!string) {
		return string;
	}
	if (string.toString().length > length) {
		return string.toString().substring(0, length) + "......";
	}
	return string;
};

function capitalize(string = 100) {
	return string.replace(/^\w|\s\w/g, (match) => {
		return match.toUpperCase();
	});
};

function numberPosition(number) {
	switch (number) {
		case 1:
			return '1st';
		case 2:
			return '2nd';
		case 3:
			return '3rd';
		default:
			return number+'th';
	}
};

function dateFormat(date, format) {
	if (typeof date != 'string') {
		return date;
	}
	return (new Date(date)).format(format);
};


$('body').on('focus blur', '.form-group .form-control', function(event) {
	const group = $(this).closest('.form-group');
	if (event.type === 'focusin') {
		group.addClass('focused');
	}else {
		group.removeClass('focused');
	}
});

$('body').on('click mousedown', '.form-group', function(event) {
	$(this).find('.form-control').focus();
});


module.exports = {
	currencyFormatter,
	numberFormatter,
	camelToSentence,
	truncate,
	capitalize,
	numberPosition,
	dateFormat
}