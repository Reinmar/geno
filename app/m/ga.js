'use strict';

app.Class('app.m.GA', app.m.Object,
	function () {
		app.m.Object.apply(this);

		this._results = [];
	},
	{
		_population: null,
		//results for current population
		_results: null,
		//currently tested creature
		_current_creature: null,
		//index of current creature
		_current_creature_i: 0,

		getCurrentCreature: function () {
			return this._current_creature;
		},

		setPopulation: function (p) {
			this._population = p;
			this._current_creature_i = 0;
		},

		setCurrentCreatureResult: function (result) {
			this._results[this._current_creature_i] = result;
		},
		
		getNextCreature: function () {
			return this._current_creature = this._population.getCreature(
				this._current_creature_i++
			);
		},

		hasNextCreature: function () {
			return this._current_creature_i < App.c.GA.POPULATION_SIZE - 1;
		},
	}
);

