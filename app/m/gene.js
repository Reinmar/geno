'use strict';

app.Class('app.m.Gene', app.m.Object,
	function (min, max, value) {
		app.m.Object.apply(this);

		this._min = min;
		this._max = max;
		if (typeof value !== 'undefined')
			this._value = value;
	},
	{
		_min: null,
		_max: null,
		_value: null,

		setValue: function (v) {
			this._value = v;
		},

		getValue: function () {
			return this._value;
		},

		getMin: function () {
			return this._min;
		},

		getMax: function () {
			return this._max;
		},

		toJSON: function () {
			return {
				_class: 'app.m.Gene',
				min: this._min,
				max: this._max,
				value: this._value
			};
		},

		clone: function () {
			return new app.m.Gene(this._min, this._max, this._value);
		}
	}
);

