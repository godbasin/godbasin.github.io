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





// A convex polygon. The position of the polygon (m_position) is the
// position of the centroid. The vertices of the incoming polygon are pre-rotated
// according to the local rotation. The vertices are also shifted to be centered
// on the centroid. Since the local rotation is absorbed into the vertex
// coordinates, the polygon rotation is equal to the body rotation. However,
// the polygon position is centered on the polygon centroid. This simplifies
// some collision algorithms.

var b2PolyShape = Class.create();
Object.extend(b2PolyShape.prototype, b2Shape.prototype);
Object.extend(b2PolyShape.prototype, 
{
	TestPoint: function(p){

		//var pLocal = b2Math.b2MulTMV(this.m_R, b2Math.SubtractVV(p, this.m_position));
		var pLocal = new b2Vec2();
		pLocal.SetV(p);
		pLocal.Subtract(this.m_position);
		pLocal.MulTM(this.m_R);

		for (var i = 0; i < this.m_vertexCount; ++i)
		{
			//var dot = b2Math.b2Dot(this.m_normals[i], b2Math.SubtractVV(pLocal, this.m_vertices[i]));
			var tVec = new b2Vec2();
			tVec.SetV(pLocal);
			tVec.Subtract(this.m_vertices[i]);

			var dot = b2Math.b2Dot(this.m_normals[i], tVec);
			if (dot > 0.0)
			{
				return false;
			}
		}

		return true;
	},

	//--------------- Internals Below -------------------
	// Temp vec for b2Shape.PolyCentroid

	initialize: function(def, body, newOrigin){
		// initialize instance variables for references
		this.m_R = new b2Mat22();
		this.m_position = new b2Vec2();
		//

		// The constructor for b2Shape
		this.m_userData = def.userData;

		this.m_friction = def.friction;
		this.m_restitution = def.restitution;
		this.m_body = body;

		this.m_proxyId = b2Pair.b2_nullProxy;

		this.m_maxRadius = 0.0;

		this.m_categoryBits = def.categoryBits;
		this.m_maskBits = def.maskBits;
		this.m_groupIndex = def.groupIndex;
		//

		// initialize instance variables for references
		this.syncAABB = new b2AABB();
		this.syncMat = new b2Mat22();
		this.m_localCentroid = new b2Vec2();
		this.m_localOBB = new b2OBB();
		//


		//super(def, body);

		var i = 0;


		var hX;
		var hY;

		var tVec;

		var aabb = new b2AABB();

		// Vertices
		this.m_vertices = new Array(b2Settings.b2_maxPolyVertices);
		this.m_coreVertices = new Array(b2Settings.b2_maxPolyVertices);
		//for (i = 0; i < b2Settings.b2_maxPolyVertices; i++)
		//	this.m_vertices[i] = new b2Vec2();

		// Normals
		this.m_normals = new Array(b2Settings.b2_maxPolyVertices);
		//for (i = 0; i < b2Settings.b2_maxPolyVertices; i++)
		//	this.m_normals[i] = new b2Vec2();

		//b2Settings.b2Assert(def.type == b2Shape.e_boxShape || def.type == b2Shape.e_polyShape);
		this.m_type = b2Shape.e_polyShape;

		var localR = new b2Mat22(def.localRotation);

		// Get the vertices transformed into the body frame.
		if (def.type == b2Shape.e_boxShape)
		{
			//this.m_localCentroid = def.localPosition - newOrigin;
			this.m_localCentroid.x = def.localPosition.x - newOrigin.x;
			this.m_localCentroid.y = def.localPosition.y - newOrigin.y;

			var box = def;
			this.m_vertexCount = 4;
			hX = box.extents.x;
			hY = box.extents.y;

			//hc.x = b2Max(0.0f, h.x - 2.0f * b2_linearSlop);
			var hcX = Math.max(0.0, hX - 2.0 * b2Settings.b2_linearSlop);
			//hc.y = b2Max(0.0f, h.y - 2.0f * b2_linearSlop);
			var hcY = Math.max(0.0, hY - 2.0 * b2Settings.b2_linearSlop);

			//this.m_vertices[0] = b2Mul(localR, b2Vec2(h.x, h.y));
			tVec = this.m_vertices[0] = new b2Vec2();
			tVec.x = localR.col1.x * hX + localR.col2.x * hY;
			tVec.y = localR.col1.y * hX + localR.col2.y * hY;
			//this.m_vertices[1] = b2Mul(localR, b2Vec2(-h.x, h.y));
			tVec = this.m_vertices[1] = new b2Vec2();
			tVec.x = localR.col1.x * -hX + localR.col2.x * hY;
			tVec.y = localR.col1.y * -hX + localR.col2.y * hY;
			//this.m_vertices[2] = b2Mul(localR, b2Vec2(-h.x, -h.y));
			tVec = this.m_vertices[2] = new b2Vec2();
			tVec.x = localR.col1.x * -hX + localR.col2.x * -hY;
			tVec.y = localR.col1.y * -hX + localR.col2.y * -hY;
			//this.m_vertices[3] = b2Mul(localR, b2Vec2(h.x, -h.y));
			tVec = this.m_vertices[3] = new b2Vec2();
			tVec.x = localR.col1.x * hX + localR.col2.x * -hY;
			tVec.y = localR.col1.y * hX + localR.col2.y * -hY;

			//this.m_coreVertices[0] = b2Mul(localR, b2Vec2(hc.x, hc.y));
			tVec = this.m_coreVertices[0] = new b2Vec2();
			tVec.x = localR.col1.x * hcX + localR.col2.x * hcY;
			tVec.y = localR.col1.y * hcX + localR.col2.y * hcY;
			//this.m_coreVertices[1] = b2Mul(localR, b2Vec2(-hc.x, hc.y));
			tVec = this.m_coreVertices[1] = new b2Vec2();
			tVec.x = localR.col1.x * -hcX + localR.col2.x * hcY;
			tVec.y = localR.col1.y * -hcX + localR.col2.y * hcY;
			//this.m_coreVertices[2] = b2Mul(localR, b2Vec2(-hc.x, -hc.y));
			tVec = this.m_coreVertices[2] = new b2Vec2();
			tVec.x = localR.col1.x * -hcX + localR.col2.x * -hcY;
			tVec.y = localR.col1.y * -hcX + localR.col2.y * -hcY;
			//this.m_coreVertices[3] = b2Mul(localR, b2Vec2(hc.x, -hc.y));
			tVec = this.m_coreVertices[3] = new b2Vec2();
			tVec.x = localR.col1.x * hcX + localR.col2.x * -hcY;
			tVec.y = localR.col1.y * hcX + localR.col2.y * -hcY;
		}
		else
		{
			var poly = def;

			this.m_vertexCount = poly.vertexCount;
			//b2Settings.b2Assert(3 <= this.m_vertexCount && this.m_vertexCount <= b2Settings.b2_maxPolyVertices);
			//b2Vec2 centroid = b2Shape.PolyCentroid(poly->vertices, poly->vertexCount);
			b2Shape.PolyCentroid(poly.vertices, poly.vertexCount, b2PolyShape.tempVec);
			var centroidX = b2PolyShape.tempVec.x;
			var centroidY = b2PolyShape.tempVec.y;
			//this.m_localCentroid = def->localPosition + b2Mul(localR, centroid) - newOrigin;
			this.m_localCentroid.x = def.localPosition.x + (localR.col1.x * centroidX + localR.col2.x * centroidY) - newOrigin.x;
			this.m_localCentroid.y = def.localPosition.y + (localR.col1.y * centroidX + localR.col2.y * centroidY) - newOrigin.y;

			for (i = 0; i < this.m_vertexCount; ++i)
			{
				this.m_vertices[i] = new b2Vec2();
				this.m_coreVertices[i] = new b2Vec2();

				//this.m_vertices[i] = b2Mul(localR, poly->vertices[i] - centroid);
				hX = poly.vertices[i].x - centroidX;
				hY = poly.vertices[i].y - centroidY;
				this.m_vertices[i].x = localR.col1.x * hX + localR.col2.x * hY;
				this.m_vertices[i].y = localR.col1.y * hX + localR.col2.y * hY;

				//b2Vec2 u = this.m_vertices[i];
				var uX = this.m_vertices[i].x;
				var uY = this.m_vertices[i].y;
				//float32 length = u.Length();
				var length = Math.sqrt(uX*uX + uY*uY);
				if (length > Number.MIN_VALUE)
				{
					uX *= 1.0 / length;
					uY *= 1.0 / length;
				}

				//this.m_coreVertices[i] = this.m_vertices[i] - 2.0f * b2_linearSlop * u;
				this.m_coreVertices[i].x = this.m_vertices[i].x - 2.0 * b2Settings.b2_linearSlop * uX;
				this.m_coreVertices[i].y = this.m_vertices[i].y - 2.0 * b2Settings.b2_linearSlop * uY;
			}

		}

		// Compute bounding box. TODO_ERIN optimize OBB
		//var minVertex = new b2Vec2(Number.MAX_VALUE, Number.MAX_VALUE);
		var minVertexX = Number.MAX_VALUE;
		var minVertexY = Number.MAX_VALUE;
		var maxVertexX = -Number.MAX_VALUE;
		var maxVertexY = -Number.MAX_VALUE;
		this.m_maxRadius = 0.0;
		for (i = 0; i < this.m_vertexCount; ++i)
		{
			var v = this.m_vertices[i];
			//minVertex = b2Math.b2MinV(minVertex, this.m_vertices[i]);
			minVertexX = Math.min(minVertexX, v.x);
			minVertexY = Math.min(minVertexY, v.y);
			//maxVertex = b2Math.b2MaxV(maxVertex, this.m_vertices[i]);
			maxVertexX = Math.max(maxVertexX, v.x);
			maxVertexY = Math.max(maxVertexY, v.y);
			//this.m_maxRadius = b2Max(this.m_maxRadius, v.Length());
			this.m_maxRadius = Math.max(this.m_maxRadius, v.Length());
		}

		this.m_localOBB.R.SetIdentity();
		//this.m_localOBB.center = 0.5 * (minVertex + maxVertex);
		this.m_localOBB.center.Set((minVertexX + maxVertexX) * 0.5, (minVertexY + maxVertexY) * 0.5);
		//this.m_localOBB.extents = 0.5 * (maxVertex - minVertex);
		this.m_localOBB.extents.Set((maxVertexX - minVertexX) * 0.5, (maxVertexY - minVertexY) * 0.5);

		// Compute the edge normals and next index map.
		var i1 = 0;
		var i2 = 0;
		for (i = 0; i < this.m_vertexCount; ++i)
		{
			this.m_normals[i] =  new b2Vec2();
			i1 = i;
			i2 = i + 1 < this.m_vertexCount ? i + 1 : 0;
			//b2Vec2 edge = this.m_vertices[i2] - this.m_vertices[i1];
			//var edgeX = this.m_vertices[i2].x - this.m_vertices[i1].x;
			//var edgeY = this.m_vertices[i2].y - this.m_vertices[i1].y;
			//this.m_normals[i] = b2Cross(edge, 1.0f);
			this.m_normals[i].x = this.m_vertices[i2].y - this.m_vertices[i1].y;
			this.m_normals[i].y = -(this.m_vertices[i2].x - this.m_vertices[i1].x);
			this.m_normals[i].Normalize();
		}

		// Ensure the polygon in convex. TODO_ERIN compute convex hull.
		for (i = 0; i < this.m_vertexCount; ++i)
		{
			i1 = i;
			i2 = i + 1 < this.m_vertexCount ? i + 1 : 0;

			//b2Settings.b2Assert(b2Math.b2CrossVV(this.m_normals[i1], this.m_normals[i2]) > Number.MIN_VALUE);
		}

		this.m_R.SetM(this.m_body.m_R);
		//this.m_position.SetV( this.m_body.m_position  + b2Mul(this.m_body->this.m_R, this.m_localCentroid) );
		this.m_position.x = this.m_body.m_position.x + (this.m_R.col1.x * this.m_localCentroid.x + this.m_R.col2.x * this.m_localCentroid.y);
		this.m_position.y = this.m_body.m_position.y + (this.m_R.col1.y * this.m_localCentroid.x + this.m_R.col2.y * this.m_localCentroid.y);

		//var R = b2Math.b2MulMM(this.m_R, this.m_localOBB.R);
			//R.col1 = b2MulMV(this.m_R, this.m_localOBB.R.col1);
			b2PolyShape.tAbsR.col1.x = this.m_R.col1.x * this.m_localOBB.R.col1.x + this.m_R.col2.x * this.m_localOBB.R.col1.y;
			b2PolyShape.tAbsR.col1.y = this.m_R.col1.y * this.m_localOBB.R.col1.x + this.m_R.col2.y * this.m_localOBB.R.col1.y;
			//R.col2 = b2MulMV(this.m_R, this.m_localOBB.R.col2)
			b2PolyShape.tAbsR.col2.x = this.m_R.col1.x * this.m_localOBB.R.col2.x + this.m_R.col2.x * this.m_localOBB.R.col2.y;
			b2PolyShape.tAbsR.col2.y = this.m_R.col1.y * this.m_localOBB.R.col2.x + this.m_R.col2.y * this.m_localOBB.R.col2.y;
		//var absR = b2Math.b2AbsM(R);
		b2PolyShape.tAbsR.Abs()

		//h = b2Math.b2MulMV(b2PolyShape.tAbsR, this.m_localOBB.extents);
		hX = b2PolyShape.tAbsR.col1.x * this.m_localOBB.extents.x + b2PolyShape.tAbsR.col2.x * this.m_localOBB.extents.y;
		hY = b2PolyShape.tAbsR.col1.y * this.m_localOBB.extents.x + b2PolyShape.tAbsR.col2.y * this.m_localOBB.extents.y;

		//var position = this.m_position + b2Mul(this.m_R, this.m_localOBB.center);
		var positionX = this.m_position.x + (this.m_R.col1.x * this.m_localOBB.center.x + this.m_R.col2.x * this.m_localOBB.center.y);
		var positionY = this.m_position.y + (this.m_R.col1.y * this.m_localOBB.center.x + this.m_R.col2.y * this.m_localOBB.center.y);

		//aabb.minVertex = b2Math.SubtractVV(this.m_position, h);
		aabb.minVertex.x = positionX - hX;
		aabb.minVertex.y = positionY - hY;
		//aabb.maxVertex = b2Math.AddVV(this.m_position, h);
		aabb.maxVertex.x = positionX + hX;
		aabb.maxVertex.y = positionY + hY;

		var broadPhase = this.m_body.m_world.m_broadPhase;
		if (broadPhase.InRange(aabb))
		{
			this.m_proxyId = broadPhase.CreateProxy(aabb, this);
		}
		else
		{
			this.m_proxyId = b2Pair.b2_nullProxy;
		}

		if (this.m_proxyId == b2Pair.b2_nullProxy)
		{
			this.m_body.Freeze();
		}
	},

	// Temp AABB for Synch function
	syncAABB: new b2AABB(),
	syncMat: new b2Mat22(),
	Synchronize: function(position1, R1, position2, R2){
		// The body transform is copied for convenience.
		this.m_R.SetM(R2);
		//this.m_position = this.m_body->this.m_position + b2Mul(this.m_body->this.m_R, this.m_localCentroid)
		this.m_position.x = this.m_body.m_position.x + (R2.col1.x * this.m_localCentroid.x + R2.col2.x * this.m_localCentroid.y);
		this.m_position.y = this.m_body.m_position.y + (R2.col1.y * this.m_localCentroid.x + R2.col2.y * this.m_localCentroid.y);

		if (this.m_proxyId == b2Pair.b2_nullProxy)
		{
			return;
		}

		//b2AABB aabb1, aabb2;
		var hX;
		var hY;

		//b2Mat22 obbR = b2Mul(R1, this.m_localOBB.R);
			var v1 = R1.col1;
			var v2 = R1.col2;
			var v3 = this.m_localOBB.R.col1;
			var v4 = this.m_localOBB.R.col2;
			//this.syncMat.col1 = b2MulMV(R1, this.m_localOBB.R.col1);
			this.syncMat.col1.x = v1.x * v3.x + v2.x * v3.y;
			this.syncMat.col1.y = v1.y * v3.x + v2.y * v3.y;
			//this.syncMat.col2 = b2MulMV(R1, this.m_localOBB.R.col2);
			this.syncMat.col2.x = v1.x * v4.x + v2.x * v4.y;
			this.syncMat.col2.y = v1.y * v4.x + v2.y * v4.y;
		//b2Mat22 absR = b2Abs(obbR);
		this.syncMat.Abs();
		//b2Vec2 center = position1 + b2Mul(R1, this.m_localCentroid + this.m_localOBB.center);
		hX = this.m_localCentroid.x + this.m_localOBB.center.x;
		hY = this.m_localCentroid.y + this.m_localOBB.center.y;
		var centerX = position1.x + (R1.col1.x * hX + R1.col2.x * hY);
		var centerY = position1.y + (R1.col1.y * hX + R1.col2.y * hY);
		//b2Vec2 h = b2Mul(this.syncMat, this.m_localOBB.extents);
		hX = this.syncMat.col1.x * this.m_localOBB.extents.x + this.syncMat.col2.x * this.m_localOBB.extents.y;
		hY = this.syncMat.col1.y * this.m_localOBB.extents.x + this.syncMat.col2.y * this.m_localOBB.extents.y;
		//aabb1.minVertex = center - h;
		this.syncAABB.minVertex.x = centerX - hX;
		this.syncAABB.minVertex.y = centerY - hY;
		//aabb1.maxVertex = center + h;
		this.syncAABB.maxVertex.x = centerX + hX;
		this.syncAABB.maxVertex.y = centerY + hY;

		//b2Mat22 obbR = b2Mul(R2, this.m_localOBB.R);
			v1 = R2.col1;
			v2 = R2.col2;
			v3 = this.m_localOBB.R.col1;
			v4 = this.m_localOBB.R.col2;
			//this.syncMat.col1 = b2MulMV(R1, this.m_localOBB.R.col1);
			this.syncMat.col1.x = v1.x * v3.x + v2.x * v3.y;
			this.syncMat.col1.y = v1.y * v3.x + v2.y * v3.y;
			//this.syncMat.col2 = b2MulMV(R1, this.m_localOBB.R.col2);
			this.syncMat.col2.x = v1.x * v4.x + v2.x * v4.y;
			this.syncMat.col2.y = v1.y * v4.x + v2.y * v4.y;
		//b2Mat22 absR = b2Abs(obbR);
		this.syncMat.Abs();
		//b2Vec2 center = position2 + b2Mul(R2, this.m_localCentroid + this.m_localOBB.center);
		hX = this.m_localCentroid.x + this.m_localOBB.center.x;
		hY = this.m_localCentroid.y + this.m_localOBB.center.y;
		centerX = position2.x + (R2.col1.x * hX + R2.col2.x * hY);
		centerY = position2.y + (R2.col1.y * hX + R2.col2.y * hY);
		//b2Vec2 h = b2Mul(absR, this.m_localOBB.extents);
		hX = this.syncMat.col1.x * this.m_localOBB.extents.x + this.syncMat.col2.x * this.m_localOBB.extents.y;
		hY = this.syncMat.col1.y * this.m_localOBB.extents.x + this.syncMat.col2.y * this.m_localOBB.extents.y;
		//aabb2.minVertex = center - h;
		//aabb2.maxVertex = center + h;

		//aabb.minVertex = b2Min(aabb1.minVertex, aabb2.minVertex);
		this.syncAABB.minVertex.x = Math.min(this.syncAABB.minVertex.x, centerX - hX);
		this.syncAABB.minVertex.y = Math.min(this.syncAABB.minVertex.y, centerY - hY);
		//aabb.maxVertex = b2Max(aabb1.maxVertex, aabb2.maxVertex);
		this.syncAABB.maxVertex.x = Math.max(this.syncAABB.maxVertex.x, centerX + hX);
		this.syncAABB.maxVertex.y = Math.max(this.syncAABB.maxVertex.y, centerY + hY);

		var broadPhase = this.m_body.m_world.m_broadPhase;
		if (broadPhase.InRange(this.syncAABB))
		{
			broadPhase.MoveProxy(this.m_proxyId, this.syncAABB);
		}
		else
		{
			this.m_body.Freeze();
		}
	},

	QuickSync: function(position, R){
		//this.m_R = R;
		this.m_R.SetM(R);
		//this.m_position = position + b2Mul(R, this.m_localCentroid);
		this.m_position.x = position.x + (R.col1.x * this.m_localCentroid.x + R.col2.x * this.m_localCentroid.y);
		this.m_position.y = position.y + (R.col1.y * this.m_localCentroid.x + R.col2.y * this.m_localCentroid.y);
	},

	ResetProxy: function(broadPhase){

		if (this.m_proxyId == b2Pair.b2_nullProxy)
		{
			return;
		}

		var proxy = broadPhase.GetProxy(this.m_proxyId);

		broadPhase.DestroyProxy(this.m_proxyId);
		proxy = null;

		var R = b2Math.b2MulMM(this.m_R, this.m_localOBB.R);
		var absR = b2Math.b2AbsM(R);
		var h = b2Math.b2MulMV(absR, this.m_localOBB.extents);
		//var position = this.m_position + b2Mul(this.m_R, this.m_localOBB.center);
		var position = b2Math.b2MulMV(this.m_R, this.m_localOBB.center);
		position.Add(this.m_position);

		var aabb = new b2AABB();
		//aabb.minVertex = position - h;
		aabb.minVertex.SetV(position);
		aabb.minVertex.Subtract(h);
		//aabb.maxVertex = position + h;
		aabb.maxVertex.SetV(position);
		aabb.maxVertex.Add(h);

		if (broadPhase.InRange(aabb))
		{
			this.m_proxyId = broadPhase.CreateProxy(aabb, this);
		}
		else
		{
			this.m_proxyId = b2Pair.b2_nullProxy;
		}

		if (this.m_proxyId == b2Pair.b2_nullProxy)
		{
			this.m_body.Freeze();
		}
	},


	Support: function(dX, dY, out)
	{
		//b2Vec2 dLocal = b2MulT(this.m_R, d);
		var dLocalX = (dX*this.m_R.col1.x + dY*this.m_R.col1.y);
		var dLocalY = (dX*this.m_R.col2.x + dY*this.m_R.col2.y);

		var bestIndex = 0;
		//float32 bestValue = b2Dot(this.m_vertices[0], dLocal);
		var bestValue = (this.m_coreVertices[0].x * dLocalX + this.m_coreVertices[0].y * dLocalY);
		for (var i = 1; i < this.m_vertexCount; ++i)
		{
			//float32 value = b2Dot(this.m_vertices[i], dLocal);
			var value = (this.m_coreVertices[i].x * dLocalX + this.m_coreVertices[i].y * dLocalY);
			if (value > bestValue)
			{
				bestIndex = i;
				bestValue = value;
			}
		}

		//return this.m_position + b2Mul(this.m_R, this.m_vertices[bestIndex]);
		out.Set(	this.m_position.x + (this.m_R.col1.x * this.m_coreVertices[bestIndex].x + this.m_R.col2.x * this.m_coreVertices[bestIndex].y),
					this.m_position.y + (this.m_R.col1.y * this.m_coreVertices[bestIndex].x + this.m_R.col2.y * this.m_coreVertices[bestIndex].y));

	},


	// Local position of the shape centroid in parent body frame.
	m_localCentroid: new b2Vec2(),

	// Local position oriented bounding box. The OBB center is relative to
	// shape centroid.
	m_localOBB: new b2OBB(),
	m_vertices: null,
	m_coreVertices: null,
	m_vertexCount: 0,
	m_normals: null});

b2PolyShape.tempVec = new b2Vec2();
b2PolyShape.tAbsR = new b2Mat22();
