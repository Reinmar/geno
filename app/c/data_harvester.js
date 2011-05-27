'use strict';

app.Class('app.c.DataHarvester', app.c.Object,
	function () {
		app.c.Object.apply(this);

		this._html_el = document.querySelector('html');
		this._body_el = document.body;
		this._results = [];
	},
	{
		_html_el: null,
		_loop_num: 0,
		_sim: null,
		_results: null,

		loop: function () {
			var loops_number = app.c.DataHarvester.PARAMS.length * app.c.DataHarvester.TIMES_PER_PARAMS_OBJ;

			if (this._getParamsNum() >= app.c.DataHarvester.PARAMS.length) {
				app.log('The END!');
				return;
			}
			app.log('Harvesting loop: ' + (this._loop_num + 1) + ' of ' + loops_number + ' started.');

			var new_body_el = this._body_el.cloneNode(true);

			this._html_el.removeChild(this._body_el);
			this._html_el.appendChild(new_body_el);
			this._configureSimulator();
			this._sim = new app.c.Simulation();
			this._sim.fast();
			this._sim.startFor(app.c.DataHarvester.GENERATIONS_NUMBER, this._onResults.bind(this));

			this._body_el = new_body_el;
		},

		getAvgResults: function () {
			var results = this._results,
				results_avg = [],
				times_per = app.c.DataHarvester.TIMES_PER_PARAMS_OBJ;
			
			var avgArray = function (/* a1, a2, a3, ... */) {
				var r = [];
				for (var i = 0, l1 = arguments[0].length; i < l1; ++i) {
					var sum = 0;
					for (var j = 0, l2 = arguments.length; j < l2; ++j) {
						sum += arguments[j][i];
					}
					r.push(sum / arguments.length);
				}

				return r;
			};


			for (
				var i = 0,
					l = Math.floor(results.length / times_per);
				i < l;
				++i
			) {
				var obj = {},
					j = i * times_per;
				obj.best = (results[j].best + results[j + 1].best + results[j + 2].best) / times_per;
				obj.avg = (results[j].avg + results[j + 1].avg + results[j + 2].avg) / times_per;
				obj.best_history = avgArray(
					results[j].best_history,
					results[j + 1].best_history,
					results[j + 2].best_history
				);
				obj.avg_history = avgArray(
					results[j].avg_history,
					results[j + 1].avg_history,
					results[j + 2].avg_history
				);

				results_avg.push(obj);
			}

			return results_avg;
		},

		_configureSimulator: function () {
			var ga = app.c.GA,
				params = this._getParams();
		
			ga.POPULATION_SIZE = params.size;
			ga.PARENTS_NUMBER = params.parents;
			ga.REPRODUCTION_MUTATION_FACTOR = params.mutation_factor;
		},

		_onResults: function (best, avg, best_history, avg_history) {
			this._results.push({
				best: +best,
				avg: +avg,
				best_history: best_history,
				avg_history: avg_history
			});

			this._saveResults(this._results[this._results.length - 1]);

			this._loop_num++;
			this.loop();
		},

		_getParamsNum: function () {
			return Math.floor(this._loop_num / app.c.DataHarvester.TIMES_PER_PARAMS_OBJ);
		},

		_getParams: function () {
			return app.c.DataHarvester.PARAMS[this._getParamsNum()];
		},

		_saveResults: function (results) {
			var xhr = new XMLHttpRequest(),
				form_data = new FormData();

			form_data.append('content', JSON.stringify(results));

			xhr.open('POST', 'http://localhost:3000/results/save', true);
			xhr.onreadystatechange = function () {
			};
			xhr.send(form_data);
		},
	},
	{
		GENERATIONS_NUMBER: 150,
		PARAMS: [
			/*{ size: 50, parents: 50, mutation_factor: 0.001 },
			{ size: 50, parents: 50, mutation_factor: 0.005 },
			{ size: 50, parents: 50, mutation_factor: 0.010 },
			{ size: 50, parents: 50, mutation_factor: 0.050 },
			{ size: 50, parents: 50, mutation_factor: 0.100 },

			{ size: 50, parents: 10, mutation_factor: 0.005 },
			{ size: 50, parents: 20, mutation_factor: 0.005 },
			{ size: 50, parents: 25, mutation_factor: 0.005 },
			{ size: 50, parents: 30, mutation_factor: 0.005 },
			{ size: 50, parents: 50, mutation_factor: 0.005 },

			{ size: 10, parents: 10, mutation_factor: 0.005 },
			{ size: 20, parents: 20, mutation_factor: 0.005 },
			{ size: 50, parents: 50, mutation_factor: 0.005 },
			{ size: 75, parents: 75, mutation_factor: 0.005 },
			{ size: 100, parents: 100, mutation_factor: 0.005 },
			{ size: 200, parents: 200, mutation_factor: 0.005 },*/


			{ size: 100, parents: 75, mutation_factor: 0.005 },
			{ size: 100, parents: 75, mutation_factor: 0.005 },
			{ size: 100, parents: 75, mutation_factor: 0.005 },
		],
		TIMES_PER_PARAMS_OBJ: 3,
	}
);
