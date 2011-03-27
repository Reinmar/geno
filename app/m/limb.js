'use strict';

app.Class('app.m.Limb', app.m.Object, 
	function (parent, def) {
		app.m.Object.apply(this);

		this._parent = parent;
		this._def = def;
		this._joints = [];

	},
	{
		// limb
		_parent: null,
		// { width, length, density, friction, restitution }
		_def: null,
		// [ { child, angle: {lower, upper, reference}, motor:{max_torque, speed}, pos:{x, y} } ]
		// pos.x and pos.y given in percentage <0;1>
		_joints: null,


		addChildLimb: function (limb_def, motor, pos) {
			var child = new app.m.Limb(this, limb_def);
			_joints.push({ child: child, motor: motor, pos: pos });
		},
	}
);



