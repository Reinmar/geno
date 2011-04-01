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

		hasNextCreature: function () {
			return this._m.hasNextCreature();
		},

		getNextCreature: function () {
			if (!this._m.hasNextCreature()) {
				this._reproduce();
			}

			return this._m.getNextCreature();
		},

		setCurrentCreatureResult: function (result) {
			this._m.setCurrentCreatureResult(result);
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

			this._m.setPopulation(this._population.getM());
		},

		_reproduce: function () {
			var m = this._m,
				new_pop,
				new_pop_m,
				reproduce = app.c.Reproduce,
				opts = {
					max_part_length: app.c.GA.REPRODUCTION_MAX_PART_LENGTH,
					mutation_factor: app.c.GA.REPRODUCTION_MUTATION_FACTOR
				},
				new_pop_name = 'p:' + (m.getGeneration() + 1);
			
			m.sortResults();
			this.fireDataEvent(
				'onPopulationResults',
				[
					this._population.getM().getName(),
					m.getBestResult().toFixed(2),
					m.getAverageResult().toFixed(2),
					JSON.stringify(m.getTop10()),
					JSON.stringify(m.getLastTop10())
				]
			);

			m.prepareParents(app.c.GA.PARENTS_NUMBER);

			new_pop = new app.c.Population(
				new_pop_name, app.c.GA.POPULATION_SIZE
			);
			new_pop_m = new_pop.getM();

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
					new_pop_m.addCreature(reproduce(p1, p2, new_pop_name + '_cr:' + i, opts));
				}

				i_inf++;
			}
			if (i_inf >= app.c.GA.POPULATION_SIZE * 9999) {
				throw new Error('Fell here in infinite loop. Read comment');
			}

			this.fireDataEvent('onNewPopulation', [ new_pop_name, new_pop.getM().toJSON() ]);
			
			this._population = new_pop;
			m.setPopulation(new_pop_m);
			m.nextSession();
		}
	},
	{
		POPULATION_SIZE: 100,
		//in seconds
		CREATURE_LIFE_EXPECTANCY: 20,
		//number of creatures that are used in reproduction
		PARENTS_NUMBER: 25,
		REPRODUCTION_MAX_PART_LENGTH: 3,
		REPRODUCTION_MUTATION_FACTOR: 0.01 //1%
	}		
);

