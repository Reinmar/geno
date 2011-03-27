'use strict';

app.Class('app.c.Object', app.Object,
	function () {
		app.Object.apply(this);
	},
	{
		getM: function () {
			return this._m;
		},
		getV: function () {
			return this._v;
		},
	}
);
