'use strict';

app.Class('app.v.Simulation', app.v.Object,
	function (canvas_el) {
		app.v.Object.apply(this);

		this._canvas_el = canvas_el;
	},
	{
		_canvas_el: null,
	}
);
