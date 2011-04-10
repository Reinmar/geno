'use strict';

app.Class('app.c.Gene', app.c.Object,
	function (min, max, value) {
		app.c.Object.apply(this);
	
		if (arguments.length > 1) {
			this.setM(min, max, value);
		}
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

		setM: function (min /*or model gene*/, max, value/*not required*/) {
			if (arguments.length > 1) {
				this._m = new app.m.Gene(min, max, value);
			}
			else {
				this._m = min;
			}
			return this;
		},
	},
	{
		fromJSON: function (json_obj) {
			return new app.c.Gene(
				json_obj.min,
				json_obj.max,
				json_obj.value
			);
		}
	}
);
