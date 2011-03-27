'use strict';

app.Class('app.m.Creature', app.m.Object,
	function (genotype) {
		app.m.Object.apply(this);
		
		this._fromGenotype(genotype);
	},
	{
		// main limb
		_body: null,
		_genotype: null,

		getBody: function () {
			return this._body;
		},

		getGenotype: function () {
			return {};
		},

		_fromGenotype: function (genotype) {
			this._genotype = genotype;
			this._body = new app.m.Limb(null, genotype);
		}
	}
);


