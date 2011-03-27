'use strict';

app.Class('app.m.Population', app.m.Object,
	function () {
		app.m.Object.apply(this);

		this.clear();
	},
	{
		_creatures: null,
	
		addCreature: function (creature) {
			this._creatures.push(creature);
		},

		clear: function () {
			this._creatures = [];
		},

		getCreature: function (i) {
			return this._creatures[i];
		}
	}
);
