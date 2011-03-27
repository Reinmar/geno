app.utils = (function () {
	'use strict';

	Math.randomBetween = function (min, max) {
		return Math.random() * (max - min) + min;
	};		
	Math.paramSin = function (a, w, f) {
		return function (t) { return a * Math.sin(w*t + f); };
	};
	Math.toRadians = function (deg) {
		return deg / 180 * Math.PI;
	};
	Math.toDegrees = function (rad) {
		return rad * 180 / Math.PI;
	};

	return {
	};
})();


