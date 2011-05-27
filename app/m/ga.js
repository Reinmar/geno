'use strict';

app.Class('app.m.GA', app.m.Object,
	function () {
		app.m.Object.apply(this);

		this._results = [];
		this._top10 = [];
		this._history_best = [];
		this._history_average = [];
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
		//top 10 creatures of all time {result, creature}
		_top10: null,
		_history_best: null,
		_history_average: null,

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

			this._current_creature_i++;
		},
		
		getNextCreature: function () {
			return this._current_creature = this._population.getCreature(
				this._current_creature_i
			);
		},

		hasNextCreature: function () {
			return this._current_creature_i < this._population.getSize();
		},

		getGeneration: function () {
			return this._generation;
		},

		sortResults: function () {
			this._results.sort(function (a, b) {
				return b.result - a.result;
			});

			//and update top10
			var top10 = this._top10.concat(this._results);
			top10.sort(function (a, b) {
				return b.result - a.result;
			});
			top10 = top10.slice(0, 10);
			for (var i = 0, l = 10; i < l; ++i) {
				if ('creature_i' in top10[i]) {
					//make copy - don't want reference
					top10[i] = {
						creature: this._population.getCreature(top10[i].creature_i),
						result: top10[i].result
					};
				}
			}
			this._top10 = top10;

			this._history_best.push(this.getBestResultEver());
			this._history_average.push(this.getAverageResult());
		},

		getTop10: function () {
			return this._top10.map(function (row) {
				return row.creature;
			});
		},

		getLastTop10: function () {
			var that = this;
			return this._results.slice(0, 10).map(function (row) {
				return that._population.getCreature(row.creature_i);
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
		},

		getBestResult: function () {
			return this._results[0].result;
		},

		getBestResultEver: function () {
			return this._top10[0].result;
		},

		getAverageResult: function () {
			var sum = 0;
			for (var i = 0, l = this._results.length; i < l; ++i)
				sum += this._results[i].result;

			return sum / l;
		},

		getHistoryBest: function () {
			return this._history_best;
		},

		getHistoryAverage: function () {
			return this._history_average;
		},
	}
);

