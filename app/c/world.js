'use strict';

app.Class('app.c.World', app.c.Object,
	function () {
		app.c.Object.apply(this);

		this._initPhysics();
		this._addGround();
	},
	{
		_b2world: null,

		loop: function () {
			var world = this._b2world;

			world.Step(
				1 / 30,	//frame-rate
				10,		//velocity iterations
				10		//position iterations
			);
			world.DrawDebugData();
			world.ClearForces();
		},			
			
		_addGround: function () {
			var fix_def = new app.b2FixtureDef();
			fix_def.density = 1.0;
			fix_def.friction = 0.5;
			fix_def.restitution = 0.2;

			var body_def = new app.b2BodyDef();

			body_def.type = app.b2Body.b2_staticBody;
			body_def.position.x = 9;
			body_def.position.y = 13;
			fix_def.shape = new app.b2PolygonShape();
			fix_def.shape.SetAsBox(10, 0.5);
			this._b2world.CreateBody(body_def).CreateFixture(fix_def);
		},
		_initPhysics: function () {
			var world = new app.b2World(
				new app.b2Vec2(0, 10), //gravity
				true //allow sleep
			);
			var debug_draw = new app.b2DebugDraw();
			debug_draw.SetSprite(app.$('world').getContext('2d'));
			debug_draw.SetDrawScale(30.0);
			debug_draw.SetFillAlpha(0.5);
			debug_draw.SetLineThickness(1.0);
			debug_draw.SetFlags(app.b2DebugDraw.e_shapeBit | app.b2DebugDraw.e_jointBit);
			world.SetDebugDraw(debug_draw);

			this._b2world = world;
		}
	}
);
