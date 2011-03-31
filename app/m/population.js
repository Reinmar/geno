'use strict';

app.Class('app.m.Population', app.m.Object,
	function (name, size) {
		app.m.Object.apply(this);

		this._name = name;
		this._size = size;
		this.clear();
	},
	{
		_creatures: null,
		_size: null,
		_results: null,
		_name: null,
	
		addCreature: function (creature) {
			this._creatures.push(creature);
		},

		clear: function () {
			this._creatures = [];
			this._results = [];
		},

		getCreature: function (i) {
			return this._creatures[i];
		},
		
		getSize: function () {
			return this._size;
		},

		getName: function () {
			return this._name;
		}
	}
);
