'use strict';

app.Class('app.c.Creature', app.c.Object,
	function () {
		app.c.Object.apply(this);

		this._m = new app.m.Creature();
	},
	{
		_m: null,

		randomize: function () {
		}
	}
);
