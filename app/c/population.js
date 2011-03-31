'use strict';

app.Class('app.c.Population', app.c.Object,
	function (name, size_or_json) {
		app.c.Object.apply(this);

		if (Object.isNumber(size_or_json)) {
			this._m = new app.m.Population(name, size_or_json);
		}
		else {
			this._fromJSON(name, size_or_json);
		}
		
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

		_fromJSON: function (name, json) {
			var obj = JSON.parse(json);
			this._m = new app.m.Population(name, obj.length);

			for (var i = 0, l = obj.length; i < l; ++i) {
				this._m.addCreature(
					new app.c.Creature(name + '_cr:' + i, obj[i]).getM()
				);
			}
		}
	}
);
