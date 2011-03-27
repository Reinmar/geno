'use strict';

app.Class('app.c.World', app.c.Object,
	function () {
		app.c.Object.apply(this);

		this._init();
		this._addGround();



		var fix_def = new app.b2FixtureDef();
		fix_def.density = 1;
		fix_def.friction = 0.9;
		fix_def.restitution = 0.1;

		var body_def = new app.b2BodyDef();
		body_def.type = app.b2Body.b2_dynamicBody;
		fix_def.shape = new app.b2PolygonShape();


		body_def.position.x = 20;
		body_def.position.y = 10;
		fix_def.shape.SetAsBox(1, 0.2);
		fix_def.filter.groupIndex = -1;
		var b1 = this._b2world.CreateBody(body_def)
		b1.CreateFixture(fix_def);

		body_def.position.x = 20.8;
		body_def.position.y = 10;
		fix_def.shape.SetAsBox(1, 0.2);
		var b2 = this._b2world.CreateBody(body_def);
		b2.CreateFixture(fix_def);

		body_def.position.x = 22.8;
		body_def.position.y = 10;
		fix_def.shape.SetAsBox(0.5, 0.1);
		var b3 = this._b2world.CreateBody(body_def);
		b3.CreateFixture(fix_def);		

		var jointDef = new app.b2RevoluteJointDef();
		jointDef.Initialize(b1, b2, b1.GetPosition());
		jointDef.lowerAngle     = Math.toRadians(-45); // -90 degrees
		jointDef.upperAngle     =  Math.toRadians(45); // 45 degrees
		jointDef.enableLimit    = true;
		jointDef.maxMotorTorque = 100.0;
		jointDef.motorSpeed     = 0.2;
		jointDef.enableMotor    = true;
		this.j = this._b2world.CreateJoint(jointDef);
		jointDef.Initialize(b2, b3, b2.GetPosition());
		jointDef.enableLimit = false;
		this._b2world.CreateJoint(jointDef);
	},
	{
		_b2world: null,

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
			fix_def.density = 2.0;
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
	}
);
