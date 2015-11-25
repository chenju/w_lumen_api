'use strict';

angular.module('http-post-urlencoded', [])
.factory('postUrlencodeInterceptor', ['$q', function ($q) {
	var r20 = /%20/g,
		rbracket = /\[\]$/;

	// Serialize an array of form elements or a set of
	// key/values into a query string
	function buildParams( prefix, obj, add ) {
		var name;

		if (Array.isArray(obj)) {
			// Serialize array item.
			angular.forEach(obj, function(v, i) {
				if (rbracket.test(prefix)) {
					// Treat each array item as a scalar.
					add( prefix, v );
				} else {
					// Item is non-scalar (array or object), encode its numeric index.
					buildParams(prefix + '[' + ( typeof v === 'object' ? i : '' ) + ']', v, add);
				}
			});
		} else if (typeof(obj) === 'object') {
			// Serialize object item.
			for (name in obj) {
				buildParams(prefix + '[' + name + ']', obj[ name ], add);
			}
		} else {
			// Serialize scalar item.
			add(prefix, obj);
		}
	}
	function param(a) {
		var prefix,
			s = [],
			add = function( key, value ) {
				// If value is a function, skip it
				if (typeof(value) !== 'function') {
					value = (value === null ? '' : value);
					s[ s.length ] = encodeURIComponent( key ) + '=' + encodeURIComponent( value );
				}
			};

		// If an array was passed in, assume that it is an array of form elements.
		if (Array.isArray(a)) {
			// Serialize the form elements
			angular.forEach( a, function(v, k) {
				add(k, v);
			});
		} else {
			// otherwise encode params recursively.
			for (prefix in a) {
				buildParams( prefix, a[ prefix ], add );
			}
		}

		// Return the resulting serialization
		return s.join('&').replace(r20, '+');
	}

	function isApplicable(config)
	{
		if (config.method !== 'POST') {
			return false;
		}
		if (config.data === undefined || !angular.isObject(config.data)) {
			return false;
		}
		if (FormData && config.data instanceof FormData) {
			return false;
		}
		return true;
	}

	return {
		request: function (config) {
			config = config || $q.when(config);
			if (isApplicable(config)) {
				config.headers = config.headers || {};
				config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
				config.data = param(config.data);
			}
			return config;
		}
	};
}]);