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





var b2Conservative = Class.create();
b2Conservative.prototype = {

	// Temp vars



	initialize: function() {}}
b2Conservative.R1 = new b2Mat22();
b2Conservative.R2 = new b2Mat22();
b2Conservative.x1 = new b2Vec2();
b2Conservative.x2 = new b2Vec2();
b2Conservative.Conservative = function(shape1, shape2){
		var body1 = shape1.GetBody();
		var body2 = shape2.GetBody();

		//b2Vec2 v1 = body1->m_position - body1->m_position0;
		var v1X = body1.m_position.x - body1.m_position0.x;
		var v1Y = body1.m_position.y - body1.m_position0.y;
		//float32 omega1 = body1->m_rotation - body1->m_rotation0;
		var omega1 = body1.m_rotation - body1.m_rotation0;
		//b2Vec2 v2 = body2->m_position - body2->m_position0;
		var v2X = body2.m_position.x - body2.m_position0.x;
		var v2Y = body2.m_position.y - body2.m_position0.y;
		//float32 omega2 = body2->m_rotation - body2->m_rotation0;
		var omega2 = body2.m_rotation - body2.m_rotation0;

		//float32 r1 = shape1->GetMaxRadius();
		var r1 = shape1.GetMaxRadius();
		//float32 r2 = shape2->GetMaxRadius();
		var r2 = shape2.GetMaxRadius();

		//b2Vec2 p1Start = body1->m_position0;
		var p1StartX = body1.m_position0.x;
		var p1StartY = body1.m_position0.y;
		//float32 a1Start = body1->m_rotation0;
		var a1Start = body1.m_rotation0;

		//b2Vec2 p2Start = body2->m_position0;
		var p2StartX = body2.m_position0.x;
		var p2StartY = body2.m_position0.y;
		//float32 a2Start = body2->m_rotation0;
		var a2Start = body2.m_rotation0;

		//b2Vec2 p1 = p1Start;
		var p1X = p1StartX;
		var p1Y = p1StartY;
		//float32 a1 = a1Start;
		var a1 = a1Start;
		//b2Vec2 p2 = p2Start;
		var p2X = p2StartX;
		var p2Y = p2StartY;
		//float32 a2 = a2Start;
		var a2 = a2Start;

		//b2Mat22 b2Conservative.R1(a1), b2Conservative.R2(a2);
		b2Conservative.R1.Set(a1);
		b2Conservative.R2.Set(a2);

		//shape1->QuickSync(p1, b2Conservative.R1);
		shape1.QuickSync(p1, b2Conservative.R1);
		//shape2->QuickSync(p2, b2Conservative.R2);
		shape2.QuickSync(p2, b2Conservative.R2);

		//float32 s1 = 0.0f;
		var s1 = 0.0;
		//const int32 maxIterations = 10;
		var maxIterations = 10;
		//b2Vec2 d;
		var dX;
		var dY;
		//float32 invRelativeVelocity = 0.0f;
		var invRelativeVelocity = 0.0;
		//bool hit = true;
		var hit = true;
		//b2Vec2 b2Conservative.x1, b2Conservative.x2; moved to static var
		for (var iter = 0; iter < maxIterations; ++iter)
		{
			// Get the accurate distance between shapes.
			//float32 distance = b2Distance.Distance(&b2Conservative.x1, &b2Conservative.x2, shape1, shape2);
			var distance = b2Distance.Distance(b2Conservative.x1, b2Conservative.x2, shape1, shape2);
			if (distance < b2Settings.b2_linearSlop)
			{
				if (iter == 0)
				{
					hit = false;
				}
				else
				{
					hit = true;
				}
				break;
			}

			if (iter == 0)
			{
				//b2Vec2 d = b2Conservative.x2 - b2Conservative.x1;
				dX = b2Conservative.x2.x - b2Conservative.x1.x;
				dY = b2Conservative.x2.y - b2Conservative.x1.y;
				//d.Normalize();
				var dLen = Math.sqrt(dX*dX + dY*dY);
				//float32 relativeVelocity = b2Dot(d, v1 - v2) + b2Abs(omega1) * r1 + b2Abs(omega2) * r2;
				var relativeVelocity = (dX*(v1X-v2X) + dY*(v1Y - v2Y)) + Math.abs(omega1) * r1 + Math.abs(omega2) * r2;
				if (Math.abs(relativeVelocity) < Number.MIN_VALUE)
				{
					hit = false;
					break;
				}

				invRelativeVelocity = 1.0 / relativeVelocity;
			}

			// Get the conservative movement.
			//float32 ds = distance * invRelativeVelocity;
			var ds = distance * invRelativeVelocity;
			//float32 s2 = s1 + ds;
			var s2 = s1 + ds;

			if (s2 < 0.0 || 1.0 < s2)
			{
				hit = false;
				break;
			}

			if (s2 < (1.0 + 100.0 * Number.MIN_VALUE) * s1)
			{
				hit = true;
				break;
			}

			s1 = s2;

			// Move forward conservatively.
			//p1 = p1Start + s1 * v1;
			p1X = p1StartX + s1 * v1.x;
			p1Y = p1StartY + s1 * v1.y;
			//a1 = a1Start + s1 * omega1;
			a1 = a1Start + s1 * omega1;
			//p2 = p2Start + s1 * v2;
			p2X = p2StartX + s1 * v2.x;
			p2Y = p2StartY + s1 * v2.y;
			//a2 = a2Start + s1 * omega2;
			a2 = a2Start + s1 * omega2;

			b2Conservative.R1.Set(a1);
			b2Conservative.R2.Set(a2);
			shape1.QuickSync(p1, b2Conservative.R1);
			shape2.QuickSync(p2, b2Conservative.R2);
		}

		if (hit)
		{
			// Hit, move bodies to safe position and re-sync shapes.
			//b2Vec2 d = b2Conservative.x2 - b2Conservative.x1;
			dX = b2Conservative.x2.x - b2Conservative.x1.x;
			dY = b2Conservative.x2.y - b2Conservative.x1.y;
			//float32 length = d.Length();
			var length = Math.sqrt(dX*dX + dY*dY);
			if (length > FLT_EPSILON)
			{
				d *= b2_linearSlop / length;
			}

			if (body1.IsStatic())
			{
				//body1.m_position = p1;
				body1.m_position.x = p1X;
				body1.m_position.y = p1Y;
			}
			else
			{
				//body1.m_position = p1 - d;
				body1.m_position.x = p1X - dX;
				body1.m_position.y = p1Y - dY;
			}
			body1.m_rotation = a1;
			body1.m_R.Set(a1);
			body1.QuickSyncShapes();

			if (body2.IsStatic())
			{
				//body2->m_position = p2;
				body2.m_position.x = p2X;
				body2.m_position.y = p2Y;
			}
			else
			{
				//body2->m_position = p2 + d;
				body2.m_position.x = p2X + dX;
				body2.m_position.y = p2Y + dY;
			}
			//body2.m_position = p2 + d;
			body2.m_position.x = p2X + dX;
			body2.m_position.y = p2Y + dY;
			body2.m_rotation = a2;
			body2.m_R.Set(a2);
			body2.QuickSyncShapes();

			return true;
		}

		// No hit, restore shapes.
		shape1.QuickSync(body1.m_position, body1.m_R);
		shape2.QuickSync(body2.m_position, body2.m_R);
		return false;
	};
