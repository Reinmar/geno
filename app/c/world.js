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


		/*var jointDef = new app.b2RevoluteJointDef();
		jointDef.Initialize(b1, b2, b1.GetPosition());
		jointDef.referenceAngle = Math.toRadians(30);
		jointDef.lowerAngle     = Math.toRadians(-90);
		jointDef.upperAngle     =  Math.toRadians(90);
		jointDef.enableLimit    = true;
		jointDef.maxMotorTorque = 20.0;
		jointDef.motorSpeed     = 4;
		jointDef.enableMotor    = true;
		this.j = this._b2world.CreateJoint(jointDef);
		jointDef.Initialize(b2, b3, b2.GetPosition());
		jointDef.enableLimit = false;
		this._b2world.CreateJoint(jointDef);*/
	},
	{
		_b2world: null,
		// for creatures
		_b2body_def: null,
		_b2fix_def: null,
		_b2joint_def: null,

		_creature_body: null,
	
		/*
		 * @param creature app.m.Creature
		 */
		setCreature: function (creature) {
			//TODO remove old creature
			console.log(creature);
			this._creature_body = this._addLimb(null, creature.getBody());
		},

		/*
		 * Return distance creature walked
		 */
		getCreatureDistance: function () {
			return 0;
		},

		loop: function (fast, dt) {
			var world = this._b2world;

			world.Step(
				dt / 1000,	//frame-rate
				10,			//velocity iterations
				10			//position iterations
			);
			!fast && world.DrawDebugData();
			world.ClearForces();
		},
			
		_addGround: function () {
			var fix_def = new app.b2FixtureDef();
			fix_def.density = 200.0;
			fix_def.friction = 0.5;
			fix_def.restitution = 0.1;

			//ground { left: -5m; top: 19.5m; width:50m }
			var body_def = new app.b2BodyDef();
			body_def.type = app.b2Body.b2_staticBody;
			body_def.position.x = 20;
			body_def.position.y = 20;
			fix_def.shape = new app.b2PolygonShape();
			fix_def.shape.SetAsBox(25, 0.5);
			this._b2world.CreateBody(body_def).CreateFixture(fix_def);
		},
		
		/*
		 * @param parent b2Body
		 */
		_addLimb: function (parent, limb, joint) {
			var fd = this._b2fix_def,
				bd = this._b2body_def,
				def = limb.getDef();
	
			fd.density = def.density;
			fd.friction = def.friction;
			fd.restitution = def.restitution;
			fd.shape.SetAsBox(def.length, def.width);

			bd.position = this._getLimbPos(parent, limb, joint);

			var body = this._b2world.CreateBody(bd);
			body.CreateFixture(fd);
			//for my own usage
			body.def = def;
	
			for (var i = 0, l = limb.getJointsCount(); i < l; ++i) {
				var joint = limb.getJoint(i);
				this._addLimb(body, joint.child, joint);
			}

			return body;
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
					joint.child_pos.x * (parent.def.length + limb.getDef().length)
				);
				y = parent.GetPosition().y + (
					joint.child_pos.y * (parent.def.width + limb.getDef().width)
				);
			}
			console.log(x);
			return new app.b2Vec2(x, y);
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
		BODY_POS_X: 20,
		BODY_POS_Y: 15
	}
);
