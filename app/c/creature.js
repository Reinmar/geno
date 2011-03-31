'use strict';

app.Class('app.c.Creature', app.c.Object,
	function () {
		app.c.Object.apply(this);
	},
	{
		_m: null,

		randomize: function (name) {
			//random genotype
			var gent = this._randomLimbGenotype(0);

			this.fromGenotype(name, gent);
		},

		fromGenotype: function (name, genotype) {
			this._m = new app.m.Creature(name, genotype);
		},

		_randomLimbGenotype: function (level) {
			var S = app.c.Creature,
				g = new app.c.Gene();

			var limb = {
				exists:			g.setM(S.MIN.LIMB_EXISTS, S.MAX.LIMB_EXISTS).random().getM(),
				width:			g.setM(S.MIN.LIMB_WIDTH, S.MAX.LIMB_WIDTH).random().getM(),
				length:			g.setM(S.MIN.LIMB_LENGTH, S.MAX.LIMB_LENGTH).random().getM(),
				density:		g.setM(S.MIN.LIMB_DENSITY, S.MAX.LIMB_DENSITY).random().getM(),
				friction:		g.setM(S.MIN.LIMB_FRICTION, S.MAX.LIMB_FRICTION).random().getM(),
				restitution:	g.setM(S.MIN.LIMB_RESTITUTION, S.MAX.LIMB_RESTITUTION).random().getM(),
				joints:			[],
			};

			//number of limbs
			var l = S.MAX_CHILDREN_LIMBS[level];
			for (var i = 0; i < l; ++i) {
				limb.joints.push({
					child:				this._randomLimbGenotype(level + 1),
					motor: {
						speed:			g.setM(S.MIN.MOTOR_SPEED, S.MAX.MOTOR_SPEED).random().getM(),
						max_torque:		g.setM(S.MIN.MAX_MOTOR_TORQUE, S.MAX.MAX_MOTOR_TORQUE).random().getM()
					},
					angle: {
						lower:			g.setM(S.MIN.JOINT_LOWER_ANGLE, S.MAX.JOINT_LOWER_ANGLE).random().getM(),
						upper:			g.setM(S.MIN.JOINT_UPPER_ANGLE, S.MAX.JOINT_UPPER_ANGLE).random().getM(),
						reference:		g.setM(S.MIN.JOINT_REFERENCE_ANGLE, S.MAX.JOINT_REFERENCE_ANGLE).random().getM()
					},
					child_pos: {
						x:				g.setM(S.MIN.CHILD_LIMB_POS, S.MAX.CHILD_LIMB_POS).random().getM(),
						y:				g.setM(S.MIN.CHILD_LIMB_POS, S.MAX.CHILD_LIMB_POS).random().getM()
					},
					joint_pos: {
						x:				g.setM(S.MIN.JOINT_POS, S.MAX.JOINT_POS).random().getM(),
						y:				g.setM(S.MIN.JOINT_POS, S.MAX.JOINT_POS).random().getM()
					}
				});
			}

			return limb;
		}
	},
	{
		MIN: {
			// > 0 == true
			LIMB_EXISTS: -1,
			// in meters
			LIMB_LENGTH: 0.75,
			// in meters
			LIMB_WIDTH: 0.1,
			// in kg/m2
			LIMB_DENSITY: 0.5,
			// in ?
			LIMB_FRICTION: 0.5,
			// in ?
			LIMB_RESTITUTION: 0.1,
			// in Nm
			MAX_MOTOR_TORQUE: 20,
			// in angle/s
			MOTOR_SPEED: 0,
			JOINT_LOWER_ANGLE: Math.toRadians(-150),
			JOINT_UPPER_ANGLE: Math.toRadians(20),
			JOINT_REFERENCE_ANGLE: Math.toRadians(-180),
			// in % - how far from center of limb is left/right side of its child located
			// 1 == [-1-][-2-]		-1 == [-2-][-1-]
			CHILD_LIMB_POS: -1,
			// in % - how far from center of limb is joint located
			JOINT_POS: 0,
		},
		MAX: {
			LIMB_EXISTS: 1,
			LIMB_LENGTH: 1.5,
			LIMB_WIDTH: 0.25,
			LIMB_DENSITY: 1,
			LIMB_FRICTION: 0.9,
			LIMB_RESTITUTION: 0.5,
			MAX_MOTOR_TORQUE: 50,
			MOTOR_SPEED: 4,
			JOINT_LOWER_ANGLE: Math.toRadians(-20),
			JOINT_UPPER_ANGLE: Math.toRadians(150),
			JOINT_REFERENCE_ANGLE: Math.toRadians(180),
			CHILD_LIMB_POS: 1,
			JOINT_POS: 1,
		},
		//body, 1st level limbs, 2nd level limbs
		MAX_LIMBS_LEVELS: 2,
		//body, max 4 limbs, max 1 limbs
		MAX_CHILDREN_LIMBS: [ 4, 1, 0 ]
	}
);
