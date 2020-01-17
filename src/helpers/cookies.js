(() => {

	function parseCookies() {
		const cookie = document.cookie;
		const pairs = cookie.split(';');
		const length = pairs.length;

		var keys = [];
		pairs.forEach( pair => {
			let indexOfEquals = pair.indexOf('=');
			let key = pair.slice(0, indexOfEquals).trim();
			let value = pair.slice(indexOfEquals + 1, pair.length);

			keys[key] = value;
		} );

		return {
			keys,
			length
		}
	}

	const Cookie = {
		set(key, value, expiry = '10min', domain, path, secure) {
			if (!key) throw new Error('No key specified');

			if (!value) throw new Error('No value specified');

			if (value.constructor.toString().match(/object|array/i)) {
				value = JSON.stringify(value);
			}

			var expires;
			var expires_key = 'expires';

			switch (expiry.constructor) {
				case Number:
					if (expiry === Infinity) expires = 'Fri, 31 Dec 9999 23:59:59 GMT';
					else expires = expiry; expires_key = 'max-age';
					break;
				case Date: expires = Date.toUTCString(); break;
				case String:
					const m = expiry.match(/^(\d{1,})(s|min|h|d|w|m|y)$/i);

					if (m) {
						var duration = m[1];
						var duration_type = m[2];
						expires_key = 'max-age';
						switch (duration_type) {
							case 's': expires = duration; break;
							case 'min': expires = duration * 60; break;
							case 'h': expires = duration * 360; break;
							case 'd': expires = duration * 86400; break;
							case 'w': expires = duration * 604800; break;
							case 'm': expires = duration * 2592000; break;
							case 'y': expires = duration * 31536000; break;
							default: throw new Error('Unknown expiry expression');
						}
					}
					break;
				default: break;
			}

			document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)} ${ expires && '; '+expires_key+'='+expires } ${ domain && '; domain='+domain } ${ path && '; path='+path } ${ secure && '; secure='+secure }`;
		},

		get(key) {
			const cookies = parseCookies();
			var data = decodeURIComponent(cookies.keys[key]);

			if (/^({|\[).+(}|])$/.test(data)) {
				data = JSON.parse(data);
			}

			return data;
		},

		remove(key, domain, path) {
			document.cookie = `${encodeURIComponent(key)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
		}
	};

	module.exports = Cookie

})();