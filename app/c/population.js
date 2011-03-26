'use strict';

app.Class('app.c.Population', app.c.Object,
	function (size) {
		app.c.Object.apply(this);
		
		this._m = new app.m.Population();
		this._size = size;
	},
	{
		_m: null,
		_size: null,


		randomize: function () {
			this._m.clear();

			for (var i = 0, l = this._size; i < l; ++i) {
				var cr = new app.c.Creature();
				cr.randomize();
	
				this._m.addCreature(cr.getM());		
			}
		}
	}
);
