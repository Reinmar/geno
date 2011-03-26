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
		// { width, length, weight }
		_def: null,
		// [ { child, motor:{sin_a, sin_w, sin_t}, pos:{x, y} } ]
		// pos.x and pos.y given in percentage <0;1>
		_joints: null,


		addChildLimb: function (limb_def, motor, pos) {
			var child = new app.m.Limb(this, limb_def);
			_joints.push({ child: child, motor: motor, pos: pos });
		},
	}
);



