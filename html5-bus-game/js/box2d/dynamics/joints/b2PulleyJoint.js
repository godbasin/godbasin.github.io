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







var b2PulleyJoint = Class.create();
Object.extend(b2PulleyJoint.prototype, b2Joint.prototype);
Object.extend(b2PulleyJoint.prototype, 
{
	GetAnchor1: function(){
		//return this.m_body1->m_position + b2Mul(this.m_body1->m_R, this.m_localAnchor1);
		var tMat = this.m_body1.m_R;
		return new b2Vec2(	this.m_body1.m_position.x + (tMat.col1.x * this.m_localAnchor1.x + tMat.col2.x * this.m_localAnchor1.y),
							this.m_body1.m_position.y + (tMat.col1.y * this.m_localAnchor1.x + tMat.col2.y * this.m_localAnchor1.y));
	},
	GetAnchor2: function(){
		//return this.m_body2->m_position + b2Mul(this.m_body2->m_R, this.m_localAnchor2);
		var tMat = this.m_body2.m_R;
		return new b2Vec2(	this.m_body2.m_position.x + (tMat.col1.x * this.m_localAnchor2.x + tMat.col2.x * this.m_localAnchor2.y),
							this.m_body2.m_position.y + (tMat.col1.y * this.m_localAnchor2.x + tMat.col2.y * this.m_localAnchor2.y));
	},

	GetGroundPoint1: function(){
		//return this.m_ground->m_position + this.m_groundAnchor1;
		return new b2Vec2(this.m_ground.m_position.x + this.m_groundAnchor1.x, this.m_ground.m_position.y + this.m_groundAnchor1.y);
	},
	GetGroundPoint2: function(){
		return new b2Vec2(this.m_ground.m_position.x + this.m_groundAnchor2.x, this.m_ground.m_position.y + this.m_groundAnchor2.y);
	},

	GetReactionForce: function(invTimeStep){
		//b2Vec2 F(0.0f, 0.0f);
		return new b2Vec2();
	},
	GetReactionTorque: function(invTimeStep){
		return 0.0;
	},

	GetLength1: function(){
		var tMat;
		//b2Vec2 p = this.m_body1->m_position + b2Mul(this.m_body1->m_R, this.m_localAnchor1);
		tMat = this.m_body1.m_R;
		var pX = this.m_body1.m_position.x + (tMat.col1.x * this.m_localAnchor1.x + tMat.col2.x * this.m_localAnchor1.y);
		var pY = this.m_body1.m_position.y + (tMat.col1.y * this.m_localAnchor1.x + tMat.col2.y * this.m_localAnchor1.y);
		//b2Vec2 s = this.m_ground->m_position + this.m_groundAnchor1;
		//b2Vec2 d = p - s;
		var dX = pX - (this.m_ground.m_position.x + this.m_groundAnchor1.x);
		var dY = pY - (this.m_ground.m_position.y + this.m_groundAnchor1.y);
		return Math.sqrt(dX*dX + dY*dY);
	},
	GetLength2: function(){
		var tMat;
		//b2Vec2 p = this.m_body2->m_position + b2Mul(this.m_body2->m_R, this.m_localAnchor2);
		tMat = this.m_body2.m_R;
		var pX = this.m_body2.m_position.x + (tMat.col1.x * this.m_localAnchor2.x + tMat.col2.x * this.m_localAnchor2.y);
		var pY = this.m_body2.m_position.y + (tMat.col1.y * this.m_localAnchor2.x + tMat.col2.y * this.m_localAnchor2.y);
		//b2Vec2 s = this.m_ground->m_position + this.m_groundAnchor2;
		//b2Vec2 d = p - s;
		var dX = pX - (this.m_ground.m_position.x + this.m_groundAnchor2.x);
		var dY = pY - (this.m_ground.m_position.y + this.m_groundAnchor2.y);
		return Math.sqrt(dX*dX + dY*dY);
	},

	GetRatio: function(){
		return this.m_ratio;
	},

	//--------------- Internals Below -------------------

	initialize: function(def){
		// The constructor for b2Joint
		// initialize instance variables for references
		this.m_node1 = new b2JointNode();
		this.m_node2 = new b2JointNode();
		//
		this.m_type = def.type;
		this.m_prev = null;
		this.m_next = null;
		this.m_body1 = def.body1;
		this.m_body2 = def.body2;
		this.m_collideConnected = def.collideConnected;
		this.m_islandFlag = false;
		this.m_userData = def.userData;
		//

		// initialize instance variables for references
		this.m_groundAnchor1 = new b2Vec2();
		this.m_groundAnchor2 = new b2Vec2();
		this.m_localAnchor1 = new b2Vec2();
		this.m_localAnchor2 = new b2Vec2();
		this.m_u1 = new b2Vec2();
		this.m_u2 = new b2Vec2();
		//


		// parent
		//super(def);

		var tMat;
		var tX;
		var tY;

		this.m_ground = this.m_body1.m_world.m_groundBody;
		//this.m_groundAnchor1 = def.groundPoint1 - this.m_ground.m_position;
		this.m_groundAnchor1.x = def.groundPoint1.x - this.m_ground.m_position.x;
		this.m_groundAnchor1.y = def.groundPoint1.y - this.m_ground.m_position.y;
		//this.m_groundAnchor2 = def.groundPoint2 - this.m_ground.m_position;
		this.m_groundAnchor2.x = def.groundPoint2.x - this.m_ground.m_position.x;
		this.m_groundAnchor2.y = def.groundPoint2.y - this.m_ground.m_position.y;
		//this.m_localAnchor1 = b2MulT(this.m_body1.m_R, def.anchorPoint1 - this.m_body1.m_position);
		tMat = this.m_body1.m_R;
		tX = def.anchorPoint1.x - this.m_body1.m_position.x;
		tY = def.anchorPoint1.y - this.m_body1.m_position.y;
		this.m_localAnchor1.x = tX*tMat.col1.x + tY*tMat.col1.y;
		this.m_localAnchor1.y = tX*tMat.col2.x + tY*tMat.col2.y;
		//this.m_localAnchor2 = b2MulT(this.m_body2.m_R, def.anchorPoint2 - this.m_body2.m_position);
		tMat = this.m_body2.m_R;
		tX = def.anchorPoint2.x - this.m_body2.m_position.x;
		tY = def.anchorPoint2.y - this.m_body2.m_position.y;
		this.m_localAnchor2.x = tX*tMat.col1.x + tY*tMat.col1.y;
		this.m_localAnchor2.y = tX*tMat.col2.x + tY*tMat.col2.y;

		this.m_ratio = def.ratio;

		//var d1 = def.groundPoint1 - def.anchorPoint1;
		tX = def.groundPoint1.x - def.anchorPoint1.x;
		tY = def.groundPoint1.y - def.anchorPoint1.y;
		var d1Len = Math.sqrt(tX*tX + tY*tY);
		//var d2 = def.groundPoint2 - def.anchorPoint2;
		tX = def.groundPoint2.x - def.anchorPoint2.x;
		tY = def.groundPoint2.y - def.anchorPoint2.y;
		var d2Len = Math.sqrt(tX*tX + tY*tY);

		var length1 = b2Math.b2Max(0.5 * b2PulleyJoint.b2_minPulleyLength, d1Len);
		var length2 = b2Math.b2Max(0.5 * b2PulleyJoint.b2_minPulleyLength, d2Len);

		this.m_constant = length1 + this.m_ratio * length2;

		this.m_maxLength1 = b2Math.b2Clamp(def.maxLength1, length1, this.m_constant - this.m_ratio * b2PulleyJoint.b2_minPulleyLength);
		this.m_maxLength2 = b2Math.b2Clamp(def.maxLength2, length2, (this.m_constant - b2PulleyJoint.b2_minPulleyLength) / this.m_ratio);

		this.m_pulleyImpulse = 0.0;
		this.m_limitImpulse1 = 0.0;
		this.m_limitImpulse2 = 0.0;

	},

	PrepareVelocitySolver: function(){
		var b1 = this.m_body1;
		var b2 = this.m_body2;

		var tMat;

		//b2Vec2 r1 = b2Mul(b1->m_R, this.m_localAnchor1);
		tMat = b1.m_R;
		var r1X = tMat.col1.x * this.m_localAnchor1.x + tMat.col2.x * this.m_localAnchor1.y;
		var r1Y = tMat.col1.y * this.m_localAnchor1.x + tMat.col2.y * this.m_localAnchor1.y;
		//b2Vec2 r2 = b2Mul(b2->m_R, this.m_localAnchor2);
		tMat = b2.m_R;
		var r2X = tMat.col1.x * this.m_localAnchor2.x + tMat.col2.x * this.m_localAnchor2.y;
		var r2Y = tMat.col1.y * this.m_localAnchor2.x + tMat.col2.y * this.m_localAnchor2.y;

		//b2Vec2 p1 = b1->m_position + r1;
		var p1X = b1.m_position.x + r1X;
		var p1Y = b1.m_position.y + r1Y;
		//b2Vec2 p2 = b2->m_position + r2;
		var p2X = b2.m_position.x + r2X;
		var p2Y = b2.m_position.y + r2Y;

		//b2Vec2 s1 = this.m_ground->m_position + this.m_groundAnchor1;
		var s1X = this.m_ground.m_position.x + this.m_groundAnchor1.x;
		var s1Y = this.m_ground.m_position.y + this.m_groundAnchor1.y;
		//b2Vec2 s2 = this.m_ground->m_position + this.m_groundAnchor2;
		var s2X = this.m_ground.m_position.x + this.m_groundAnchor2.x;
		var s2Y = this.m_ground.m_position.y + this.m_groundAnchor2.y;

		// Get the pulley axes.
		//this.m_u1 = p1 - s1;
		this.m_u1.Set(p1X - s1X, p1Y - s1Y);
		//this.m_u2 = p2 - s2;
		this.m_u2.Set(p2X - s2X, p2Y - s2Y);

		var length1 = this.m_u1.Length();
		var length2 = this.m_u2.Length();

		if (length1 > b2Settings.b2_linearSlop)
		{
			//this.m_u1 *= 1.0f / length1;
			this.m_u1.Multiply(1.0 / length1);
		}
		else
		{
			this.m_u1.SetZero();
		}

		if (length2 > b2Settings.b2_linearSlop)
		{
			//this.m_u2 *= 1.0f / length2;
			this.m_u2.Multiply(1.0 / length2);
		}
		else
		{
			this.m_u2.SetZero();
		}

		if (length1 < this.m_maxLength1)
		{
			this.m_limitState1 = b2Joint.e_inactiveLimit;
			this.m_limitImpulse1 = 0.0;
		}
		else
		{
			this.m_limitState1 = b2Joint.e_atUpperLimit;
			this.m_limitPositionImpulse1 = 0.0;
		}

		if (length2 < this.m_maxLength2)
		{
			this.m_limitState2 = b2Joint.e_inactiveLimit;
			this.m_limitImpulse2 = 0.0;
		}
		else
		{
			this.m_limitState2 = b2Joint.e_atUpperLimit;
			this.m_limitPositionImpulse2 = 0.0;
		}

		// Compute effective mass.
		//var cr1u1 = b2Cross(r1, this.m_u1);
		var cr1u1 = r1X * this.m_u1.y - r1Y * this.m_u1.x;
		//var cr2u2 = b2Cross(r2, this.m_u2);
		var cr2u2 = r2X * this.m_u2.y - r2Y * this.m_u2.x;

		this.m_limitMass1 = b1.m_invMass + b1.m_invI * cr1u1 * cr1u1;
		this.m_limitMass2 = b2.m_invMass + b2.m_invI * cr2u2 * cr2u2;
		this.m_pulleyMass = this.m_limitMass1 + this.m_ratio * this.m_ratio * this.m_limitMass2;
		//b2Settings.b2Assert(this.m_limitMass1 > Number.MIN_VALUE);
		//b2Settings.b2Assert(this.m_limitMass2 > Number.MIN_VALUE);
		//b2Settings.b2Assert(this.m_pulleyMass > Number.MIN_VALUE);
		this.m_limitMass1 = 1.0 / this.m_limitMass1;
		this.m_limitMass2 = 1.0 / this.m_limitMass2;
		this.m_pulleyMass = 1.0 / this.m_pulleyMass;

		// Warm starting.
		//b2Vec2 P1 = (-this.m_pulleyImpulse - this.m_limitImpulse1) * this.m_u1;
		var P1X = (-this.m_pulleyImpulse - this.m_limitImpulse1) * this.m_u1.x;
		var P1Y = (-this.m_pulleyImpulse - this.m_limitImpulse1) * this.m_u1.y;
		//b2Vec2 P2 = (-this.m_ratio * this.m_pulleyImpulse - this.m_limitImpulse2) * this.m_u2;
		var P2X = (-this.m_ratio * this.m_pulleyImpulse - this.m_limitImpulse2) * this.m_u2.x;
		var P2Y = (-this.m_ratio * this.m_pulleyImpulse - this.m_limitImpulse2) * this.m_u2.y;
		//b1.m_linearVelocity += b1.m_invMass * P1;
		b1.m_linearVelocity.x += b1.m_invMass * P1X;
		b1.m_linearVelocity.y += b1.m_invMass * P1Y;
		//b1.m_angularVelocity += b1.m_invI * b2Cross(r1, P1);
		b1.m_angularVelocity += b1.m_invI * (r1X * P1Y - r1Y * P1X);
		//b2.m_linearVelocity += b2.m_invMass * P2;
		b2.m_linearVelocity.x += b2.m_invMass * P2X;
		b2.m_linearVelocity.y += b2.m_invMass * P2Y;
		//b2.m_angularVelocity += b2.m_invI * b2Cross(r2, P2);
		b2.m_angularVelocity += b2.m_invI * (r2X * P2Y - r2Y * P2X);
	},

	SolveVelocityConstraints: function(step){
		var b1 = this.m_body1;
		var b2 = this.m_body2;

		var tMat;

		//var r1 = b2Mul(b1.m_R, this.m_localAnchor1);
		tMat = b1.m_R;
		var r1X = tMat.col1.x * this.m_localAnchor1.x + tMat.col2.x * this.m_localAnchor1.y;
		var r1Y = tMat.col1.y * this.m_localAnchor1.x + tMat.col2.y * this.m_localAnchor1.y;
		//var r2 = b2Mul(b2.m_R, this.m_localAnchor2);
		tMat = b2.m_R;
		var r2X = tMat.col1.x * this.m_localAnchor2.x + tMat.col2.x * this.m_localAnchor2.y;
		var r2Y = tMat.col1.y * this.m_localAnchor2.x + tMat.col2.y * this.m_localAnchor2.y;

		// temp vars
		var v1X;
		var v1Y;
		var v2X;
		var v2Y;
		var P1X;
		var P1Y;
		var P2X;
		var P2Y;
		var Cdot;
		var impulse;
		var oldLimitImpulse;

		//{
			//b2Vec2 v1 = b1->m_linearVelocity + b2Cross(b1->m_angularVelocity, r1);
			v1X = b1.m_linearVelocity.x + (-b1.m_angularVelocity * r1Y);
			v1Y = b1.m_linearVelocity.y + (b1.m_angularVelocity * r1X);
			//b2Vec2 v2 = b2->m_linearVelocity + b2Cross(b2->m_angularVelocity, r2);
			v2X = b2.m_linearVelocity.x + (-b2.m_angularVelocity * r2Y);
			v2Y = b2.m_linearVelocity.y + (b2.m_angularVelocity * r2X);

			//Cdot = -b2Dot(this.m_u1, v1) - this.m_ratio * b2Dot(this.m_u2, v2);
			Cdot = -(this.m_u1.x * v1X + this.m_u1.y * v1Y) - this.m_ratio * (this.m_u2.x * v2X + this.m_u2.y * v2Y);
			impulse = -this.m_pulleyMass * Cdot;
			this.m_pulleyImpulse += impulse;

			//b2Vec2 P1 = -impulse * this.m_u1;
			P1X = -impulse * this.m_u1.x;
			P1Y = -impulse * this.m_u1.y;
			//b2Vec2 P2 = -this.m_ratio * impulse * this.m_u2;
			P2X = -this.m_ratio * impulse * this.m_u2.x;
			P2Y = -this.m_ratio * impulse * this.m_u2.y;
			//b1.m_linearVelocity += b1.m_invMass * P1;
			b1.m_linearVelocity.x += b1.m_invMass * P1X;
			b1.m_linearVelocity.y += b1.m_invMass * P1Y;
			//b1.m_angularVelocity += b1.m_invI * b2Cross(r1, P1);
			b1.m_angularVelocity += b1.m_invI * (r1X * P1Y - r1Y * P1X);
			//b2.m_linearVelocity += b2.m_invMass * P2;
			b2.m_linearVelocity.x += b2.m_invMass * P2X;
			b2.m_linearVelocity.y += b2.m_invMass * P2Y;
			//b2.m_angularVelocity += b2.m_invI * b2Cross(r2, P2);
			b2.m_angularVelocity += b2.m_invI * (r2X * P2Y - r2Y * P2X);
		//}

		if (this.m_limitState1 == b2Joint.e_atUpperLimit)
		{
			//b2Vec2 v1 = b1->m_linearVelocity + b2Cross(b1->m_angularVelocity, r1);
			v1X = b1.m_linearVelocity.x + (-b1.m_angularVelocity * r1Y);
			v1Y = b1.m_linearVelocity.y + (b1.m_angularVelocity * r1X);

			//float32 Cdot = -b2Dot(this.m_u1, v1);
			Cdot = -(this.m_u1.x * v1X + this.m_u1.y * v1Y);
			impulse = -this.m_limitMass1 * Cdot;
			oldLimitImpulse = this.m_limitImpulse1;
			this.m_limitImpulse1 = b2Math.b2Max(0.0, this.m_limitImpulse1 + impulse);
			impulse = this.m_limitImpulse1 - oldLimitImpulse;
			//b2Vec2 P1 = -impulse * this.m_u1;
			P1X = -impulse * this.m_u1.x;
			P1Y = -impulse * this.m_u1.y;
			//b1.m_linearVelocity += b1->m_invMass * P1;
			b1.m_linearVelocity.x += b1.m_invMass * P1X;
			b1.m_linearVelocity.y += b1.m_invMass * P1Y;
			//b1.m_angularVelocity += b1->m_invI * b2Cross(r1, P1);
			b1.m_angularVelocity += b1.m_invI * (r1X * P1Y - r1Y * P1X);
		}

		if (this.m_limitState2 == b2Joint.e_atUpperLimit)
		{
			//b2Vec2 v2 = b2->m_linearVelocity + b2Cross(b2->m_angularVelocity, r2);
			v2X = b2.m_linearVelocity.x + (-b2.m_angularVelocity * r2Y);
			v2Y = b2.m_linearVelocity.y + (b2.m_angularVelocity * r2X);

			//float32 Cdot = -b2Dot(this.m_u2, v2);
			Cdot = -(this.m_u2.x * v2X + this.m_u2.y * v2Y);
			impulse = -this.m_limitMass2 * Cdot;
			oldLimitImpulse = this.m_limitImpulse2;
			this.m_limitImpulse2 = b2Math.b2Max(0.0, this.m_limitImpulse2 + impulse);
			impulse = this.m_limitImpulse2 - oldLimitImpulse;
			//b2Vec2 P2 = -impulse * this.m_u2;
			P2X = -impulse * this.m_u2.x;
			P2Y = -impulse * this.m_u2.y;
			//b2->m_linearVelocity += b2->m_invMass * P2;
			b2.m_linearVelocity.x += b2.m_invMass * P2X;
			b2.m_linearVelocity.y += b2.m_invMass * P2Y;
			//b2->m_angularVelocity += b2->m_invI * b2Cross(r2, P2);
			b2.m_angularVelocity += b2.m_invI * (r2X * P2Y - r2Y * P2X);
		}
	},



	SolvePositionConstraints: function(){
		var b1 = this.m_body1;
		var b2 = this.m_body2;

		var tMat;

		//b2Vec2 s1 = this.m_ground->m_position + this.m_groundAnchor1;
		var s1X = this.m_ground.m_position.x + this.m_groundAnchor1.x;
		var s1Y = this.m_ground.m_position.y + this.m_groundAnchor1.y;
		//b2Vec2 s2 = this.m_ground->m_position + this.m_groundAnchor2;
		var s2X = this.m_ground.m_position.x + this.m_groundAnchor2.x;
		var s2Y = this.m_ground.m_position.y + this.m_groundAnchor2.y;

		// temp vars
		var r1X;
		var r1Y;
		var r2X;
		var r2Y;
		var p1X;
		var p1Y;
		var p2X;
		var p2Y;
		var length1;
		var length2;
		var C;
		var impulse;
		var oldLimitPositionImpulse;

		var linearError = 0.0;

		{
			//var r1 = b2Mul(b1.m_R, this.m_localAnchor1);
			tMat = b1.m_R;
			r1X = tMat.col1.x * this.m_localAnchor1.x + tMat.col2.x * this.m_localAnchor1.y;
			r1Y = tMat.col1.y * this.m_localAnchor1.x + tMat.col2.y * this.m_localAnchor1.y;
			//var r2 = b2Mul(b2.m_R, this.m_localAnchor2);
			tMat = b2.m_R;
			r2X = tMat.col1.x * this.m_localAnchor2.x + tMat.col2.x * this.m_localAnchor2.y;
			r2Y = tMat.col1.y * this.m_localAnchor2.x + tMat.col2.y * this.m_localAnchor2.y;

			//b2Vec2 p1 = b1->m_position + r1;
			p1X = b1.m_position.x + r1X;
			p1Y = b1.m_position.y + r1Y;
			//b2Vec2 p2 = b2->m_position + r2;
			p2X = b2.m_position.x + r2X;
			p2Y = b2.m_position.y + r2Y;

			// Get the pulley axes.
			//this.m_u1 = p1 - s1;
			this.m_u1.Set(p1X - s1X, p1Y - s1Y);
			//this.m_u2 = p2 - s2;
			this.m_u2.Set(p2X - s2X, p2Y - s2Y);

			length1 = this.m_u1.Length();
			length2 = this.m_u2.Length();

			if (length1 > b2Settings.b2_linearSlop)
			{
				//this.m_u1 *= 1.0f / length1;
				this.m_u1.Multiply( 1.0 / length1 );
			}
			else
			{
				this.m_u1.SetZero();
			}

			if (length2 > b2Settings.b2_linearSlop)
			{
				//this.m_u2 *= 1.0f / length2;
				this.m_u2.Multiply( 1.0 / length2 );
			}
			else
			{
				this.m_u2.SetZero();
			}

			C = this.m_constant - length1 - this.m_ratio * length2;
			linearError = b2Math.b2Max(linearError, Math.abs(C));
			C = b2Math.b2Clamp(C, -b2Settings.b2_maxLinearCorrection, b2Settings.b2_maxLinearCorrection);
			impulse = -this.m_pulleyMass * C;

			p1X = -impulse * this.m_u1.x;
			p1Y = -impulse * this.m_u1.y;
			p2X = -this.m_ratio * impulse * this.m_u2.x;
			p2Y = -this.m_ratio * impulse * this.m_u2.y;

			b1.m_position.x += b1.m_invMass * p1X;
			b1.m_position.y += b1.m_invMass * p1Y;
			b1.m_rotation += b1.m_invI * (r1X * p1Y - r1Y * p1X);
			b2.m_position.x += b2.m_invMass * p2X;
			b2.m_position.y += b2.m_invMass * p2Y;
			b2.m_rotation += b2.m_invI * (r2X * p2Y - r2Y * p2X);

			b1.m_R.Set(b1.m_rotation);
			b2.m_R.Set(b2.m_rotation);
		}

		if (this.m_limitState1 == b2Joint.e_atUpperLimit)
		{
			//b2Vec2 r1 = b2Mul(b1->m_R, this.m_localAnchor1);
			tMat = b1.m_R;
			r1X = tMat.col1.x * this.m_localAnchor1.x + tMat.col2.x * this.m_localAnchor1.y;
			r1Y = tMat.col1.y * this.m_localAnchor1.x + tMat.col2.y * this.m_localAnchor1.y;
			//b2Vec2 p1 = b1->m_position + r1;
			p1X = b1.m_position.x + r1X;
			p1Y = b1.m_position.y + r1Y;

			//this.m_u1 = p1 - s1;
			this.m_u1.Set(p1X - s1X, p1Y - s1Y);

			length1 = this.m_u1.Length();

			if (length1 > b2Settings.b2_linearSlop)
			{
				//this.m_u1 *= 1.0 / length1;
				this.m_u1.x *= 1.0 / length1;
				this.m_u1.y *= 1.0 / length1;
			}
			else
			{
				this.m_u1.SetZero();
			}

			C = this.m_maxLength1 - length1;
			linearError = b2Math.b2Max(linearError, -C);
			C = b2Math.b2Clamp(C + b2Settings.b2_linearSlop, -b2Settings.b2_maxLinearCorrection, 0.0);
			impulse = -this.m_limitMass1 * C;
			oldLimitPositionImpulse = this.m_limitPositionImpulse1;
			this.m_limitPositionImpulse1 = b2Math.b2Max(0.0, this.m_limitPositionImpulse1 + impulse);
			impulse = this.m_limitPositionImpulse1 - oldLimitPositionImpulse;

			//P1 = -impulse * this.m_u1;
			p1X = -impulse * this.m_u1.x;
			p1Y = -impulse * this.m_u1.y;

			b1.m_position.x += b1.m_invMass * p1X;
			b1.m_position.y += b1.m_invMass * p1Y;
			//b1.m_rotation += b1.m_invI * b2Cross(r1, P1);
			b1.m_rotation += b1.m_invI * (r1X * p1Y - r1Y * p1X);
			b1.m_R.Set(b1.m_rotation);
		}

		if (this.m_limitState2 == b2Joint.e_atUpperLimit)
		{
			//b2Vec2 r2 = b2Mul(b2->m_R, this.m_localAnchor2);
			tMat = b2.m_R;
			r2X = tMat.col1.x * this.m_localAnchor2.x + tMat.col2.x * this.m_localAnchor2.y;
			r2Y = tMat.col1.y * this.m_localAnchor2.x + tMat.col2.y * this.m_localAnchor2.y;
			//b2Vec2 p2 = b2->m_position + r2;
			p2X = b2.m_position.x + r2X;
			p2Y = b2.m_position.y + r2Y;

			//this.m_u2 = p2 - s2;
			this.m_u2.Set(p2X - s2X, p2Y - s2Y);

			length2 = this.m_u2.Length();

			if (length2 > b2Settings.b2_linearSlop)
			{
				//this.m_u2 *= 1.0 / length2;
				this.m_u2.x *= 1.0 / length2;
				this.m_u2.y *= 1.0 / length2;
			}
			else
			{
				this.m_u2.SetZero();
			}

			C = this.m_maxLength2 - length2;
			linearError = b2Math.b2Max(linearError, -C);
			C = b2Math.b2Clamp(C + b2Settings.b2_linearSlop, -b2Settings.b2_maxLinearCorrection, 0.0);
			impulse = -this.m_limitMass2 * C;
			oldLimitPositionImpulse = this.m_limitPositionImpulse2;
			this.m_limitPositionImpulse2 = b2Math.b2Max(0.0, this.m_limitPositionImpulse2 + impulse);
			impulse = this.m_limitPositionImpulse2 - oldLimitPositionImpulse;

			//P2 = -impulse * this.m_u2;
			p2X = -impulse * this.m_u2.x;
			p2Y = -impulse * this.m_u2.y;

			//b2.m_position += b2.m_invMass * P2;
			b2.m_position.x += b2.m_invMass * p2X;
			b2.m_position.y += b2.m_invMass * p2Y;
			//b2.m_rotation += b2.m_invI * b2Cross(r2, P2);
			b2.m_rotation += b2.m_invI * (r2X * p2Y - r2Y * p2X);
			b2.m_R.Set(b2.m_rotation);
		}

		return linearError < b2Settings.b2_linearSlop;
	},



	m_ground: null,
	m_groundAnchor1: new b2Vec2(),
	m_groundAnchor2: new b2Vec2(),
	m_localAnchor1: new b2Vec2(),
	m_localAnchor2: new b2Vec2(),

	m_u1: new b2Vec2(),
	m_u2: new b2Vec2(),

	m_constant: null,
	m_ratio: null,

	m_maxLength1: null,
	m_maxLength2: null,

	// Effective masses
	m_pulleyMass: null,
	m_limitMass1: null,
	m_limitMass2: null,

	// Impulses for accumulation/warm starting.
	m_pulleyImpulse: null,
	m_limitImpulse1: null,
	m_limitImpulse2: null,

	// Position impulses for accumulation.
	m_limitPositionImpulse1: null,
	m_limitPositionImpulse2: null,

	m_limitState1: 0,
	m_limitState2: 0

	// static
});



b2PulleyJoint.b2_minPulleyLength = b2Settings.b2_lengthUnitsPerMeter;
