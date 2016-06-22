/*
* Copyright (c) 2006-2007 Erin Catto http:
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked, and must not be
* misrepresented the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/








// Shapes are created automatically when a body is created.
// Client code does not normally interact with shapes.
var b2Shape = Class.create();
b2Shape.prototype = 
{
	TestPoint: function(p){return false},

	GetUserData: function(){return this.m_userData;},

	GetType: function(){
		return this.m_type;
	},

	// Get the parent body of this shape.
	GetBody: function(){
		return this.m_body;
	},

	GetPosition: function(){
		return this.m_position;
	},
	GetRotationMatrix: function(){
		return this.m_R;
	},

	// Remove and then add proxy from the broad-phase.
	// This is used to refresh the collision filters.
	ResetProxy: function(broadPhase){},

	// Get the next shape in the parent body's shape list.
	GetNext: function(){
		return this.m_next;
	},

	//--------------- Internals Below -------------------




	initialize: function(def, body){
		// initialize instance variables for references
		this.m_R = new b2Mat22();
		this.m_position = new b2Vec2();
		//

		this.m_userData = def.userData;

		this.m_friction = def.friction;
		this.m_restitution = def.restitution;
		this.m_body = body;

		this.m_proxyId = b2Pair.b2_nullProxy;

		this.m_maxRadius = 0.0;

		this.m_categoryBits = def.categoryBits;
		this.m_maskBits = def.maskBits;
		this.m_groupIndex = def.groupIndex;
	},

	// Internal use only. Do not call.
	//b2Shape::~b2Shape()
	//{
	//	this.m_body->m_world->m_broadPhase->this.DestroyProxy(this.m_proxyId);
	//}


	DestroyProxy: function()
	{
		if (this.m_proxyId != b2Pair.b2_nullProxy)
		{
			this.m_body.m_world.m_broadPhase.DestroyProxy(this.m_proxyId);
			this.m_proxyId = b2Pair.b2_nullProxy;
		}
	},


	// Internal use only. Do not call.
	Synchronize: function(position1, R1, position2, R2){},
	QuickSync: function(position, R){},
	Support: function(dX, dY, out){},
	GetMaxRadius: function(){
		return this.m_maxRadius;
	},

	m_next: null,

	m_R: new b2Mat22(),
	m_position: new b2Vec2(),

	m_type: 0,

	m_userData: null,

	m_body: null,

	m_friction: null,
	m_restitution: null,

	m_maxRadius: null,

	m_proxyId: 0,
	m_categoryBits: 0,
	m_maskBits: 0,
	m_groupIndex: 0



	// b2ShapeType












};


b2Shape.Create = function(def, body, center){
		switch (def.type)
		{
		case b2Shape.e_circleShape:
			{
				//void* mem = body->m_world->m_blockAllocator.Allocate(sizeof(b2CircleShape));
				return new b2CircleShape(def, body, center);
			}

		case b2Shape.e_boxShape:
		case b2Shape.e_polyShape:
			{
				//void* mem = body->m_world->m_blockAllocator.Allocate(sizeof(b2PolyShape));
				return new b2PolyShape(def, body, center);
			}
		}

		//b2Settings.b2Assert(false);
		return null;
	};
b2Shape.Destroy = function(shape)
	{
		/*b2BlockAllocator& allocator = shape->m_body->m_world->m_blockAllocator;

		switch (shape.m_type)
		{
		case b2Shape.e_circleShape:
			shape->~b2Shape();
			allocator.Free(shape, sizeof(b2CircleShape));
			break;

		case b2Shape.e_polyShape:
			shape->~b2Shape();
			allocator.Free(shape, sizeof(b2PolyShape));
			break;

		default:
			b2Assert(false);
		}

		shape = NULL;*/

		// FROM DESTRUCTOR
		if (shape.m_proxyId != b2Pair.b2_nullProxy)
			shape.m_body.m_world.m_broadPhase.DestroyProxy(shape.m_proxyId);
	};
b2Shape.e_unknownShape = -1;
b2Shape.e_circleShape = 0;
b2Shape.e_boxShape = 1;
b2Shape.e_polyShape = 2;
b2Shape.e_meshShape = 3;
b2Shape.e_shapeTypeCount = 4;
b2Shape.PolyMass = function(massData, vs, count, rho)
	{
		//b2Settings.b2Assert(count >= 3);

		//var center = new b2Vec2(0.0, 0.0);
		var center = new b2Vec2();
		center.SetZero();

		var area = 0.0;
		var I = 0.0;

		// pRef is the reference point for forming triangles.
		// It's location doesn't change the result (except for rounding error).
		var pRef = new b2Vec2(0.0, 0.0);

		var inv3 = 1.0 / 3.0;

		for (var i = 0; i < count; ++i)
		{
			// Triangle vertices.
			var p1 = pRef;
			var p2 = vs[i];
			var p3 = i + 1 < count ? vs[i+1] : vs[0];

			var e1 = b2Math.SubtractVV(p2, p1);
			var e2 = b2Math.SubtractVV(p3, p1);

			var D = b2Math.b2CrossVV(e1, e2);

			var triangleArea = 0.5 * D;
			area += triangleArea;

			// Area weighted centroid
			// center += triangleArea * inv3 * (p1 + p2 + p3);
			var tVec = new b2Vec2();
			tVec.SetV(p1);
			tVec.Add(p2);
			tVec.Add(p3);
			tVec.Multiply(inv3*triangleArea);
			center.Add(tVec);

			var px = p1.x;
			var py = p1.y;
			var ex1 = e1.x;
			var ey1 = e1.y;
			var ex2 = e2.x;
			var ey2 = e2.y;

			var intx2 = inv3 * (0.25 * (ex1*ex1 + ex2*ex1 + ex2*ex2) + (px*ex1 + px*ex2)) + 0.5*px*px;
			var inty2 = inv3 * (0.25 * (ey1*ey1 + ey2*ey1 + ey2*ey2) + (py*ey1 + py*ey2)) + 0.5*py*py;

			I += D * (intx2 + inty2);
		}

		// Total mass
		massData.mass = rho * area;

		// Center of mass
		//b2Settings.b2Assert(area > Number.MIN_VALUE);
		center.Multiply( 1.0 / area );
		massData.center = center;

		// Inertia tensor relative to the center.
		I = rho * (I - area * b2Math.b2Dot(center, center));
		massData.I = I;
	};
b2Shape.PolyCentroid = function(vs, count, out)
	{
		//b2Settings.b2Assert(count >= 3);

		//b2Vec2 c; c.Set(0.0f, 0.0f);
		var cX = 0.0;
		var cY = 0.0;
		//float32 area = 0.0f;
		var area = 0.0;

		// pRef is the reference point for forming triangles.
		// It's location doesn't change the result (except for rounding error).
		//b2Vec2 pRef(0.0f, 0.0f);
		var pRefX = 0.0;
		var pRefY = 0.0;
	/*
		// This code would put the reference point inside the polygon.
		for (var i = 0; i < count; ++i)
		{
			//pRef += vs[i];
			pRef.x += vs[i].x;
			pRef.y += vs[i].y;
		}
		pRef.x *= 1.0 / count;
		pRef.y *= 1.0 / count;
	*/

		//const float32 inv3 = 1.0f / 3.0f;
		var inv3 = 1.0 / 3.0;

		for (var i = 0; i < count; ++i)
		{
			// Triangle vertices.
			//b2Vec2 p1 = pRef;
			var p1X = pRefX;
			var p1Y = pRefY;
			//b2Vec2 p2 = vs[i];
			var p2X = vs[i].x;
			var p2Y = vs[i].y;
			//b2Vec2 p3 = i + 1 < count ? vs[i+1] : vs[0];
			var p3X = i + 1 < count ? vs[i+1].x : vs[0].x;
			var p3Y = i + 1 < count ? vs[i+1].y : vs[0].y;

			//b2Vec2 e1 = p2 - p1;
			var e1X = p2X - p1X;
			var e1Y = p2Y - p1Y;
			//b2Vec2 e2 = p3 - p1;
			var e2X = p3X - p1X;
			var e2Y = p3Y - p1Y;

			//float32 D = b2Cross(e1, e2);
			var D = (e1X * e2Y - e1Y * e2X);

			//float32 triangleArea = 0.5f * D;
			var triangleArea = 0.5 * D;
			area += triangleArea;

			// Area weighted centroid
			//c += triangleArea * inv3 * (p1 + p2 + p3);
			cX += triangleArea * inv3 * (p1X + p2X + p3X);
			cY += triangleArea * inv3 * (p1Y + p2Y + p3Y);
		}

		// Centroid
		//b2Settings.b2Assert(area > Number.MIN_VALUE);
		cX *= 1.0 / area;
		cY *= 1.0 / area;

		// Replace return with 'out' vector
		//return c;
		out.Set(cX, cY);
	};
