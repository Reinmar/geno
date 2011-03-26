'use strict';

app.Class('app.m.Creature', app.m.Object,
	function () {
		app.m.Object.apply(this);
	},
	{
		// main limb
		_body: null,


		getGenotype: function () {
			return {};
		},
	}
);


