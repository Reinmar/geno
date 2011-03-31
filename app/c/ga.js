'use strict';

/*
 * Genetic algorithm
 */
app.Class('app.c.GA', app.c.Object,
	function () {
		app.c.Object.apply(this);

		this._m = new app.m.GA();
	},
	{
		_m: null,
		_population: null,

		getNextCreature: function () {
			if (!this._m.hasNextCreature()) {
				this._reproduce();
			}

			return this._m.getNextCreature();
		},

		setCurrentCreatureResult: function (result) {
			this._m.setCurrentCreatureResult(result);
		},
		
		getBestCreature: function (rank) {
		},

		init: function () {
			this._population = new app.c.Population(
				'p:' + this._m.getGeneration(), app.c.GA.POPULATION_SIZE
			);
			this._population.randomize();

			this.fireDataEvent('onNewPopulation', [ this._population.getM().toJSON() ]);

			this._m.setPopulation(this._population.getM());
		},

		generationFromJSON: function (json) {
			this._m = new app.m.GA();
			this._population = new app.c.Population(
				'p:' + this._m.getGeneration(),
				json
			);

			this._m.setPopulation(this._population.getM());
			console.log(this._m);
		},

		_reproduce: function () {
			var m = this._m;
			m.sortResults();
		}
	},
	{
		POPULATION_SIZE: 10,
		//in seconds
		CREATURE_LIFE_EXPECTANCY: 20,
	}		
);

