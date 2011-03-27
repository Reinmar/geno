'use strict';

app.Class('app.c.Gene', app.c.Object,
	function (min, max, value) {
		app.c.Object.apply(this);

		this._m = new app.m.Gene(min, max, value);
	},
	{
		_m: null,

		random: function () {
			this._m.setValue(Math.randomBetween(
				this._m.getMin(),
				this._m.getMax()
			));
			return this;
		},
	}
);
