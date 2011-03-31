'use strict';

app.Class('app.c.Simulation', app.c.Object,
	function () {
		app.c.Object.apply(this);
		var that = this;

		this._world = new app.c.World();
		this._v = new app.v.Simulation(app.$('world'));
		this._ga = new app.c.GA();
		this.slow();
		

		this._ga.attachEvent('onNewPopulation', function (population_json, population_name) {
			app.$('last_generation').value = population_json;

			that._trackTime();
			app.log('New population (' + population_name + ') created', that._time_elapsed);
		});
		this._ga.init();

		this._observeControllButtons();

		this._startNextTest();
	},
	{
		_v: null,
		_world: null,
		_ga: null,
		//last noticed microtime
		_last_time: 0,
		//time simulation took
		_time_elapsed: 0,
		//is simulation on
		_on: false,
		//is in fast mode
		_fast: false,
		//loop step
		_step: 0,

		//current creature
		_creature: null,
		//time (in cycles) this creture is tested
		_creature_age: null,
		//life expectancy - time (in cycles) this creature should be tested
		_creature_life_exp: null,


		fast: function () {
			this._fast = true;
			this._dt = app.c.Simulation.LOOP_DT_FAST;
		},

		slow: function () {
			this._fast = false;
			this._dt = app.c.Simulation.LOOP_DT_SLOW;
		},

		start: function () {
			this._on = true;
			this._last_time = +new Date();
	
			this._trackTime();
			app.log('Simulation started', this._time_elapsed);
			
			this._loop();
		},

		stop: function () {
			this._on = false;
			this._trackTime();

			app.log('Simulation stopped', this._time_elapsed);
		},

		generationFromJSON: function (json) {
			this._ga.generationFromJSON(json);
			this._startNextTest();
		},

		_trackTime: function () {
			this._time_elapsed += (new Date() - this._last_time);
			this._last_time = +new Date();			
		},

		_loop: function () {
			var world = this._world,
				that = this;

			var fn = function () {
				that._step++;
				
				that._creature_age++;
				if (that._creature_age >= that._creature_life_exp) {
					that._finishCurrentTest();

					that._startNextTest();
				}
				
				world.loop(that._fast, app.c.Simulation.LOOP_DT_SLOW);
			};

			if (!this._fast) {
				fn();
			}
			else {
				for (var i = 0; i < 5000 && this._on; ++i) {
					fn();
				}
			}

			this._on && setTimeout(function () {
				this._loop();
			}.bind(this), this._dt);

			if (this._step % 1000 === 0) {
				this._trackTime();
				app.debug('Simulation step: ' + this._step, this._time_elapsed);
			}
		},
		
		/*
		 * Pop next creature from current population
		 * And put it in to the world
		 */
		_startNextTest: function () {
			this._creature = this._ga.getNextCreature();
			this._creature_life_exp = Math.floor(
				app.c.GA.CREATURE_LIFE_EXPECTANCY * 1000 / app.c.Simulation.LOOP_DT_SLOW
			);
			this._creature_age = 0;

			this._world.setCreature(this._creature);
		},
		
		/*
		 * Measure creature result and save it
		 */
		_finishCurrentTest: function () {
			var result = this._world.getCreatureDistance();
			this._ga.setCurrentCreatureResult(result);
		},

		_observeControllButtons: function () {
			var that = this;
			app.$('sim_start').addEventListener('click', function (event) {
				that.start();
			}, false);
			app.$('sim_stop').addEventListener('click', function (event) {
				that.stop();
			}, false);
			app.$('sim_slow').addEventListener('click', function (event) {
				that.slow();
			}, false);
			app.$('sim_fast').addEventListener('click', function (event) {
				that.fast();
			}, false);
			app.$('sim_set_generation').addEventListener('click', function (event) {
				that.generationFromJSON(app.$('last_generation').value);
			}, false);
		}			
	},
	{
		LOOP_DT_FAST: 1,
		LOOP_DT_SLOW: 30,
	}
);
