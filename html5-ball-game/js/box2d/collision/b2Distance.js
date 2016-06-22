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



var b2Distance = Class.create();
b2Distance.prototype = 
{

	// GJK using Voronoi regions (Christer Ericson) and region selection
	// optimizations (Casey Muratori).

	// The origin is either in the region of points[1] or in the edge region. The origin is
	// not in region of points[0] because that is the old point.

	// Possible regions:
	// - points[2]
	// - edge points[0]-points[2]
	// - edge points[1]-points[2]
	// - inside the triangle






	initialize: function() {}};
b2Distance.ProcessTwo = function(p1Out, p2Out, p1s, p2s, points)
	{
		// If in point[1] region
		//b2Vec2 r = -points[1];
		var rX = -points[1].x;
		var rY = -points[1].y;
		//b2Vec2 d = points[1] - points[0];
		var dX = points[0].x - points[1].x;
		var dY = points[0].y - points[1].y;
		//float32 length = d.Normalize();
		var length = Math.sqrt(dX*dX + dY*dY);
		dX /= length;
		dY /= length;

		//float32 lambda = b2Dot(r, d);
		var lambda = rX * dX + rY * dY;
		if (lambda <= 0.0 || length < Number.MIN_VALUE)
		{
			// The simplex is reduced to a point.
			//*p1Out = p1s[1];
			p1Out.SetV(p1s[1]);
			//*p2Out = p2s[1];
			p2Out.SetV(p2s[1]);
			//p1s[0] = p1s[1];
			p1s[0].SetV(p1s[1]);
			//p2s[0] = p2s[1];
			p2s[0].SetV(p2s[1]);
			points[0].SetV(points[1]);
			return 1;
		}

		// Else in edge region
		lambda /= length;
		//*p1Out = p1s[1] + lambda * (p1s[0] - p1s[1]);
		p1Out.x = p1s[1].x + lambda * (p1s[0].x - p1s[1].x);
		p1Out.y = p1s[1].y + lambda * (p1s[0].y - p1s[1].y);
		//*p2Out = p2s[1] + lambda * (p2s[0] - p2s[1]);
		p2Out.x = p2s[1].x + lambda * (p2s[0].x - p2s[1].x);
		p2Out.y = p2s[1].y + lambda * (p2s[0].y - p2s[1].y);
		return 2;
	};
b2Distance.ProcessThree = function(p1Out, p2Out, p1s, p2s, points)
	{
		//b2Vec2 a = points[0];
		var aX = points[0].x;
		var aY = points[0].y;
		//b2Vec2 b = points[1];
		var bX = points[1].x;
		var bY = points[1].y;
		//b2Vec2 c = points[2];
		var cX = points[2].x;
		var cY = points[2].y;

		//b2Vec2 ab = b - a;
		var abX = bX - aX;
		var abY = bY - aY;
		//b2Vec2 ac = c - a;
		var acX = cX - aX;
		var acY = cY - aY;
		//b2Vec2 bc = c - b;
		var bcX = cX - bX;
		var bcY = cY - bY;

		//float32 sn = -b2Dot(a, ab), sd = b2Dot(b, ab);
		var sn = -(aX * abX + aY * abY);
		var sd = (bX * abX + bY * abY);
		//float32 tn = -b2Dot(a, ac), td = b2Dot(c, ac);
		var tn = -(aX * acX + aY * acY);
		var td = (cX * acX + cY * acY);
		//float32 un = -b2Dot(b, bc), ud = b2Dot(c, bc);
		var un = -(bX * bcX + bY * bcY);
		var ud = (cX * bcX + cY * bcY);

		// In vertex c region?
		if (td <= 0.0 && ud <= 0.0)
		{
			// Single point
			//*p1Out = p1s[2];
			p1Out.SetV(p1s[2]);
			//*p2Out = p2s[2];
			p2Out.SetV(p2s[2]);
			//p1s[0] = p1s[2];
			p1s[0].SetV(p1s[2]);
			//p2s[0] = p2s[2];
			p2s[0].SetV(p2s[2]);
			points[0].SetV(points[2]);
			return 1;
		}

		// Should not be in vertex a or b region.
		//b2Settings.b2Assert(sn > 0.0 || tn > 0.0);
		//b2Settings.b2Assert(sd > 0.0 || un > 0.0);

		//float32 n = b2Cross(ab, ac);
		var n = abX * acY - abY * acX;

		// Should not be in edge ab region.
		//float32 vc = n * b2Cross(a, b);
		var vc = n * (aX * bY - aY * bX);
		//b2Settings.b2Assert(vc > 0.0 || sn > 0.0 || sd > 0.0);

		// In edge bc region?
		//float32 va = n * b2Cross(b, c);
		var va = n * (bX * cY - bY * cX);
		if (va <= 0.0 && un >= 0.0 && ud >= 0.0)
		{
			//b2Settings.b2Assert(un + ud > 0.0);

			//float32 lambda = un / (un + ud);
			var lambda = un / (un + ud);
			//*p1Out = p1s[1] + lambda * (p1s[2] - p1s[1]);
			p1Out.x = p1s[1].x + lambda * (p1s[2].x - p1s[1].x);
			p1Out.y = p1s[1].y + lambda * (p1s[2].y - p1s[1].y);
			//*p2Out = p2s[1] + lambda * (p2s[2] - p2s[1]);
			p2Out.x = p2s[1].x + lambda * (p2s[2].x - p2s[1].x);
			p2Out.y = p2s[1].y + lambda * (p2s[2].y - p2s[1].y);
			//p1s[0] = p1s[2];
			p1s[0].SetV(p1s[2]);
			//p2s[0] = p2s[2];
			p2s[0].SetV(p2s[2]);
			//points[0] = points[2];
			points[0].SetV(points[2]);
			return 2;
		}

		// In edge ac region?
		//float32 vb = n * b2Cross(c, a);
		var vb = n * (cX * aY - cY * aX);
		if (vb <= 0.0 && tn >= 0.0 && td >= 0.0)
		{
			//b2Settings.b2Assert(tn + td > 0.0);

			//float32 lambda = tn / (tn + td);
			var lambda = tn / (tn + td);
			//*p1Out = p1s[0] + lambda * (p1s[2] - p1s[0]);
			p1Out.x = p1s[0].x + lambda * (p1s[2].x - p1s[0].x);
			p1Out.y = p1s[0].y + lambda * (p1s[2].y - p1s[0].y);
			//*p2Out = p2s[0] + lambda * (p2s[2] - p2s[0]);
			p2Out.x = p2s[0].x + lambda * (p2s[2].x - p2s[0].x);
			p2Out.y = p2s[0].y + lambda * (p2s[2].y - p2s[0].y);
			//p1s[1] = p1s[2];
			p1s[1].SetV(p1s[2]);
			//p2s[1] = p2s[2];
			p2s[1].SetV(p2s[2]);
			//points[1] = points[2];
			points[1].SetV(points[2]);
			return 2;
		}

		// Inside the triangle, compute barycentric coordinates
		//float32 denom = va + vb + vc;
		var denom = va + vb + vc;
		//b2Settings.b2Assert(denom > 0.0);
		denom = 1.0 / denom;
		//float32 u = va * denom;
		var u = va * denom;
		//float32 v = vb * denom;
		var v = vb * denom;
		//float32 w = 1.0f - u - v;
		var w = 1.0 - u - v;
		//*p1Out = u * p1s[0] + v * p1s[1] + w * p1s[2];
		p1Out.x = u * p1s[0].x + v * p1s[1].x + w * p1s[2].x;
		p1Out.y = u * p1s[0].y + v * p1s[1].y + w * p1s[2].y;
		//*p2Out = u * p2s[0] + v * p2s[1] + w * p2s[2];
		p2Out.x = u * p2s[0].x + v * p2s[1].x + w * p2s[2].x;
		p2Out.y = u * p2s[0].y + v * p2s[1].y + w * p2s[2].y;
		return 3;
	};
b2Distance.InPoinsts = function(w, points, pointCount)
	{
		for (var i = 0; i < pointCount; ++i)
		{
			if (w.x == points[i].x && w.y == points[i].y)
			{
				return true;
			}
		}

		return false;
	};
b2Distance.Distance = function(p1Out, p2Out, shape1, shape2)
	{
		//b2Vec2 p1s[3], p2s[3];
		var p1s = new Array(3);
		var p2s = new Array(3);
		//b2Vec2 points[3];
		var points = new Array(3);
		//int32 pointCount = 0;
		var pointCount = 0;

		//*p1Out = shape1->m_position;
		p1Out.SetV(shape1.m_position);
		//*p2Out = shape2->m_position;
		p2Out.SetV(shape2.m_position);

		var vSqr = 0.0;
		var maxIterations = 20;
		for (var iter = 0; iter < maxIterations; ++iter)
		{
			//b2Vec2 v = *p2Out - *p1Out;
			var vX = p2Out.x - p1Out.x;
			var vY = p2Out.y - p1Out.y;
			//b2Vec2 w1 = shape1->Support(v);
			var w1 = shape1.Support(vX, vY);
			//b2Vec2 w2 = shape2->Support(-v);
			var w2 = shape2.Support(-vX, -vY);
			//float32 vSqr = b2Dot(v, v);
			vSqr = (vX*vX + vY*vY);
			//b2Vec2 w = w2 - w1;
			var wX = w2.x - w1.x;
			var wY = w2.y - w1.y;
			//float32 vw = b2Dot(v, w);
			var vw = (vX*wX + vY*wY);
			//if (vSqr - b2Dot(v, w) <= 0.01f * vSqr)
			if (vSqr - b2Dot(vX * wX + vY * wY) <= 0.01 * vSqr)
			{
				if (pointCount == 0)
				{
					//*p1Out = w1;
					p1Out.SetV(w1);
					//*p2Out = w2;
					p2Out.SetV(w2);
				}
				b2Distance.g_GJK_Iterations = iter;
				return Math.sqrt(vSqr);
			}

			switch (pointCount)
			{
			case 0:
				//p1s[0] = w1;
				p1s[0].SetV(w1);
				//p2s[0] = w2;
				p2s[0].SetV(w2);
				points[0] = w;
				//*p1Out = p1s[0];
				p1Out.SetV(p1s[0]);
				//*p2Out = p2s[0];
				p2Out.SetV(p2s[0]);
				++pointCount;
				break;

			case 1:
				//p1s[1] = w1;
				p1s[1].SetV(w1);
				//p2s[1] = w2;
				p2s[1].SetV(w2);
				//points[1] = w;
				points[1].x = wX;
				points[1].y = wY;
				pointCount = b2Distance.ProcessTwo(p1Out, p2Out, p1s, p2s, points);
				break;

			case 2:
				//p1s[2] = w1;
				p1s[2].SetV(w1);
				//p2s[2] = w2;
				p2s[2].SetV(w2);
				//points[2] = w;
				points[2].x = wX;
				points[2].y = wY;
				pointCount = b2Distance.ProcessThree(p1Out, p2Out, p1s, p2s, points);
				break;
			}

			// If we have three points, then the origin is in the corresponding triangle.
			if (pointCount == 3)
			{
				b2Distance.g_GJK_Iterations = iter;
				return 0.0;
			}

			//float32 maxSqr = -FLT_MAX;
			var maxSqr = -Number.MAX_VALUE;
			for (var i = 0; i < pointCount; ++i)
			{
				//maxSqr = b2Math.b2Max(maxSqr, b2Dot(points[i], points[i]));
				maxSqr = b2Math.b2Max(maxSqr, (points[i].x*points[i].x + points[i].y*points[i].y));
			}

			if (pointCount == 3 || vSqr <= 100.0 * Number.MIN_VALUE * maxSqr)
			{
				b2Distance.g_GJK_Iterations = iter;
				return Math.sqrt(vSqr);
			}
		}

		b2Distance.g_GJK_Iterations = maxIterations;
		return Math.sqrt(vSqr);
	};
b2Distance.g_GJK_Iterations = 0;
