'use strict';

app.Class('app.m.Limb', app.m.Object, 
	function (parent, genotype) {
		app.m.Object.apply(this);

		this._parent = parent;
		this.fromGenotype(genotype);
	},
	{
		// limb
		_parent: null,
		// { width, length, density, friction, restitution }
		_def: null,
		// [ {
		//		child,
		//		angle: {lower, upper, reference},
		//		motor:{max_torque, speed},
		//		joint_pos:{x, y},
		//		child_pos:{x,y}
		// } ]
		_joints: null,

	
		/*
		 * It takes as certainty that genotype.exists > 0
		 */
		fromGenotype: function (genotype) {
			this._def = {
				width:			genotype.width.getValue(),
				length:			genotype.length.getValue(),
				density:		genotype.density.getValue(),
				friction:		genotype.friction.getValue(),
				restitution:	genotype.restitution.getValue(),
			};
			this._joints = [];
			for (var i = 0, l = genotype.joints.length; i < l; ++i) {
				var joint = genotype.joints[i];
	
				if (joint.child.exists.getValue() > 0) {
					this._joints.push({
						child: new app.m.Limb(this, joint.child),
						angle: {
							lower:		joint.angle.lower.getValue(),
							upper:		joint.angle.upper.getValue(),
							reference:	joint.angle.reference.getValue()
						},
						motor: {
							speed:		joint.motor.speed.getValue(),
							max_torque:	joint.motor.max_torque.getValue()
						},
						child_pos: {
							x:			joint.child_pos.x.getValue(),
							y:			joint.child_pos.y.getValue()
						},
						joint_pos: {
							x:			joint.joint_pos.x.getValue(),
							y:			joint.joint_pos.y.getValue()
						}
					});
				}
			}
		}
	}
);



