'use strict';

app.Class('app.c.Simulation', app.c.Object,
	function () {
		app.c.Object.apply(this);

		this._world = new app.c.World();

		this._v = new app.v.Simulation(app.$('world'));

		this._population = new app.c.Population(
			app.c.Simulation.POPULATION_SIZE
		);
		this._population.randomize();


		//TODO
		this._world.setCreature(this._population.getM().getCreature(0));

		this.slow();
		//this.fast();
	},
	{
		_v: null,
		_population: null,
		//last noticed microtime
		_last_time: 0,
		//time simulation takes
		_time_elapsed: 0,
		_on: false,
		_fast: false,
		_dt: 0,
		_step: 0,
		_world: null,

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

			app.log('Simulation started');

			this._loop();
		},

		stop: function () {
			this._on = false;
			this._trackTime();

			app.log('Simulation stopped (time: ' + this._time_elapsed / 1000 + 's)');
		},

		_trackTime: function () {
			this._time_elapsed += (new Date() - this._last_time);
			this._last_time = +new Date();			
		},

		_loop: function () {
			var world = this._world;

			var fn = function () {
				this._step++;
				world.loop(this._fast, app.c.Simulation.LOOP_DT_SLOW);
			}.bind(this);

			if (!this._fast) {
				fn();
			}
			else {
				for (var i = 0; i < 50000 && this._on; ++i) {
					fn();
				}
			}

			this._on && setTimeout(function () {
				this._loop();
			}.bind(this), this._dt);

			if (this._step % 1000 === 0) {
				this._trackTime();
				app.log('Simulation step: ' + this._step + ' (time: ' + this._time_elapsed / 1000 + 's)');
			}
		},
	},
	{
		POPULATION_SIZE: 100,
		LOOP_DT_FAST: 1,
		LOOP_DT_SLOW: 30,
	}
);
