'use strict';

app.Class('app.c.Population', app.c.Object,
	function (name, size) {
		app.c.Object.apply(this);
		
		this._m = new app.m.Population(name, size);
	},
	{
		_m: null,


		randomize: function () {
			this._m.clear();

			var name = this._m.getName();

			for (var i = 0, l = this._m.getSize(); i < l; ++i) {
				var cr = new app.c.Creature();
				cr.randomize(name + '_cr:' + i);
	
				this._m.addCreature(cr.getM());
			}
		},
	}
);
