'use strict';

app.Class('app.Object', null,
	function () {
		this._events = {};
	},
	{
		attachEvent: function (name, callback, context) {
			if (!this._events[name]) {
				this._events[name] = [];
			}

			context = context || this;
			this._events[name].push({ callback: callback, context: context });
		},

		fireEvent: function (name) {
			var events = this._events[name];

			events && events.forEach(function (event) {
				event.callback.apply(event.context);
			});
		},

		fireDataEvent: function (name, data) {
			var events = this._events[name];

			events && events.forEach(function (event) {
				event.callback.apply(event.context, data);
			});
		}
	}
);
