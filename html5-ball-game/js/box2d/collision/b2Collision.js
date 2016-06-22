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




var b2Collision = Class.create();
b2Collision.prototype = {

	// Null feature




	// Find the separation between poly1 and poly2 for a give edge normal on poly1.




	// Find the max separation between poly1 and poly2 using edge normals
	// from poly1.







	// Find edge normal of max separation on A - return if separating axis is found
	// Find edge normal of max separation on B - return if separation axis is found
	// Choose reference edge(minA, minB)
	// Find incident edge
	// Clip
	// The normal points from 1 to 2















	initialize: function() {}}
b2Collision.b2_nullFeature = 0x000000ff;
b2Collision.ClipSegmentToLine = function(vOut, vIn, normal, offset)
	{
		// Start with no output points
		var numOut = 0;

		var vIn0 = vIn[0].v;
		var vIn1 = vIn[1].v;

		// Calculate the distance of end points to the line
		var distance0 = b2Math.b2Dot(normal, vIn[0].v) - offset;
		var distance1 = b2Math.b2Dot(normal, vIn[1].v) - offset;

		// If the points are behind the plane
		if (distance0 <= 0.0) vOut[numOut++] = vIn[0];
		if (distance1 <= 0.0) vOut[numOut++] = vIn[1];

		// If the points are on different sides of the plane
		if (distance0 * distance1 < 0.0)
		{
			// Find intersection point of edge and plane
			var interp = distance0 / (distance0 - distance1);
			// expanded for performance
			var tVec = vOut[numOut].v;
			tVec.x = vIn0.x + interp * (vIn1.x - vIn0.x);
			tVec.y = vIn0.y + interp * (vIn1.y - vIn0.y);
			if (distance0 > 0.0)
			{
				vOut[numOut].id = vIn[0].id;
			}
			else
			{
				vOut[numOut].id = vIn[1].id;
			}
			++numOut;
		}

		return numOut;
	};
b2Collision.EdgeSeparation = function(poly1, edge1, poly2)
	{
		var vert1s = poly1.m_vertices;
		var count2 = poly2.m_vertexCount;
		var vert2s = poly2.m_vertices;

		// Convert normal from into poly2's frame.
		//b2Settings.b2Assert(edge1 < poly1.m_vertexCount);

		//var normal = b2Math.b2MulMV(poly1.m_R, poly1->m_normals[edge1]);
		var normalX = poly1.m_normals[edge1].x;
		var normalY = poly1.m_normals[edge1].y;
		var tX = normalX;
		var tMat = poly1.m_R;
		normalX = tMat.col1.x * tX + tMat.col2.x * normalY;
		normalY = tMat.col1.y * tX + tMat.col2.y * normalY;
		// ^^^^^^^ normal.MulM(poly1.m_R);

		//var normalLocal2 = b2Math.b2MulTMV(poly2.m_R, normal);
		var normalLocal2X = normalX;
		var normalLocal2Y = normalY;
		tMat = poly2.m_R;
		tX = normalLocal2X * tMat.col1.x + normalLocal2Y * tMat.col1.y;
		normalLocal2Y = normalLocal2X * tMat.col2.x + normalLocal2Y * tMat.col2.y;
		normalLocal2X = tX;
		// ^^^^^ normalLocal2.MulTM(poly2.m_R);

		// Find support vertex on poly2 for -normal.
		var vertexIndex2 = 0;
		var minDot = Number.MAX_VALUE;
		for (var i = 0; i < count2; ++i)
		{
			//var dot = b2Math.b2Dot(vert2s[i], normalLocal2);
			var tVec = vert2s[i];
			var dot = tVec.x * normalLocal2X + tVec.y * normalLocal2Y;
			if (dot < minDot)
			{
				minDot = dot;
				vertexIndex2 = i;
			}
		}

		//b2Vec2 v1 = poly1->m_position + b2Mul(poly1->m_R, vert1s[edge1]);
		tMat = poly1.m_R;
		var v1X = poly1.m_position.x + (tMat.col1.x * vert1s[edge1].x + tMat.col2.x * vert1s[edge1].y)
		var v1Y = poly1.m_position.y + (tMat.col1.y * vert1s[edge1].x + tMat.col2.y * vert1s[edge1].y)

		//b2Vec2 v2 = poly2->m_position + b2Mul(poly2->m_R, vert2s[vertexIndex2]);
		tMat = poly2.m_R;
		var v2X = poly2.m_position.x + (tMat.col1.x * vert2s[vertexIndex2].x + tMat.col2.x * vert2s[vertexIndex2].y)
		var v2Y = poly2.m_position.y + (tMat.col1.y * vert2s[vertexIndex2].x + tMat.col2.y * vert2s[vertexIndex2].y)

		//var separation = b2Math.b2Dot( b2Math.SubtractVV( v2, v1 ) , normal);
		v2X -= v1X;
		v2Y -= v1Y;
		//var separation = b2Math.b2Dot( v2 , normal);
		var separation = v2X * normalX + v2Y * normalY;
		return separation;
	};
b2Collision.FindMaxSeparation = function(edgeIndex /*int ptr*/, poly1, poly2, conservative)
	{
		var count1 = poly1.m_vertexCount;

		// Vector pointing from the origin of poly1 to the origin of poly2.
		//var d = b2Math.SubtractVV( poly2.m_position, poly1.m_position );
		var dX = poly2.m_position.x - poly1.m_position.x;
		var dY = poly2.m_position.y - poly1.m_position.y;

		//var dLocal1 = b2Math.b2MulTMV(poly1.m_R, d);
		var dLocal1X = (dX * poly1.m_R.col1.x + dY * poly1.m_R.col1.y);
		var dLocal1Y = (dX * poly1.m_R.col2.x + dY * poly1.m_R.col2.y);

		// Get support vertex hint for our search
		var edge = 0;
		var maxDot = -Number.MAX_VALUE;
		for (var i = 0; i < count1; ++i)
		{
			//var dot = b2Math.b2Dot(poly.m_normals[i], dLocal1);
			var dot = (poly1.m_normals[i].x * dLocal1X + poly1.m_normals[i].y * dLocal1Y);
			if (dot > maxDot)
			{
				maxDot = dot;
				edge = i;
			}
		}

		// Get the separation for the edge normal.
		var s = b2Collision.EdgeSeparation(poly1, edge, poly2);
		if (s > 0.0 && conservative == false)
		{
			return s;
		}

		// Check the separation for the neighboring edges.
		var prevEdge = edge - 1 >= 0 ? edge - 1 : count1 - 1;
		var sPrev = b2Collision.EdgeSeparation(poly1, prevEdge, poly2);
		if (sPrev > 0.0 && conservative == false)
		{
			return sPrev;
		}

		var nextEdge = edge + 1 < count1 ? edge + 1 : 0;
		var sNext = b2Collision.EdgeSeparation(poly1, nextEdge, poly2);
		if (sNext > 0.0 && conservative == false)
		{
			return sNext;
		}

		// Find the best edge and the search direction.
		var bestEdge = 0;
		var bestSeparation;
		var increment = 0;
		if (sPrev > s && sPrev > sNext)
		{
			increment = -1;
			bestEdge = prevEdge;
			bestSeparation = sPrev;
		}
		else if (sNext > s)
		{
			increment = 1;
			bestEdge = nextEdge;
			bestSeparation = sNext;
		}
		else
		{
			// pointer out
			edgeIndex[0] = edge;
			return s;
		}

		while (true)
		{

			if (increment == -1)
				edge = bestEdge - 1 >= 0 ? bestEdge - 1 : count1 - 1;
			else
				edge = bestEdge + 1 < count1 ? bestEdge + 1 : 0;

			s = b2Collision.EdgeSeparation(poly1, edge, poly2);
			if (s > 0.0 && conservative == false)
			{
				return s;
			}

			if (s > bestSeparation)
			{
				bestEdge = edge;
				bestSeparation = s;
			}
			else
			{
				break;
			}
		}

		// pointer out
		edgeIndex[0] = bestEdge;
		return bestSeparation;
	};
b2Collision.FindIncidentEdge = function(c, poly1, edge1, poly2)
	{
		var count1 = poly1.m_vertexCount;
		var vert1s = poly1.m_vertices;
		var count2 = poly2.m_vertexCount;
		var vert2s = poly2.m_vertices;

		// Get the vertices associated with edge1.
		var vertex11 = edge1;
		var vertex12 = edge1 + 1 == count1 ? 0 : edge1 + 1;

		// Get the normal of edge1.
		var tVec = vert1s[vertex12];
		//var normal1Local1 = b2Math.b2CrossVF( b2Math.SubtractVV( vert1s[vertex12], vert1s[vertex11] ), 1.0);
		var normal1Local1X = tVec.x;
		var normal1Local1Y = tVec.y;
		tVec = vert1s[vertex11];
		normal1Local1X -= tVec.x;
		normal1Local1Y -= tVec.y;
		var tX = normal1Local1X;
		normal1Local1X = normal1Local1Y;
		normal1Local1Y = -tX;
		// ^^^^ normal1Local1.CrossVF(1.0);

		var invLength = 1.0 / Math.sqrt(normal1Local1X*normal1Local1X + normal1Local1Y*normal1Local1Y);
		normal1Local1X *= invLength;
		normal1Local1Y *= invLength;
		// ^^^^normal1Local1.Normalize();
		//var normal1 = b2Math.b2MulMV(poly1.m_R, normal1Local1);
		var normal1X = normal1Local1X;
		var normal1Y = normal1Local1Y;

		tX = normal1X;
		var tMat = poly1.m_R;
		normal1X = tMat.col1.x * tX + tMat.col2.x * normal1Y;
		normal1Y = tMat.col1.y * tX + tMat.col2.y * normal1Y;
		// ^^^^ normal1.MulM(poly1.m_R);

		//var normal1Local2 = b2Math.b2MulTMV(poly2.m_R, normal1);
		var normal1Local2X = normal1X;
		var normal1Local2Y = normal1Y;
		tMat = poly2.m_R;
		tX = normal1Local2X * tMat.col1.x + normal1Local2Y * tMat.col1.y;
		normal1Local2Y = normal1Local2X * tMat.col2.x + normal1Local2Y * tMat.col2.y;
		normal1Local2X = tX;
		// ^^^^ normal1Local2.MulTM(poly2.m_R);

		// Find the incident edge on poly2.
		var vertex21 = 0;
		var vertex22 = 0;
		var minDot = Number.MAX_VALUE;
		for (var i = 0; i < count2; ++i)
		{
			var i1 = i;
			var i2 = i + 1 < count2 ? i + 1 : 0;

			//var normal2Local2 = b2Math.b2CrossVF( b2Math.SubtractVV( vert2s[i2], vert2s[i1] ), 1.0);
			tVec = vert2s[i2];
			var normal2Local2X = tVec.x;
			var normal2Local2Y = tVec.y;
			tVec = vert2s[i1];
			normal2Local2X -= tVec.x;
			normal2Local2Y -= tVec.y;
			tX = normal2Local2X;
			normal2Local2X = normal2Local2Y;
			normal2Local2Y = -tX;
			// ^^^^ normal2Local2.CrossVF(1.0);

			invLength = 1.0 / Math.sqrt(normal2Local2X*normal2Local2X + normal2Local2Y*normal2Local2Y);
			normal2Local2X *= invLength;
			normal2Local2Y *= invLength;
			// ^^^^ normal2Local2.Normalize();

			//var dot = b2Math.b2Dot(normal2Local2, normal1Local2);
			var dot = normal2Local2X * normal1Local2X + normal2Local2Y * normal1Local2Y;
			if (dot < minDot)
			{
				minDot = dot;
				vertex21 = i1;
				vertex22 = i2;
			}
		}

		var tClip;
		// Build the clip vertices for the incident edge.
		tClip = c[0];
		//tClip.v = b2Math.AddVV(poly2.m_position, b2Math.b2MulMV(poly2.m_R, vert2s[vertex21]));
		tVec = tClip.v;
		tVec.SetV(vert2s[vertex21]);
		tVec.MulM(poly2.m_R);
		tVec.Add(poly2.m_position);

		tClip.id.features.referenceFace = edge1;
		tClip.id.features.incidentEdge = vertex21;
		tClip.id.features.incidentVertex = vertex21;

		tClip = c[1];
		//tClip.v = b2Math.AddVV(poly2.m_position, b2Math.b2MulMV(poly2.m_R, vert2s[vertex22]));
		tVec = tClip.v;
		tVec.SetV(vert2s[vertex22]);
		tVec.MulM(poly2.m_R);
		tVec.Add(poly2.m_position);
		tClip.id.features.referenceFace = edge1;
		tClip.id.features.incidentEdge = vertex21;
		tClip.id.features.incidentVertex = vertex22;
	};
b2Collision.b2CollidePolyTempVec = new b2Vec2();
b2Collision.b2CollidePoly = function(manifold, polyA, polyB, conservative)
	{
		manifold.pointCount = 0;

		var edgeA = 0;
		var edgeAOut = [edgeA];
		var separationA = b2Collision.FindMaxSeparation(edgeAOut, polyA, polyB, conservative);
		edgeA = edgeAOut[0];
		if (separationA > 0.0 && conservative == false)
			return;

		var edgeB = 0;
		var edgeBOut = [edgeB];
		var separationB = b2Collision.FindMaxSeparation(edgeBOut, polyB, polyA, conservative);
		edgeB = edgeBOut[0];
		if (separationB > 0.0 && conservative == false)
			return;

		var poly1;
		var poly2;
		var edge1 = 0;
		var flip = 0;
		var k_relativeTol = 0.98;
		var k_absoluteTol = 0.001;

		// TODO_ERIN use "radius" of poly for absolute tolerance.
		if (separationB > k_relativeTol * separationA + k_absoluteTol)
		{
			poly1 = polyB;
			poly2 = polyA;
			edge1 = edgeB;
			flip = 1;
		}
		else
		{
			poly1 = polyA;
			poly2 = polyB;
			edge1 = edgeA;
			flip = 0;
		}

		var incidentEdge = [new ClipVertex(), new ClipVertex()];
		b2Collision.FindIncidentEdge(incidentEdge, poly1, edge1, poly2);

		var count1 = poly1.m_vertexCount;
		var vert1s = poly1.m_vertices;

		var v11 = vert1s[edge1];
		var v12 = edge1 + 1 < count1 ? vert1s[edge1+1] : vert1s[0];

		//var dv = b2Math.SubtractVV(v12, v11);
		var dvX = v12.x - v11.x;
		var dvY = v12.y - v11.y;

		//var sideNormal = b2Math.b2MulMV(poly1.m_R, b2Math.SubtractVV(v12, v11));
		var sideNormalX = v12.x - v11.x;
		var sideNormalY = v12.y - v11.y;

		var tX = sideNormalX;
		var tMat = poly1.m_R;
		sideNormalX = tMat.col1.x * tX + tMat.col2.x * sideNormalY;
		sideNormalY = tMat.col1.y * tX + tMat.col2.y * sideNormalY;
		// ^^^^ sideNormal.MulM(poly1.m_R);

		var invLength = 1.0 / Math.sqrt(sideNormalX*sideNormalX + sideNormalY*sideNormalY);
		sideNormalX *= invLength;
		sideNormalY *= invLength;
		// ^^^^ sideNormal.Normalize();

		//var frontNormal = b2Math.b2CrossVF(sideNormal, 1.0);
		var frontNormalX = sideNormalX;
		var frontNormalY = sideNormalY;
		tX = frontNormalX;
		frontNormalX = frontNormalY;
		frontNormalY = -tX;
		// ^^^^ frontNormal.CrossVF(1.0);

		// Expanded for performance
		//v11 = b2Math.AddVV(poly1.m_position, b2Math.b2MulMV(poly1.m_R, v11));
		var v11X = v11.x;
		var v11Y = v11.y;
		tX = v11X;
		tMat = poly1.m_R;
		v11X = tMat.col1.x * tX + tMat.col2.x * v11Y;
		v11Y = tMat.col1.y * tX + tMat.col2.y * v11Y;
		// ^^^^ v11.MulM(poly1.m_R);
		v11X += poly1.m_position.x;
		v11Y += poly1.m_position.y;
		//v12 = b2Math.AddVV(poly1.m_position, b2Math.b2MulMV(poly1.m_R, v12));
		var v12X = v12.x;
		var v12Y = v12.y;
		tX = v12X;
		tMat = poly1.m_R;
		v12X = tMat.col1.x * tX + tMat.col2.x * v12Y;
		v12Y = tMat.col1.y * tX + tMat.col2.y * v12Y;
		// ^^^^ v12.MulM(poly1.m_R);
		v12X += poly1.m_position.x;
		v12Y += poly1.m_position.y;

		//var frontOffset = b2Math.b2Dot(frontNormal, v11);
		var frontOffset = frontNormalX * v11X + frontNormalY * v11Y;
		//var sideOffset1 = -b2Math.b2Dot(sideNormal, v11);
		var sideOffset1 = -(sideNormalX * v11X + sideNormalY * v11Y);
		//var sideOffset2 = b2Math.b2Dot(sideNormal, v12);
		var sideOffset2 = sideNormalX * v12X + sideNormalY * v12Y;

		// Clip incident edge against extruded edge1 side edges.
		var clipPoints1 = [new ClipVertex(), new ClipVertex()];
		var clipPoints2 = [new ClipVertex(), new ClipVertex()];

		var np = 0;

		// Clip to box side 1
		b2Collision.b2CollidePolyTempVec.Set(-sideNormalX, -sideNormalY);
		np = b2Collision.ClipSegmentToLine(clipPoints1, incidentEdge, b2Collision.b2CollidePolyTempVec, sideOffset1);

		if (np < 2)
			return;

		// Clip to negative box side 1
		b2Collision.b2CollidePolyTempVec.Set(sideNormalX, sideNormalY);
		np = b2Collision.ClipSegmentToLine(clipPoints2, clipPoints1,  b2Collision.b2CollidePolyTempVec, sideOffset2);

		if (np < 2)
			return;

		// Now clipPoints2 contains the clipped points.
		if (flip){
			manifold.normal.Set(-frontNormalX, -frontNormalY);
		}
		else{
			manifold.normal.Set(frontNormalX, frontNormalY);
		}
		// ^^^^ manifold.normal = flip ? frontNormal.Negative() : frontNormal;

		var pointCount = 0;
		for (var i = 0; i < b2Settings.b2_maxManifoldPoints; ++i)
		{
			//var separation = b2Math.b2Dot(frontNormal, clipPoints2[i].v) - frontOffset;
			var tVec = clipPoints2[i].v;
			var separation = (frontNormalX * tVec.x + frontNormalY * tVec.y) - frontOffset;

			if (separation <= 0.0 || conservative == true)
			{
				var cp = manifold.points[ pointCount ];
				cp.separation = separation;
				cp.position.SetV( clipPoints2[i].v );
				cp.id.Set( clipPoints2[i].id );
				cp.id.features.flip = flip;
				++pointCount;
			}
		}

		manifold.pointCount = pointCount;
	};
b2Collision.b2CollideCircle = function(manifold, circle1, circle2, conservative)
	{
		manifold.pointCount = 0;

		//var d = b2Math.SubtractVV(circle2.m_position, circle1.m_position);
		var dX = circle2.m_position.x - circle1.m_position.x;
		var dY = circle2.m_position.y - circle1.m_position.y;
		//var distSqr = b2Math.b2Dot(d, d);
		var distSqr = dX * dX + dY * dY;
		var radiusSum = circle1.m_radius + circle2.m_radius;
		if (distSqr > radiusSum * radiusSum && conservative == false)
		{
			return;
		}

		var separation;
		if (distSqr < Number.MIN_VALUE)
		{
			separation = -radiusSum;
			manifold.normal.Set(0.0, 1.0);
		}
		else
		{
			var dist = Math.sqrt(distSqr);
			separation = dist - radiusSum;
			var a = 1.0 / dist;
			manifold.normal.x = a * dX;
			manifold.normal.y = a * dY;
		}

		manifold.pointCount = 1;
		var tPoint = manifold.points[0];
		tPoint.id.set_key(0);
		tPoint.separation = separation;
		//tPoint.position = b2Math.SubtractVV(circle2.m_position, b2Math.MulFV(circle2.m_radius, manifold.normal));
		tPoint.position.x = circle2.m_position.x - (circle2.m_radius * manifold.normal.x);
		tPoint.position.y = circle2.m_position.y - (circle2.m_radius * manifold.normal.y);
	};
b2Collision.b2CollidePolyAndCircle = function(manifold, poly, circle, conservative)
	{
		manifold.pointCount = 0;
		var tPoint;

		var dX;
		var dY;

		// Compute circle position in the frame of the polygon.
		//var xLocal = b2Math.b2MulTMV(poly.m_R, b2Math.SubtractVV(circle.m_position, poly.m_position));
		var xLocalX = circle.m_position.x - poly.m_position.x;
		var xLocalY = circle.m_position.y - poly.m_position.y;
		var tMat = poly.m_R;
		var tX = xLocalX * tMat.col1.x + xLocalY * tMat.col1.y;
		xLocalY = xLocalX * tMat.col2.x + xLocalY * tMat.col2.y;
		xLocalX = tX;

		var dist;

		// Find the min separating edge.
		var normalIndex = 0;
		var separation = -Number.MAX_VALUE;
		var radius = circle.m_radius;
		for (var i = 0; i < poly.m_vertexCount; ++i)
		{
			//var s = b2Math.b2Dot(poly.m_normals[i], b2Math.SubtractVV(xLocal, poly.m_vertices[i]));
			var s = poly.m_normals[i].x * (xLocalX-poly.m_vertices[i].x) + poly.m_normals[i].y * (xLocalY-poly.m_vertices[i].y);
			if (s > radius)
			{
				// Early out.
				return;
			}

			if (s > separation)
			{
				separation = s;
				normalIndex = i;
			}
		}

		// If the center is inside the polygon ...
		if (separation < Number.MIN_VALUE)
		{
			manifold.pointCount = 1;
			//manifold.normal = b2Math.b2MulMV(poly.m_R, poly.m_normals[normalIndex]);
			var tVec = poly.m_normals[normalIndex];
			manifold.normal.x = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
			manifold.normal.y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;

			tPoint = manifold.points[0];
			tPoint.id.features.incidentEdge = normalIndex;
			tPoint.id.features.incidentVertex = b2Collision.b2_nullFeature;
			tPoint.id.features.referenceFace = b2Collision.b2_nullFeature;
			tPoint.id.features.flip = 0;
			tPoint.position.x = circle.m_position.x - radius * manifold.normal.x;
			tPoint.position.y = circle.m_position.y - radius * manifold.normal.y;
			//tPoint.position = b2Math.SubtractVV(circle.m_position , b2Math.MulFV(radius , manifold.normal));
			tPoint.separation = separation - radius;
			return;
		}

		// Project the circle center onto the edge segment.
		var vertIndex1 = normalIndex;
		var vertIndex2 = vertIndex1 + 1 < poly.m_vertexCount ? vertIndex1 + 1 : 0;
		//var e = b2Math.SubtractVV(poly.m_vertices[vertIndex2] , poly.m_vertices[vertIndex1]);
		var eX = poly.m_vertices[vertIndex2].x - poly.m_vertices[vertIndex1].x;
		var eY = poly.m_vertices[vertIndex2].y - poly.m_vertices[vertIndex1].y;
		//var length = e.Normalize();
		var length = Math.sqrt(eX*eX + eY*eY);
		eX /= length;
		eY /= length;

		// If the edge length is zero ...
		if (length < Number.MIN_VALUE)
		{
			//d = b2Math.SubtractVV(xLocal , poly.m_vertices[vertIndex1]);
			dX = xLocalX - poly.m_vertices[vertIndex1].x;
			dY = xLocalY - poly.m_vertices[vertIndex1].y;
			//dist = d.Normalize();
			dist = Math.sqrt(dX*dX + dY*dY);
			dX /= dist;
			dY /= dist;
			if (dist > radius)
			{
				return;
			}

			manifold.pointCount = 1;
			//manifold.normal = b2Math.b2MulMV(poly.m_R, d);
			manifold.normal.Set(tMat.col1.x * dX + tMat.col2.x * dY, tMat.col1.y * dX + tMat.col2.y * dY);
			tPoint = manifold.points[0];
			tPoint.id.features.incidentEdge = b2Collision.b2_nullFeature;
			tPoint.id.features.incidentVertex = vertIndex1;
			tPoint.id.features.referenceFace = b2Collision.b2_nullFeature;
			tPoint.id.features.flip = 0;
			//tPoint.position = b2Math.SubtractVV(circle.m_position , b2Math.MulFV(radius , manifold.normal));
			tPoint.position.x = circle.m_position.x - radius * manifold.normal.x;
			tPoint.position.y = circle.m_position.y - radius * manifold.normal.y;
			tPoint.separation = dist - radius;
			return;
		}

		// Project the center onto the edge.
		//var u = b2Math.b2Dot(b2Math.SubtractVV(xLocal , poly.m_vertices[vertIndex1]) , e);
		var u = (xLocalX-poly.m_vertices[vertIndex1].x) * eX + (xLocalY-poly.m_vertices[vertIndex1].y) * eY;

		tPoint = manifold.points[0];
		tPoint.id.features.incidentEdge = b2Collision.b2_nullFeature;
		tPoint.id.features.incidentVertex = b2Collision.b2_nullFeature;
		tPoint.id.features.referenceFace = b2Collision.b2_nullFeature;
		tPoint.id.features.flip = 0;

		var pX, pY;
		if (u <= 0.0)
		{
			pX = poly.m_vertices[vertIndex1].x;
			pY = poly.m_vertices[vertIndex1].y;
			tPoint.id.features.incidentVertex = vertIndex1;
		}
		else if (u >= length)
		{
			pX = poly.m_vertices[vertIndex2].x;
			pY = poly.m_vertices[vertIndex2].y;
			tPoint.id.features.incidentVertex = vertIndex2;
		}
		else
		{
			//p = b2Math.AddVV(poly.m_vertices[vertIndex1] , b2Math.MulFV(u, e));
			pX = eX * u + poly.m_vertices[vertIndex1].x;
			pY = eY * u + poly.m_vertices[vertIndex1].y;
			tPoint.id.features.incidentEdge = vertIndex1;
		}

		//d = b2Math.SubtractVV(xLocal , p);
		dX = xLocalX - pX;
		dY = xLocalY - pY;
		//dist = d.Normalize();
		dist = Math.sqrt(dX*dX + dY*dY);
		dX /= dist;
		dY /= dist;
		if (dist > radius)
		{
			return;
		}

		manifold.pointCount = 1;
		//manifold.normal = b2Math.b2MulMV(poly.m_R, d);
		manifold.normal.Set(tMat.col1.x * dX + tMat.col2.x * dY, tMat.col1.y * dX + tMat.col2.y * dY);
		//tPoint.position = b2Math.SubtractVV(circle.m_position , b2Math.MulFV(radius , manifold.normal));
		tPoint.position.x = circle.m_position.x - radius * manifold.normal.x;
		tPoint.position.y = circle.m_position.y - radius * manifold.normal.y;
		tPoint.separation = dist - radius;
	};
b2Collision.b2TestOverlap = function(a, b)
	{
		var t1 = b.minVertex;
		var t2 = a.maxVertex;
		//d1 = b2Math.SubtractVV(b.minVertex, a.maxVertex);
		var d1X = t1.x - t2.x;
		var d1Y = t1.y - t2.y;
		//d2 = b2Math.SubtractVV(a.minVertex, b.maxVertex);
		t1 = a.minVertex;
		t2 = b.maxVertex;
		var d2X = t1.x - t2.x;
		var d2Y = t1.y - t2.y;

		if (d1X > 0.0 || d1Y > 0.0)
			return false;

		if (d2X > 0.0 || d2Y > 0.0)
			return false;

		return true;
	};
