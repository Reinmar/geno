'use strict';

app.Class('app.c.Creature', app.c.Object,
	function () {
		app.c.Object.apply(this);
	},
	{
		_m: null,

		randomize: function () {
			//random genotype
			var gent = this._randomLimbGenotype(0);

			this.fromGenotype(gent);
		},
		fromGenotype: function (genotype) {
			this._m = new app.m.Creature(genotype);
		},

		_randomLimbGenotype: function (level) {
			var S = app.c.Creature;
			var limb = {
				exists:			new app.c.Gene(S.MIN.LIMB_EXISTS, S.MAX.LIMB_EXISTS).random(),
				width:			new app.c.Gene(S.MIN.LIMB_WIDTH, S.MAX.LIMB_WIDTH).random(),
				length:			new app.c.Gene(S.MIN.LIMB_LENGTH, S.MAX.LIMB_LENGTH).random(),
				density:		new app.c.Gene(S.MIN.LIMB_DENSITY, S.MAX.LIMB_DENSITY).random(),
				friction:		new app.c.Gene(S.MIN.LIMB_FRICTION, S.MAX.LIMB_FRICTION).random(),
				restitution:	new app.c.Gene(S.MIN.LIMB_RESTITUTION, S.MAX.LIMB_RESTITUTION).random(),
				joints:			[],
			};

			//number of limbs
			var l = S.MAX_CHILDREN_LIMBS[level];
			for (var i = 0; i < l; ++i) {
				limb.joints.push({
					limb:				this._randomLimbGenotype(level + 1),
					motor: {
						speed:			new app.c.Gene(S.MIN.MOTOR_SPEED, S.MAX.MOTOR_SPEED).random(),
						max_torque:		new app.c.Gene(S.MIN.MAX_MOTOR_TORQUE, S.MAX.MAX_MOTOR_TORQUE).random()
					},
					angle: {
						lower:			new app.c.Gene(S.MIN.JOINT_LOWER_ANGLE, S.MAX.JOINT_LOWER_ANGLE).random(),
						upper:			new app.c.Gene(S.MIN.JOINT_UPPER_ANGLE, S.MAX.JOINT_UPPER_ANGLE).random(),
						reference:		new app.c.Gene(S.MIN.JOINT_REFERENCE_ANGLE, S.MAX.JOINT_REFERENCE_ANGLE).random()
					},
					child_pos: {
						x:				new app.c.Gene(S.MIN.CHILD_LIMB_POS, S.MAX.CHILD_LIMB_POS).random(),
						y:				new app.c.Gene(S.MIN.CHILD_LIMB_POS, S.MAX.CHILD_LIMB_POS).random()
					},
					joint_pos: {
						x:				new app.c.Gene(S.MIN.JOINT_POS, S.MAX.JOINT_POS).random(),
						y:				new app.c.Gene(S.MIN.JOINT_POS, S.MAX.JOINT_POS).random()
					}
				});
			}

			return limb;
		}
	},
	{
		MIN: {
			// < 0 == false
			LIMB_EXISTS: -1,
			// in meters
			LIMB_LENGTH: 0.1,
			// in meters
			LIMB_WIDTH: 0.05,
			// in kg/m2
			LIMB_DENSITY: 0.1,
			// in ?
			LIMB_FRICTION: 0.1,
			// in ?
			LIMB_RESTITUTION: 0.01,
			// in Nm
			MAX_MOTOR_TORQUE: 0,
			// in angle/s
			MOTOR_SPEED: 0,
			JOINT_LOWER_ANGLE: Math.toRadians(-120),
			JOINT_UPPER_ANGLE: Math.toRadians(0),
			JOINT_REFERENCE_ANGLE: Math.toRadians(-180),
			// in % - how far from center of limb is left side of its child located
			CHILD_LIMB_POS: -1,
			// in % - how far from center of limb is joint located (min(child_limb_pos))
			JOINT_POS: -1,
		},
		MAX: {
			LIMB_EXISTS: 1,
			LIMB_LENGTH: 1.5,
			LIMB_WIDTH: 0.5,
			LIMB_DENSITY: 2,
			LIMB_FRICTION: 0.9,
			LIMB_RESTITUTION: 0.5,
			MAX_MOTOR_TORQUE: 50,
			MOTOR_SPEED: 4,
			JOINT_LOWER_ANGLE: Math.toRadians(0),
			JOINT_UPPER_ANGLE: Math.toRadians(120),
			JOINT_REFERENCE_ANGLE: Math.toRadians(180),
			CHILD_LIMB_POS: 1,
			JOINT_POS: 1,
		},
		//body, 1st level limbs, 2nd level limbs
		MAX_LIMBS_LEVELS: 2,
		//body, max 4 limbs, max 2 limbs
		MAX_CHILDREN_LIMBS: [ 4, 2, 0 ]
	}
);
