'use strict';

app.Class('app.c.Creature', app.c.Object,
	function () {
		app.c.Object.apply(this);
	},
	{
		_m: null,

		randomize: function () {
			//random genotype
			var gent = {};

			this.fromGenotype(gent);
		},

		fromGenotype: function (genotype) {
			this._m = new app.m.Creature(genotype);
		}
	},
	{
		MIN: {
			LIMB_LENGTH: 0.1,
			LIMB_WIDTH: 0.05,
			LIMB_DENSITY: 0.1,
			LIMB_FRICTION: 0.1,
			LIMB_RESTITUTION: 0.01,
			MOTOR_SIN_A: 0.1,
			MOTOR_SIN_W: 1,
			MOTOR_SIN_F: 0,
			MAX_MOTOR_TORQUE: 0
		},
		MAX: {
			LIMB_LENGTH: 1.5,
			LIMB_WIDTH: 0.5,
		},
		//body, 1st level limbs, 2nd level limbs
		MAX_LIMBS_LEVELS: 2,
		//body, max 4 limbs, max 2 limbs
		MAX_CHILD_LIMBS: [ 4, 2 ]
	}
);
