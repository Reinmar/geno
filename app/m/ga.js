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
		//cache of parents for reproduction
		_parents: null,

		nextSession: function () {
			this._current_creature = null;
			this._current_creature_i = 0;
			this._results = [];
			this._generation++;
		},

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
		},

		prepareParents: function (parents_number) {
			var parents = [],
				results = this._results;

			var results_sum = 0;
			for (var i = 0; i < parents_number; ++i) {
				results_sum += results[i].result;
			}
			
			var s = 0;
			for (var i = 0; i < parents_number; ++i) {
				s += results[i].result;

				parents.push({
					max_rand: s / results_sum,
					creature_i: results[i].creature_i
				});
			}

			this._parents = parents;
		},

		getRandomParent: function () {
			var r = Math.random(),
				i = 0,
				parents = this._parents;

			while (r > parents[i].max_rand) {
				++i;
			}
			return this._population.getCreature(parents[i].creature_i);
		}
	}
);

