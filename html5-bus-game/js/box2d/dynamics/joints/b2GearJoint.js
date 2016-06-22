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






var b2GearJoint = Class.create();
Object.extend(b2GearJoint.prototype, b2Joint.prototype);
Object.extend(b2GearJoint.prototype, 
{
	GetAnchor1: function(){
		//return this.m_body1.m_position + b2MulMV(this.m_body1.m_R, this.m_localAnchor1);
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

	GetReactionForce: function(invTimeStep){
		//b2Vec2 F(0.0f, 0.0f);
		return new b2Vec2();
	},
	GetReactionTorque: function(invTimeStep){
		return 0.0;
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
		this.m_J = new b2Jacobian();
		//

		// parent constructor
		//super(def);

		//b2Settings.b2Assert(def.joint1.m_type == b2Joint.e_revoluteJoint || def.joint1.m_type == b2Joint.e_prismaticJoint);
		//b2Settings.b2Assert(def.joint2.m_type == b2Joint.e_revoluteJoint || def.joint2.m_type == b2Joint.e_prismaticJoint);
		//b2Settings.b2Assert(def.joint1.m_body1.IsStatic());
		//b2Settings.b2Assert(def.joint2.m_body1.IsStatic());

		this.m_revolute1 = null;
		this.m_prismatic1 = null;
		this.m_revolute2 = null;
		this.m_prismatic2 = null;

		var coordinate1;
		var coordinate2;

		this.m_ground1 = def.joint1.m_body1;
		this.m_body1 = def.joint1.m_body2;
		if (def.joint1.m_type == b2Joint.e_revoluteJoint)
		{
			this.m_revolute1 = def.joint1;
			this.m_groundAnchor1.SetV( this.m_revolute1.m_localAnchor1 );
			this.m_localAnchor1.SetV( this.m_revolute1.m_localAnchor2 );
			coordinate1 = this.m_revolute1.GetJointAngle();
		}
		else
		{
			this.m_prismatic1 = def.joint1;
			this.m_groundAnchor1.SetV( this.m_prismatic1.m_localAnchor1 );
			this.m_localAnchor1.SetV( this.m_prismatic1.m_localAnchor2 );
			coordinate1 = this.m_prismatic1.GetJointTranslation();
		}

		this.m_ground2 = def.joint2.m_body1;
		this.m_body2 = def.joint2.m_body2;
		if (def.joint2.m_type == b2Joint.e_revoluteJoint)
		{
			this.m_revolute2 = def.joint2;
			this.m_groundAnchor2.SetV( this.m_revolute2.m_localAnchor1 );
			this.m_localAnchor2.SetV( this.m_revolute2.m_localAnchor2 );
			coordinate2 = this.m_revolute2.GetJointAngle();
		}
		else
		{
			this.m_prismatic2 = def.joint2;
			this.m_groundAnchor2.SetV( this.m_prismatic2.m_localAnchor1 );
			this.m_localAnchor2.SetV( this.m_prismatic2.m_localAnchor2 );
			coordinate2 = this.m_prismatic2.GetJointTranslation();
		}

		this.m_ratio = def.ratio;

		this.m_constant = coordinate1 + this.m_ratio * coordinate2;

		this.m_impulse = 0.0;

	},

	PrepareVelocitySolver: function(){
		var g1 = this.m_ground1;
		var g2 = this.m_ground2;
		var b1 = this.m_body1;
		var b2 = this.m_body2;

		// temp vars
		var ugX;
		var ugY;
		var rX;
		var rY;
		var tMat;
		var tVec;
		var crug;

		var K = 0.0;
		this.m_J.SetZero();

		if (this.m_revolute1)
		{
			this.m_J.angular1 = -1.0;
			K += b1.m_invI;
		}
		else
		{
			//b2Vec2 ug = b2MulMV(g1->m_R, this.m_prismatic1->m_localXAxis1);
			tMat = g1.m_R;
			tVec = this.m_prismatic1.m_localXAxis1;
			ugX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
			ugY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
			//b2Vec2 r = b2MulMV(b1->m_R, this.m_localAnchor1);
			tMat = b1.m_R;
			rX = tMat.col1.x * this.m_localAnchor1.x + tMat.col2.x * this.m_localAnchor1.y;
			rY = tMat.col1.y * this.m_localAnchor1.x + tMat.col2.y * this.m_localAnchor1.y;

			//var crug = b2Cross(r, ug);
			crug = rX * ugY - rY * ugX;
			//this.m_J.linear1 = -ug;
			this.m_J.linear1.Set(-ugX, -ugY);
			this.m_J.angular1 = -crug;
			K += b1.m_invMass + b1.m_invI * crug * crug;
		}

		if (this.m_revolute2)
		{
			this.m_J.angular2 = -this.m_ratio;
			K += this.m_ratio * this.m_ratio * b2.m_invI;
		}
		else
		{
			//b2Vec2 ug = b2Mul(g2->m_R, this.m_prismatic2->m_localXAxis1);
			tMat = g2.m_R;
			tVec = this.m_prismatic2.m_localXAxis1;
			ugX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
			ugY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
			//b2Vec2 r = b2Mul(b2->m_R, this.m_localAnchor2);
			tMat = b2.m_R;
			rX = tMat.col1.x * this.m_localAnchor2.x + tMat.col2.x * this.m_localAnchor2.y;
			rY = tMat.col1.y * this.m_localAnchor2.x + tMat.col2.y * this.m_localAnchor2.y;
			//float32 crug = b2Cross(r, ug);
			crug = rX * ugY - rY * ugX;
			//this.m_J.linear2 = -this.m_ratio * ug;
			this.m_J.linear2.Set(-this.m_ratio*ugX, -this.m_ratio*ugY);
			this.m_J.angular2 = -this.m_ratio * crug;
			K += this.m_ratio * this.m_ratio * (b2.m_invMass + b2.m_invI * crug * crug);
		}

		// Compute effective mass.
		//b2Settings.b2Assert(K > 0.0);
		this.m_mass = 1.0 / K;

		// Warm starting.
		//b1.m_linearVelocity += b1.m_invMass * this.m_impulse * this.m_J.linear1;
		b1.m_linearVelocity.x += b1.m_invMass * this.m_impulse * this.m_J.linear1.x;
		b1.m_linearVelocity.y += b1.m_invMass * this.m_impulse * this.m_J.linear1.y;
		b1.m_angularVelocity += b1.m_invI * this.m_impulse * this.m_J.angular1;
		//b2.m_linearVelocity += b2.m_invMass * this.m_impulse * this.m_J.linear2;
		b2.m_linearVelocity.x += b2.m_invMass * this.m_impulse * this.m_J.linear2.x;
		b2.m_linearVelocity.y += b2.m_invMass * this.m_impulse * this.m_J.linear2.y;
		b2.m_angularVelocity += b2.m_invI * this.m_impulse * this.m_J.angular2;
	},


	SolveVelocityConstraints: function(step){
		var b1 = this.m_body1;
		var b2 = this.m_body2;

		var Cdot = this.m_J.Compute(	b1.m_linearVelocity, b1.m_angularVelocity,
										b2.m_linearVelocity, b2.m_angularVelocity);

		var impulse = -this.m_mass * Cdot;
		this.m_impulse += impulse;

		b1.m_linearVelocity.x += b1.m_invMass * impulse * this.m_J.linear1.x;
		b1.m_linearVelocity.y += b1.m_invMass * impulse * this.m_J.linear1.y;
		b1.m_angularVelocity  += b1.m_invI * impulse * this.m_J.angular1;
		b2.m_linearVelocity.x += b2.m_invMass * impulse * this.m_J.linear2.x;
		b2.m_linearVelocity.y += b2.m_invMass * impulse * this.m_J.linear2.y;
		b2.m_angularVelocity  += b2.m_invI * impulse * this.m_J.angular2;
	},

	SolvePositionConstraints: function(){
		var linearError = 0.0;

		var b1 = this.m_body1;
		var b2 = this.m_body2;

		var coordinate1;
		var coordinate2;
		if (this.m_revolute1)
		{
			coordinate1 = this.m_revolute1.GetJointAngle();
		}
		else
		{
			coordinate1 = this.m_prismatic1.GetJointTranslation();
		}

		if (this.m_revolute2)
		{
			coordinate2 = this.m_revolute2.GetJointAngle();
		}
		else
		{
			coordinate2 = this.m_prismatic2.GetJointTranslation();
		}

		var C = this.m_constant - (coordinate1 + this.m_ratio * coordinate2);

		var impulse = -this.m_mass * C;

		b1.m_position.x += b1.m_invMass * impulse * this.m_J.linear1.x;
		b1.m_position.y += b1.m_invMass * impulse * this.m_J.linear1.y;
		b1.m_rotation += b1.m_invI * impulse * this.m_J.angular1;
		b2.m_position.x += b2.m_invMass * impulse * this.m_J.linear2.x;
		b2.m_position.y += b2.m_invMass * impulse * this.m_J.linear2.y;
		b2.m_rotation += b2.m_invI * impulse * this.m_J.angular2;
		b1.m_R.Set(b1.m_rotation);
		b2.m_R.Set(b2.m_rotation);

		return linearError < b2Settings.b2_linearSlop;
	},

	m_ground1: null,
	m_ground2: null,

	// One of these is NULL.
	m_revolute1: null,
	m_prismatic1: null,

	// One of these is NULL.
	m_revolute2: null,
	m_prismatic2: null,

	m_groundAnchor1: new b2Vec2(),
	m_groundAnchor2: new b2Vec2(),

	m_localAnchor1: new b2Vec2(),
	m_localAnchor2: new b2Vec2(),

	m_J: new b2Jacobian(),

	m_constant: null,
	m_ratio: null,

	// Effective mass
	m_mass: null,

	// Impulse for accumulation/warm starting.
	m_impulse: null});

