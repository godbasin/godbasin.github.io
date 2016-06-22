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



// C = norm(p2 - p1) - L
// u = (p2 - p1) / norm(p2 - p1)
// Cdot = dot(u, v2 + cross(w2, r2) - v1 - cross(w1, r1))
// J = [-u -cross(r1, u) u cross(r2, u)]
// K = J * invM * JT
//   = invMass1 + invI1 * cross(r1, u)^2 + invMass2 + invI2 * cross(r2, u)^2

var b2DistanceJoint = Class.create();
Object.extend(b2DistanceJoint.prototype, b2Joint.prototype);
Object.extend(b2DistanceJoint.prototype, 
{
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
		this.m_localAnchor1 = new b2Vec2();
		this.m_localAnchor2 = new b2Vec2();
		this.m_u = new b2Vec2();
		//

		//super(def);

		var tMat;
		var tX;
		var tY;
		//this.m_localAnchor1 = b2MulT(this.m_body1->m_R, def->anchorPoint1 - this.m_body1->m_position);
		tMat = this.m_body1.m_R;
		tX = def.anchorPoint1.x - this.m_body1.m_position.x;
		tY = def.anchorPoint1.y - this.m_body1.m_position.y;
		this.m_localAnchor1.x = tX*tMat.col1.x + tY*tMat.col1.y;
		this.m_localAnchor1.y = tX*tMat.col2.x + tY*tMat.col2.y;
		//this.m_localAnchor2 = b2MulT(this.m_body2->m_R, def->anchorPoint2 - this.m_body2->m_position);
		tMat = this.m_body2.m_R;
		tX = def.anchorPoint2.x - this.m_body2.m_position.x;
		tY = def.anchorPoint2.y - this.m_body2.m_position.y;
		this.m_localAnchor2.x = tX*tMat.col1.x + tY*tMat.col1.y;
		this.m_localAnchor2.y = tX*tMat.col2.x + tY*tMat.col2.y;

		//b2Vec2 d = def->anchorPoint2 - def->anchorPoint1;
		tX = def.anchorPoint2.x - def.anchorPoint1.x;
		tY = def.anchorPoint2.y - def.anchorPoint1.y;
		//this.m_length = d.Length();
		this.m_length = Math.sqrt(tX*tX + tY*tY);
		this.m_impulse = 0.0;
	},

	PrepareVelocitySolver: function(){

		var tMat;

		// Compute the effective mass matrix.
		//b2Vec2 r1 = b2Mul(this.m_body1->m_R, this.m_localAnchor1);
		tMat = this.m_body1.m_R;
		var r1X = tMat.col1.x * this.m_localAnchor1.x + tMat.col2.x * this.m_localAnchor1.y;
		var r1Y = tMat.col1.y * this.m_localAnchor1.x + tMat.col2.y * this.m_localAnchor1.y;
		//b2Vec2 r2 = b2Mul(this.m_body2->m_R, this.m_localAnchor2);
		tMat = this.m_body2.m_R;
		var r2X = tMat.col1.x * this.m_localAnchor2.x + tMat.col2.x * this.m_localAnchor2.y;
		var r2Y = tMat.col1.y * this.m_localAnchor2.x + tMat.col2.y * this.m_localAnchor2.y;
		//this.m_u = this.m_body2->m_position + r2 - this.m_body1->m_position - r1;
		this.m_u.x = this.m_body2.m_position.x + r2X - this.m_body1.m_position.x - r1X;
		this.m_u.y = this.m_body2.m_position.y + r2Y - this.m_body1.m_position.y - r1Y;

		// Handle singularity.
		//float32 length = this.m_u.Length();
		var length = Math.sqrt(this.m_u.x*this.m_u.x + this.m_u.y*this.m_u.y);
		if (length > b2Settings.b2_linearSlop)
		{
			//this.m_u *= 1.0 / length;
			this.m_u.Multiply( 1.0 / length );
		}
		else
		{
			this.m_u.SetZero();
		}

		//float32 cr1u = b2Cross(r1, this.m_u);
		var cr1u = (r1X * this.m_u.y - r1Y * this.m_u.x);
		//float32 cr2u = b2Cross(r2, this.m_u);
		var cr2u = (r2X * this.m_u.y - r2Y * this.m_u.x);
		//this.m_mass = this.m_body1->m_invMass + this.m_body1->m_invI * cr1u * cr1u + this.m_body2->m_invMass + this.m_body2->m_invI * cr2u * cr2u;
		this.m_mass = this.m_body1.m_invMass + this.m_body1.m_invI * cr1u * cr1u + this.m_body2.m_invMass + this.m_body2.m_invI * cr2u * cr2u;
		//b2Settings.b2Assert(this.m_mass > Number.MIN_VALUE);
		this.m_mass = 1.0 / this.m_mass;

		if (b2World.s_enableWarmStarting)
		{
			//b2Vec2 P = this.m_impulse * this.m_u;
			var PX = this.m_impulse * this.m_u.x;
			var PY = this.m_impulse * this.m_u.y;
			//this.m_body1.m_linearVelocity -= this.m_body1.m_invMass * P;
			this.m_body1.m_linearVelocity.x -= this.m_body1.m_invMass * PX;
			this.m_body1.m_linearVelocity.y -= this.m_body1.m_invMass * PY;
			//this.m_body1.m_angularVelocity -= this.m_body1.m_invI * b2Cross(r1, P);
			this.m_body1.m_angularVelocity -= this.m_body1.m_invI * (r1X * PY - r1Y * PX);
			//this.m_body2.m_linearVelocity += this.m_body2.m_invMass * P;
			this.m_body2.m_linearVelocity.x += this.m_body2.m_invMass * PX;
			this.m_body2.m_linearVelocity.y += this.m_body2.m_invMass * PY;
			//this.m_body2.m_angularVelocity += this.m_body2.m_invI * b2Cross(r2, P);
			this.m_body2.m_angularVelocity += this.m_body2.m_invI * (r2X * PY - r2Y * PX);
		}
		else
		{
			this.m_impulse = 0.0;
		}

	},



	SolveVelocityConstraints: function(step){

		var tMat;

		//b2Vec2 r1 = b2Mul(this.m_body1->m_R, this.m_localAnchor1);
		tMat = this.m_body1.m_R;
		var r1X = tMat.col1.x * this.m_localAnchor1.x + tMat.col2.x * this.m_localAnchor1.y;
		var r1Y = tMat.col1.y * this.m_localAnchor1.x + tMat.col2.y * this.m_localAnchor1.y;
		//b2Vec2 r2 = b2Mul(this.m_body2->m_R, this.m_localAnchor2);
		tMat = this.m_body2.m_R;
		var r2X = tMat.col1.x * this.m_localAnchor2.x + tMat.col2.x * this.m_localAnchor2.y;
		var r2Y = tMat.col1.y * this.m_localAnchor2.x + tMat.col2.y * this.m_localAnchor2.y;

		// Cdot = dot(u, v + cross(w, r))
		//b2Vec2 v1 = this.m_body1->m_linearVelocity + b2Cross(this.m_body1->m_angularVelocity, r1);
		var v1X = this.m_body1.m_linearVelocity.x + (-this.m_body1.m_angularVelocity * r1Y);
		var v1Y = this.m_body1.m_linearVelocity.y + (this.m_body1.m_angularVelocity * r1X);
		//b2Vec2 v2 = this.m_body2->m_linearVelocity + b2Cross(this.m_body2->m_angularVelocity, r2);
		var v2X = this.m_body2.m_linearVelocity.x + (-this.m_body2.m_angularVelocity * r2Y);
		var v2Y = this.m_body2.m_linearVelocity.y + (this.m_body2.m_angularVelocity * r2X);
		//float32 Cdot = b2Dot(this.m_u, v2 - v1);
		var Cdot = (this.m_u.x * (v2X - v1X) + this.m_u.y * (v2Y - v1Y));
		//float32 impulse = -this.m_mass * Cdot;
		var impulse = -this.m_mass * Cdot;
		this.m_impulse += impulse;

		//b2Vec2 P = impulse * this.m_u;
		var PX = impulse * this.m_u.x;
		var PY = impulse * this.m_u.y;
		//this.m_body1->m_linearVelocity -= this.m_body1->m_invMass * P;
		this.m_body1.m_linearVelocity.x -= this.m_body1.m_invMass * PX;
		this.m_body1.m_linearVelocity.y -= this.m_body1.m_invMass * PY;
		//this.m_body1->m_angularVelocity -= this.m_body1->m_invI * b2Cross(r1, P);
		this.m_body1.m_angularVelocity -= this.m_body1.m_invI * (r1X * PY - r1Y * PX);
		//this.m_body2->m_linearVelocity += this.m_body2->m_invMass * P;
		this.m_body2.m_linearVelocity.x += this.m_body2.m_invMass * PX;
		this.m_body2.m_linearVelocity.y += this.m_body2.m_invMass * PY;
		//this.m_body2->m_angularVelocity += this.m_body2->m_invI * b2Cross(r2, P);
		this.m_body2.m_angularVelocity += this.m_body2.m_invI * (r2X * PY - r2Y * PX);
	},

	SolvePositionConstraints: function(){

		var tMat;

		//b2Vec2 r1 = b2Mul(this.m_body1->m_R, this.m_localAnchor1);
		tMat = this.m_body1.m_R;
		var r1X = tMat.col1.x * this.m_localAnchor1.x + tMat.col2.x * this.m_localAnchor1.y;
		var r1Y = tMat.col1.y * this.m_localAnchor1.x + tMat.col2.y * this.m_localAnchor1.y;
		//b2Vec2 r2 = b2Mul(this.m_body2->m_R, this.m_localAnchor2);
		tMat = this.m_body2.m_R;
		var r2X = tMat.col1.x * this.m_localAnchor2.x + tMat.col2.x * this.m_localAnchor2.y;
		var r2Y = tMat.col1.y * this.m_localAnchor2.x + tMat.col2.y * this.m_localAnchor2.y;
		//b2Vec2 d = this.m_body2->m_position + r2 - this.m_body1->m_position - r1;
		var dX = this.m_body2.m_position.x + r2X - this.m_body1.m_position.x - r1X;
		var dY = this.m_body2.m_position.y + r2Y - this.m_body1.m_position.y - r1Y;

		//float32 length = d.Normalize();
		var length = Math.sqrt(dX*dX + dY*dY);
		dX /= length;
		dY /= length;
		//float32 C = length - this.m_length;
		var C = length - this.m_length;
		C = b2Math.b2Clamp(C, -b2Settings.b2_maxLinearCorrection, b2Settings.b2_maxLinearCorrection);

		var impulse = -this.m_mass * C;
		//this.m_u = d;
		this.m_u.Set(dX, dY);
		//b2Vec2 P = impulse * this.m_u;
		var PX = impulse * this.m_u.x;
		var PY = impulse * this.m_u.y;

		//this.m_body1->m_position -= this.m_body1->m_invMass * P;
		this.m_body1.m_position.x -= this.m_body1.m_invMass * PX;
		this.m_body1.m_position.y -= this.m_body1.m_invMass * PY;
		//this.m_body1->m_rotation -= this.m_body1->m_invI * b2Cross(r1, P);
		this.m_body1.m_rotation -= this.m_body1.m_invI * (r1X * PY - r1Y * PX);
		//this.m_body2->m_position += this.m_body2->m_invMass * P;
		this.m_body2.m_position.x += this.m_body2.m_invMass * PX;
		this.m_body2.m_position.y += this.m_body2.m_invMass * PY;
		//this.m_body2->m_rotation -= this.m_body2->m_invI * b2Cross(r2, P);
		this.m_body2.m_rotation += this.m_body2.m_invI * (r2X * PY - r2Y * PX);

		this.m_body1.m_R.Set(this.m_body1.m_rotation);
		this.m_body2.m_R.Set(this.m_body2.m_rotation);

		return b2Math.b2Abs(C) < b2Settings.b2_linearSlop;

	},

	GetAnchor1: function(){
		return b2Math.AddVV(this.m_body1.m_position , b2Math.b2MulMV(this.m_body1.m_R, this.m_localAnchor1));
	},
	GetAnchor2: function(){
		return b2Math.AddVV(this.m_body2.m_position , b2Math.b2MulMV(this.m_body2.m_R, this.m_localAnchor2));
	},

	GetReactionForce: function(invTimeStep)
	{
		//var F = (this.m_impulse * invTimeStep) * this.m_u;
		var F = new b2Vec2();
		F.SetV(this.m_u);
		F.Multiply(this.m_impulse * invTimeStep);
		return F;
	},

	GetReactionTorque: function(invTimeStep)
	{
		//NOT_USED(invTimeStep);
		return 0.0;
	},

	m_localAnchor1: new b2Vec2(),
	m_localAnchor2: new b2Vec2(),
	m_u: new b2Vec2(),
	m_impulse: null,
	m_mass: null,
	m_length: null});

