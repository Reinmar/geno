'use strict';

app.Class('app.m.GA', app.m.Object,
	function () {
		app.m.Object.apply(this);

		this._results = [];
	},
	{
		//generation number
		_generation: 0,
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
			this._results.push({
				creature_i: this._current_creature_i,
				result: result
			});
		},
		
		getNextCreature: function () {
			return this._current_creature = this._population.getCreature(
				this._current_creature_i++
			);
		},

		hasNextCreature: function () {
			return this._current_creature_i < app.c.GA.POPULATION_SIZE;
		},

		getGeneration: function () {
			return this._generation;
		},

		sortResults: function () {
			this._results.sort(function (a, b) {
				return b.result - a.result;
			});
		}
	}
);

