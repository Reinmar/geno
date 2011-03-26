'use strict';

app.Class('app.c.Simulation', app.c.Object,
	function () {
		app.c.Object.apply(this);

		this._population = new app.c.Population(
			app.c.Simulation.POPULATION_SIZE
		);
		this._population.randomize();
	},
	{
		_population: null,
	},
	{
		POPULATION_SIZE: 100,
	}
);


