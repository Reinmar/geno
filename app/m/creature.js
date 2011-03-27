'use strict';

app.Class('app.m.Creature', app.m.Object,
	function (genotype) {
		app.m.Object.apply(this);
		
		this._fromGenotype(genotype);
	},
	{
		// main limb
		_body: null,

		getGenotype: function () {
			return {};
		},

		_fromGenotype: function (genotype) {
		}
	}
);


