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

			this._m.setPopulation(this._population.getM());
		},

		generationFromJSON: function (json) {
			this._m = new app.m.GA();
			this._population = new app.c.Population(
				'p:' + this._m.getGeneration(),	json
			);

			this.fireDataEvent('onNewPopulation', [ this._population.getM().toJSON() ]);

			this._m.setPopulation(this._population.getM());
		},

		_reproduce: function () {
			var m = this._m,
				new_pop,
				reproduction = app.c.Reproduction;
			
			m.sortResults();
			this.fireDataEvent('onNewPopulationResults', []);

			m.prepareParents(app.c.GA.PARENTS_NUMBER);

			console.log(m);

			new_pop = new app.c.Population(
				'p:' + m.getGeneration() + 1, app.c.GA.POPULATION_SIZE
			);

			//WARNING can become an infinite loop when only one parent
			//has result>0. This is beacuse of wheel of fortune based
			//on creatures result.

			for (
				var i = 0, i_inf = 0, l = app.c.GA.POPULATION_SIZE;
				i < l && i_inf < app.c.GA.POPULATION_SIZE * 9999;
			) {
				var p1 = m.getRandomParent(),
					p2 = m.getRandomParent();

				//self reproduction? :D
				if (p1 !== p2) {
					++i;
					new_pop.addCreature(reproduction.on(p1, p2));
				}

				i_inf++;
			}
			if (i_inf >= app.c.GA.POPULATION_SIZE * 9999) {
				throw new Error('Fell here in infinite loop. Read comment');
			}

			this.fireDataEvent('onNewPopulation', [ new_pop.getM().toJSON() ]);
			
			this._population = new_pop;
			m.setPopulation(new_pop.getM());
			m.nextSession();
		}
	},
	{
		POPULATION_SIZE: 10,
		//in seconds
		CREATURE_LIFE_EXPECTANCY: 20,
		//number of creatures that are used in reproduction
		PARENTS_NUMBER: 5,
	}		
);

