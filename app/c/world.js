'use strict';

app.Class('app.c.World', app.c.Object,
	function () {
		app.c.Object.apply(this);

		this._init();
		this._addGround();
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
			fix_def.restitution = 0.5;

			//ground { left: -5m; width:50m }
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
