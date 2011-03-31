'use strict';

app.Class('app.m.Creature', app.m.Object,
	function (name, genotype) {
		app.m.Object.apply(this);
		
		this._name = name;
		this._fromGenotype(genotype);
	},
	{
		// main limb
		_body: null,
		_genotype: null,
		_name: null,

		getBody: function () {
			return this._body;
		},

		getGenotype: function () {
			return {};
		},

		getName: function () {
			return this._name;
		},

		_fromGenotype: function (genotype) {
			this._genotype = genotype;
			this._body = new app.m.Limb(null, genotype);
		}
	}
);


