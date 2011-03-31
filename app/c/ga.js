'use strict';

/*
 * Genetic algorithm
 */
app.Class('app.c.GA', app.c.Object,
	function () {
		app.c.Object.apply(this);

		this._population = new app.c.Population(
			'p:1', app.c.GA.POPULATION_SIZE
		);
		this._population.randomize();

		this._m = new app.m.GA();
		this._m.setPopulation(this._population.getM());
	},
	{
		_m: null,
		_population: null,

		getNextCreature: function () {
			return this._m.getNextCreature();
		},

		setCurrentCreatureResult: function (result) {
			this._m.setCurrentCreatureResult(result);
		},
		
		getBestCreature: function (rank) {
		}
	},
	{
		POPULATION_SIZE: 100,
		//in seconds
		CREATURE_LIFE_EXPECTANCY: 10,
	}		
);

