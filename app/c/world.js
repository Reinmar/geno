'use strict';

app.Class('app.c.World', app.c.Object,
	function () {
		app.c.Object.apply(this);

		this._init();
		this._addGround();

		this._b2body_def = new app.b2BodyDef();
		this._b2fix_def = new app.b2FixtureDef();
		this._b2joint_def = new app.b2RevoluteJointDef();

		//limbs not colliding
		this._b2fix_def.filter.groupIndex = -1;
		this._b2fix_def.shape = new app.b2PolygonShape();
		this._b2joint_def.enableMotor = true;
		this._b2joint_def.enableLimit = true;
		this._b2body_def.type = app.b2Body.b2_dynamicBody;

	},
	{
		_b2world: null,
		// for creatures
		_b2body_def: null,
		_b2fix_def: null,
		_b2joint_def: null,

		_creature_body: null,
		//array of all b2bodies
		_creature_limbs: null,
		//array of all joints
		_creature_joints: null,

		_step: 0,
	
		/*
		 * @param creature app.m.Creature
		 */
		setCreature: function (creature) {
			if (this._creature_body)
				this._destroyCreature();

			this._creature_joints = [];
			this._creature_limbs = [];

			this._creature_body = this._addLimb(null, creature.getBody());
		},

		/*
		 * Return distance creature walked
		 */
		getCreatureDistance: function () {
			return Math.abs(
				this._creature_body.GetPosition().x - app.c.World.BODY_POS_X
			);
		},

		loop: function (fast, dt) {
			var world = this._b2world;
			var sim_iters = fast ? 2 : 10;

			world.Step(
				dt / 1000,	//frame-rate
				sim_iters,			//velocity iterations
				sim_iters			//position iterations
			);
			//check it once per 10 loops and reset counter
			//because it may overflow
			if (++this._step % 10 == 0) {
				this._checkJointsLimits();
				this._step = 0;
			}

			!fast && world.DrawDebugData();
			world.ClearForces();
		},
			
		_addGround: function () {
			var fix_def = new app.b2FixtureDef();
			fix_def.density = 200.0;
			fix_def.friction = 0.5;
			fix_def.restitution = 0.1;

			//ground { left: -5m; top: 18m; width:100m }
			var body_def = new app.b2BodyDef();
			body_def.type = app.b2Body.b2_staticBody;
			body_def.position.x = 20;
			body_def.position.y = 20;
			fix_def.shape = new app.b2PolygonShape();
			fix_def.shape.SetAsBox(50, 2);
			this._b2world.CreateBody(body_def).CreateFixture(fix_def);
		},
		
		/*
		 * @param parent b2Body
		 */
		_addLimb: function (parent, limb, joint) {
			var fd = this._b2fix_def,
				bd = this._b2body_def,
				jd = this._b2joint_def,
				def = limb.getDef();
	
			//shape
			fd.density = def.density;
			fd.friction = def.friction;
			fd.restitution = def.restitution;
			fd.shape.SetAsBox(def.length, def.width);
			//position
			bd.position = this._getLimbPos(parent, limb, joint);

			var body = this._b2world.CreateBody(bd);
			body.CreateFixture(fd);
			//for my own usage
			body.cache_def = def;
			this._creature_limbs.push(body);

			if (joint) {
				jd.Initialize(
					parent, body,
					this._getJointPos(parent, limb, joint)
				);
				jd.referenceAngle = joint.angle.reference;
				jd.lowerAngle = joint.angle.lower;
				jd.upperAngle = joint.angle.upper;
				jd.maxMotorTorque = joint.motor.max_torque;
				jd.motorSpeed = joint.motor.speed;
				this._creature_joints.push(this._b2world.CreateJoint(jd));
			}
	
			for (var i = 0, l = limb.getJointsCount(); i < l; ++i) {
				var joint = limb.getJoint(i);
				this._addLimb(body, joint.child, joint);
			}

			return body;
		},

		_checkJointsLimits: function () {
			for (var i = 0, l = this._creature_joints.length; i < l; ++i) {
				var joint = this._creature_joints[i],
					angle = joint.GetJointAngle(),
					speed = joint.GetMotorSpeed();

				if (
					angle + 0.05 > joint.GetUpperLimit() && speed > 0 ||
					angle - 0.05 < joint.GetLowerLimit() && speed < 0
				) {
					joint.SetMotorSpeed(-speed);
				}
			}
		},

		_getLimbPos: function (parent, limb, joint) {
			var x, y;
			//body limb
			if (!parent) {
				x = app.c.World.BODY_POS_X;
				y = app.c.World.BODY_POS_Y;
			}
			else {
				x = parent.GetPosition().x + (
					joint.child_pos.x * (parent.cache_def.length + limb.getDef().length)
				);
				y = parent.GetPosition().y + (
					joint.child_pos.y * (parent.cache_def.width + limb.getDef().width)
				);
			}

			return new app.b2Vec2(x, y);
		},

		_getJointPos: function (parent, limb, joint) {
			var x, y;
			
			var pl = parent.cache_def.length,
				pw = parent.cache_def.width,
				cl = limb.getDef().length,
				cw = limb.getDef().width,
				pp = parent.GetPosition(),
				cp = this._getLimbPos(parent, limb, joint),
				dx = pp.x - cp.x,
				dy = pp.y - cp.y,
				JP = joint.joint_pos;

			//intersection * joint_pos (%)
			var t1x = (dx > 0 ? -1 : 1) * JP.x * ((cl + pl) - Math.abs(dx));
			//left side of intersection
			var t2x = (dx > 0 ? -1 : 1) * (Math.abs(dx) - cl);

			x = pp.x + t1x + t2x;

			//intersection * joint_pos (%)
			var t1y = (dy > 0 ? -1 : 1) * JP.y * ((cw + pw) - Math.abs(dy));
			//left side of intersection
			var t2y = (dy > 0 ? -1 : 1) * (Math.abs(dy) - cw);

			y = pp.y + t1y + t2y;

	

			return new app.b2Vec2(x, y);
		},

		_destroyCreature: function () {
			var world = this._b2world;
			for (var i = 0, l = this._creature_limbs.length; i < l; i++) {
				world.DestroyBody(this._creature_limbs[i]);
			}
			for (var i = 0, l = this._creature_joints.length; i < l; i++) {
				world.DestroyJoint(this._creature_joints[i]);
			}
		},

		_init: function () {
			var world = new app.b2World(
				new app.b2Vec2(0, 10),	//gravity
				true					//allow sleep
			);
			var debug_draw = new app.b2DebugDraw();
			debug_draw.SetSprite(app.$('world').getContext('2d'));
			debug_draw.SetDrawScale(20.0);
			debug_draw.SetFillAlpha(0.5);
			debug_draw.SetLineThickness(1.0);
			debug_draw.SetFlags(app.b2DebugDraw.e_shapeBit | app.b2DebugDraw.e_jointBit);
			world.SetDebugDraw(debug_draw);

			this._b2world = world;
		}
	},
	{
		BODY_POS_X: 22.5,
		BODY_POS_Y: 15
	}
);
