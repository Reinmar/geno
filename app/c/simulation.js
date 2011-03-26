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

		this.slow();
	},
	{
		_v: null,
		_population: null,
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
			this._loop();

			app.log('Simulation start');
		},
		stop: function () {
			this._on = false;

			app.log('Simulation stop');
		},

		_loop: function () {
			if (!this._fast) {
				this._step++;
				this._world.loop(this._fast, app.c.Simulation.LOOP_DT_SLOW);
			}
			else {
				for (var i = 0; i < 10000; ++i) {
					this._step++;
					this._world.loop(this._fast, app.c.Simulation.LOOP_DT_SLOW);
				}
			}

			this._on && setTimeout(function () {
				this._loop();
			}.bind(this), this._dt);

			if (this._step % 500 === 0)
				app.log('Simulation step: ' + this._step);
		},
	},
	{
		POPULATION_SIZE: 100,
		LOOP_DT_FAST: 1,
		LOOP_DT_SLOW: 25,
	}
);
