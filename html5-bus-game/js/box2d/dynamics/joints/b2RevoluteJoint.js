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





// Point-to-point constraint
// C = p2 - p1
// Cdot = v2 - v1
//      = v2 + cross(w2, r2) - v1 - cross(w1, r1)
// J = [-I -r1_skew I r2_skew ]
// Identity used:
// w k % (rx i + ry j) = w * (-ry i + rx j)

// Motor constraint
// Cdot = w2 - w1
// J = [0 0 -1 0 0 1]
// K = invI1 + invI2

var b2RevoluteJoint = Class.create();
Object.extend(b2RevoluteJoint.prototype, b2Joint.prototype);
Object.extend(b2RevoluteJoint.prototype, 
{
	GetAnchor1: function(){
		var tMat = this.m_body1.m_R;
		return new b2Vec2(	this.m_body1.m_position.x + (tMat.col1.x * this.m_localAnchor1.x + tMat.col2.x * this.m_localAnchor1.y),
							this.m_body1.m_position.y + (tMat.col1.y * this.m_localAnchor1.x + tMat.col2.y * this.m_localAnchor1.y));
	},
	GetAnchor2: function(){
		var tMat = this.m_body2.m_R;
		return new b2Vec2(	this.m_body2.m_position.x + (tMat.col1.x * this.m_localAnchor2.x + tMat.col2.x * this.m_localAnchor2.y),
							this.m_body2.m_position.y + (tMat.col1.y * this.m_localAnchor2.x + tMat.col2.y * this.m_localAnchor2.y));
	},
	GetJointAngle: function(){
		return this.m_body2.m_rotation - this.m_body1.m_rotation;
	},
	GetJointSpeed: function(){
		return this.m_body2.m_angularVelocity - this.m_body1.m_angularVelocity;
	},
	GetMotorTorque: function(invTimeStep){
		return  invTimeStep * this.m_motorImpulse;
	},

	SetMotorSpeed: function(speed)
	{
		this.m_motorSpeed = speed;
	},

	SetMotorTorque: function(torque)
	{
		this.m_maxMotorTorque = torque;
	},

	GetReactionForce: function(invTimeStep)
	{
		var tVec = this.m_ptpImpulse.Copy();
		tVec.Multiply(invTimeStep);
		//return invTimeStep * this.m_ptpImpulse;
		return tVec;
	},

	GetReactionTorque: function(invTimeStep)
	{
		return invTimeStep * this.m_limitImpulse;
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
		this.K = new b2Mat22();
		this.K1 = new b2Mat22();
		this.K2 = new b2Mat22();
		this.K3 = new b2Mat22();
		this.m_localAnchor1 = new b2Vec2();
		this.m_localAnchor2 = new b2Vec2();
		this.m_ptpImpulse = new b2Vec2();
		this.m_ptpMass = new b2Mat22();
		//

		//super(def);

		var tMat;
		var tX;
		var tY;

		//this.m_localAnchor1 = b2Math.b2MulTMV(this.m_body1.m_R, b2Math.SubtractVV( def.anchorPoint, this.m_body1.m_position));
		tMat = this.m_body1.m_R;
		tX = def.anchorPoint.x - this.m_body1.m_position.x;
		tY = def.anchorPoint.y - this.m_body1.m_position.y;
		this.m_localAnchor1.x = tX * tMat.col1.x + tY * tMat.col1.y;
		this.m_localAnchor1.y = tX * tMat.col2.x + tY * tMat.col2.y;
		//this.m_localAnchor2 = b2Math.b2MulTMV(this.m_body2.m_R, b2Math.SubtractVV( def.anchorPoint, this.m_body2.m_position));
		tMat = this.m_body2.m_R;
		tX = def.anchorPoint.x - this.m_body2.m_position.x;
		tY = def.anchorPoint.y - this.m_body2.m_position.y;
		this.m_localAnchor2.x = tX * tMat.col1.x + tY * tMat.col1.y;
		this.m_localAnchor2.y = tX * tMat.col2.x + tY * tMat.col2.y;

		this.m_intialAngle = this.m_body2.m_rotation - this.m_body1.m_rotation;

		this.m_ptpImpulse.Set(0.0, 0.0);
		this.m_motorImpulse = 0.0;
		this.m_limitImpulse = 0.0;
		this.m_limitPositionImpulse = 0.0;

		this.m_lowerAngle = def.lowerAngle;
		this.m_upperAngle = def.upperAngle;
		this.m_maxMotorTorque = def.motorTorque;
		this.m_motorSpeed = def.motorSpeed;
		this.m_enableLimit = def.enableLimit;
		this.m_enableMotor = def.enableMotor;
	},

	// internal vars
	K: new b2Mat22(),
	K1: new b2Mat22(),
	K2: new b2Mat22(),
	K3: new b2Mat22(),
	PrepareVelocitySolver: function(){
		var b1 = this.m_body1;
		var b2 = this.m_body2;

		var tMat;

		// Compute the effective mass matrix.
		//b2Vec2 r1 = b2Mul(b1->m_R, this.m_localAnchor1);
		tMat = b1.m_R;
		var r1X = tMat.col1.x * this.m_localAnchor1.x + tMat.col2.x * this.m_localAnchor1.y;
		var r1Y = tMat.col1.y * this.m_localAnchor1.x + tMat.col2.y * this.m_localAnchor1.y;
		//b2Vec2 r2 = b2Mul(b2->m_R, this.m_localAnchor2);
		tMat = b2.m_R;
		var r2X = tMat.col1.x * this.m_localAnchor2.x + tMat.col2.x * this.m_localAnchor2.y;
		var r2Y = tMat.col1.y * this.m_localAnchor2.x + tMat.col2.y * this.m_localAnchor2.y;

		// this.K    = [(1/m1 + 1/m2) * eye(2) - skew(r1) * invI1 * skew(r1) - skew(r2) * invI2 * skew(r2)]
		//      = [1/m1+1/m2     0    ] + invI1 * [r1.y*r1.y -r1.x*r1.y] + invI2 * [r1.y*r1.y -r1.x*r1.y]
		//        [    0     1/m1+1/m2]           [-r1.x*r1.y r1.x*r1.x]           [-r1.x*r1.y r1.x*r1.x]
		var invMass1 = b1.m_invMass;
		var invMass2 = b2.m_invMass;
		var invI1 = b1.m_invI;
		var invI2 = b2.m_invI;

		//var this.K1 = new b2Mat22();
		this.K1.col1.x = invMass1 + invMass2;	this.K1.col2.x = 0.0;
		this.K1.col1.y = 0.0;					this.K1.col2.y = invMass1 + invMass2;

		//var this.K2 = new b2Mat22();
		this.K2.col1.x =  invI1 * r1Y * r1Y;	this.K2.col2.x = -invI1 * r1X * r1Y;
		this.K2.col1.y = -invI1 * r1X * r1Y;	this.K2.col2.y =  invI1 * r1X * r1X;

		//var this.K3 = new b2Mat22();
		this.K3.col1.x =  invI2 * r2Y * r2Y;	this.K3.col2.x = -invI2 * r2X * r2Y;
		this.K3.col1.y = -invI2 * r2X * r2Y;	this.K3.col2.y =  invI2 * r2X * r2X;

		//var this.K = b2Math.AddMM(b2Math.AddMM(this.K1, this.K2), this.K3);
		this.K.SetM(this.K1);
		this.K.AddM(this.K2);
		this.K.AddM(this.K3);

		//this.m_ptpMass = this.K.Invert();
		this.K.Invert(this.m_ptpMass);

		this.m_motorMass = 1.0 / (invI1 + invI2);

		if (this.m_enableMotor == false)
		{
			this.m_motorImpulse = 0.0;
		}

		if (this.m_enableLimit)
		{
			var jointAngle = b2.m_rotation - b1.m_rotation - this.m_intialAngle;
			if (b2Math.b2Abs(this.m_upperAngle - this.m_lowerAngle) < 2.0 * b2Settings.b2_angularSlop)
			{
				this.m_limitState = b2Joint.e_equalLimits;
			}
			else if (jointAngle <= this.m_lowerAngle)
			{
				if (this.m_limitState != b2Joint.e_atLowerLimit)
				{
					this.m_limitImpulse = 0.0;
				}
				this.m_limitState = b2Joint.e_atLowerLimit;
			}
			else if (jointAngle >= this.m_upperAngle)
			{
				if (this.m_limitState != b2Joint.e_atUpperLimit)
				{
					this.m_limitImpulse = 0.0;
				}
				this.m_limitState = b2Joint.e_atUpperLimit;
			}
			else
			{
				this.m_limitState = b2Joint.e_inactiveLimit;
				this.m_limitImpulse = 0.0;
			}
		}
		else
		{
			this.m_limitImpulse = 0.0;
		}

		// Warm starting.
		if (b2World.s_enableWarmStarting)
		{
			//b1.m_linearVelocity.Subtract( b2Math.MulFV( invMass1, this.m_ptpImpulse) );
			b1.m_linearVelocity.x -= invMass1 * this.m_ptpImpulse.x;
			b1.m_linearVelocity.y -= invMass1 * this.m_ptpImpulse.y;
			//b1.m_angularVelocity -= invI1 * (b2Math.b2CrossVV(r1, this.m_ptpImpulse) + this.m_motorImpulse + this.m_limitImpulse);
			b1.m_angularVelocity -= invI1 * ((r1X * this.m_ptpImpulse.y - r1Y * this.m_ptpImpulse.x) + this.m_motorImpulse + this.m_limitImpulse);

			//b2.m_linearVelocity.Add( b2Math.MulFV( invMass2 , this.m_ptpImpulse ));
			b2.m_linearVelocity.x += invMass2 * this.m_ptpImpulse.x;
			b2.m_linearVelocity.y += invMass2 * this.m_ptpImpulse.y;
			//b2.m_angularVelocity += invI2 * (b2Math.b2CrossVV(r2, this.m_ptpImpulse) + this.m_motorImpulse + this.m_limitImpulse);
			b2.m_angularVelocity += invI2 * ((r2X * this.m_ptpImpulse.y - r2Y * this.m_ptpImpulse.x) + this.m_motorImpulse + this.m_limitImpulse);
		}
		else{
			this.m_ptpImpulse.SetZero();
			this.m_motorImpulse = 0.0;
			this.m_limitImpulse = 0.0;
		}

		this.m_limitPositionImpulse = 0.0;
	},


	SolveVelocityConstraints: function(step){
		var b1 = this.m_body1;
		var b2 = this.m_body2;

		var tMat;

		//var r1 = b2Math.b2MulMV(b1.m_R, this.m_localAnchor1);
		tMat = b1.m_R;
		var r1X = tMat.col1.x * this.m_localAnchor1.x + tMat.col2.x * this.m_localAnchor1.y;
		var r1Y = tMat.col1.y * this.m_localAnchor1.x + tMat.col2.y * this.m_localAnchor1.y;
		//var r2 = b2Math.b2MulMV(b2.m_R, this.m_localAnchor2);
		tMat = b2.m_R;
		var r2X = tMat.col1.x * this.m_localAnchor2.x + tMat.col2.x * this.m_localAnchor2.y;
		var r2Y = tMat.col1.y * this.m_localAnchor2.x + tMat.col2.y * this.m_localAnchor2.y;

		var oldLimitImpulse;

		// Solve point-to-point constraint
		//b2Vec2 ptpCdot = b2.m_linearVelocity + b2Cross(b2.m_angularVelocity, r2) - b1.m_linearVelocity - b2Cross(b1.m_angularVelocity, r1);
		var ptpCdotX = b2.m_linearVelocity.x + (-b2.m_angularVelocity * r2Y) - b1.m_linearVelocity.x - (-b1.m_angularVelocity * r1Y);
		var ptpCdotY = b2.m_linearVelocity.y + (b2.m_angularVelocity * r2X) - b1.m_linearVelocity.y - (b1.m_angularVelocity * r1X);

		//b2Vec2 ptpImpulse = -b2Mul(this.m_ptpMass, ptpCdot);
		var ptpImpulseX = -(this.m_ptpMass.col1.x * ptpCdotX + this.m_ptpMass.col2.x * ptpCdotY);
		var ptpImpulseY = -(this.m_ptpMass.col1.y * ptpCdotX + this.m_ptpMass.col2.y * ptpCdotY);
		this.m_ptpImpulse.x += ptpImpulseX;
		this.m_ptpImpulse.y += ptpImpulseY;

		//b1->m_linearVelocity -= b1->m_invMass * ptpImpulse;
		b1.m_linearVelocity.x -= b1.m_invMass * ptpImpulseX;
		b1.m_linearVelocity.y -= b1.m_invMass * ptpImpulseY;
		//b1->m_angularVelocity -= b1->m_invI * b2Cross(r1, ptpImpulse);
		b1.m_angularVelocity -= b1.m_invI * (r1X * ptpImpulseY - r1Y * ptpImpulseX);

		//b2->m_linearVelocity += b2->m_invMass * ptpImpulse;
		b2.m_linearVelocity.x += b2.m_invMass * ptpImpulseX;
		b2.m_linearVelocity.y += b2.m_invMass * ptpImpulseY;
		//b2->m_angularVelocity += b2->m_invI * b2Cross(r2, ptpImpulse);
		b2.m_angularVelocity += b2.m_invI * (r2X * ptpImpulseY - r2Y * ptpImpulseX);

		if (this.m_enableMotor && this.m_limitState != b2Joint.e_equalLimits)
		{
			var motorCdot = b2.m_angularVelocity - b1.m_angularVelocity - this.m_motorSpeed;
			var motorImpulse = -this.m_motorMass * motorCdot;
			var oldMotorImpulse = this.m_motorImpulse;
			this.m_motorImpulse = b2Math.b2Clamp(this.m_motorImpulse + motorImpulse, -step.dt * this.m_maxMotorTorque, step.dt * this.m_maxMotorTorque);
			motorImpulse = this.m_motorImpulse - oldMotorImpulse;
			b1.m_angularVelocity -= b1.m_invI * motorImpulse;
			b2.m_angularVelocity += b2.m_invI * motorImpulse;
		}

		if (this.m_enableLimit && this.m_limitState != b2Joint.e_inactiveLimit)
		{
			var limitCdot = b2.m_angularVelocity - b1.m_angularVelocity;
			var limitImpulse = -this.m_motorMass * limitCdot;

			if (this.m_limitState == b2Joint.e_equalLimits)
			{
				this.m_limitImpulse += limitImpulse;
			}
			else if (this.m_limitState == b2Joint.e_atLowerLimit)
			{
				oldLimitImpulse = this.m_limitImpulse;
				this.m_limitImpulse = b2Math.b2Max(this.m_limitImpulse + limitImpulse, 0.0);
				limitImpulse = this.m_limitImpulse - oldLimitImpulse;
			}
			else if (this.m_limitState == b2Joint.e_atUpperLimit)
			{
				oldLimitImpulse = this.m_limitImpulse;
				this.m_limitImpulse = b2Math.b2Min(this.m_limitImpulse + limitImpulse, 0.0);
				limitImpulse = this.m_limitImpulse - oldLimitImpulse;
			}

			b1.m_angularVelocity -= b1.m_invI * limitImpulse;
			b2.m_angularVelocity += b2.m_invI * limitImpulse;
		}
	},


	SolvePositionConstraints: function(){

		var oldLimitImpulse;
		var limitC;

		var b1 = this.m_body1;
		var b2 = this.m_body2;

		var positionError = 0.0;

		var tMat;

		// Solve point-to-point position error.
		//var r1 = b2Math.b2MulMV(b1.m_R, this.m_localAnchor1);
		tMat = b1.m_R;
		var r1X = tMat.col1.x * this.m_localAnchor1.x + tMat.col2.x * this.m_localAnchor1.y;
		var r1Y = tMat.col1.y * this.m_localAnchor1.x + tMat.col2.y * this.m_localAnchor1.y;
		//var r2 = b2Math.b2MulMV(b2.m_R, this.m_localAnchor2);
		tMat = b2.m_R;
		var r2X = tMat.col1.x * this.m_localAnchor2.x + tMat.col2.x * this.m_localAnchor2.y;
		var r2Y = tMat.col1.y * this.m_localAnchor2.x + tMat.col2.y * this.m_localAnchor2.y;

		//b2Vec2 p1 = b1->m_position + r1;
		var p1X = b1.m_position.x + r1X;
		var p1Y = b1.m_position.y + r1Y;
		//b2Vec2 p2 = b2->m_position + r2;
		var p2X = b2.m_position.x + r2X;
		var p2Y = b2.m_position.y + r2Y;

		//b2Vec2 ptpC = p2 - p1;
		var ptpCX = p2X - p1X;
		var ptpCY = p2Y - p1Y;

		//float32 positionError = ptpC.Length();
		positionError = Math.sqrt(ptpCX*ptpCX + ptpCY*ptpCY);

		// Prevent overly large corrections.
		//b2Vec2 dpMax(b2_maxLinearCorrection, b2_maxLinearCorrection);
		//ptpC = b2Clamp(ptpC, -dpMax, dpMax);

		//float32 invMass1 = b1->m_invMass, invMass2 = b2->m_invMass;
		var invMass1 = b1.m_invMass;
		var invMass2 = b2.m_invMass;
		//float32 invI1 = b1->m_invI, invI2 = b2->m_invI;
		var invI1 = b1.m_invI;
		var invI2 = b2.m_invI;

		//b2Mat22 this.K1;
		this.K1.col1.x = invMass1 + invMass2;	this.K1.col2.x = 0.0;
		this.K1.col1.y = 0.0;					this.K1.col2.y = invMass1 + invMass2;

		//b2Mat22 this.K2;
		this.K2.col1.x =  invI1 * r1Y * r1Y;	this.K2.col2.x = -invI1 * r1X * r1Y;
		this.K2.col1.y = -invI1 * r1X * r1Y;	this.K2.col2.y =  invI1 * r1X * r1X;

		//b2Mat22 this.K3;
		this.K3.col1.x =  invI2 * r2Y * r2Y;		this.K3.col2.x = -invI2 * r2X * r2Y;
		this.K3.col1.y = -invI2 * r2X * r2Y;		this.K3.col2.y =  invI2 * r2X * r2X;

		//b2Mat22 this.K = this.K1 + this.K2 + this.K3;
		this.K.SetM(this.K1);
		this.K.AddM(this.K2);
		this.K.AddM(this.K3);
		//b2Vec2 impulse = this.K.Solve(-ptpC);
		this.K.Solve(b2RevoluteJoint.tImpulse, -ptpCX, -ptpCY);
		var impulseX = b2RevoluteJoint.tImpulse.x;
		var impulseY = b2RevoluteJoint.tImpulse.y;

		//b1.m_position -= b1.m_invMass * impulse;
		b1.m_position.x -= b1.m_invMass * impulseX;
		b1.m_position.y -= b1.m_invMass * impulseY;
		//b1.m_rotation -= b1.m_invI * b2Cross(r1, impulse);
		b1.m_rotation -= b1.m_invI * (r1X * impulseY - r1Y * impulseX);
		b1.m_R.Set(b1.m_rotation);

		//b2.m_position += b2.m_invMass * impulse;
		b2.m_position.x += b2.m_invMass * impulseX;
		b2.m_position.y += b2.m_invMass * impulseY;
		//b2.m_rotation += b2.m_invI * b2Cross(r2, impulse);
		b2.m_rotation += b2.m_invI * (r2X * impulseY - r2Y * impulseX);
		b2.m_R.Set(b2.m_rotation);


		// Handle limits.
		var angularError = 0.0;

		if (this.m_enableLimit && this.m_limitState != b2Joint.e_inactiveLimit)
		{
			var angle = b2.m_rotation - b1.m_rotation - this.m_intialAngle;
			var limitImpulse = 0.0;

			if (this.m_limitState == b2Joint.e_equalLimits)
			{
				// Prevent large angular corrections
				limitC = b2Math.b2Clamp(angle, -b2Settings.b2_maxAngularCorrection, b2Settings.b2_maxAngularCorrection);
				limitImpulse = -this.m_motorMass * limitC;
				angularError = b2Math.b2Abs(limitC);
			}
			else if (this.m_limitState == b2Joint.e_atLowerLimit)
			{
				limitC = angle - this.m_lowerAngle;
				angularError = b2Math.b2Max(0.0, -limitC);

				// Prevent large angular corrections and allow some slop.
				limitC = b2Math.b2Clamp(limitC + b2Settings.b2_angularSlop, -b2Settings.b2_maxAngularCorrection, 0.0);
				limitImpulse = -this.m_motorMass * limitC;
				oldLimitImpulse = this.m_limitPositionImpulse;
				this.m_limitPositionImpulse = b2Math.b2Max(this.m_limitPositionImpulse + limitImpulse, 0.0);
				limitImpulse = this.m_limitPositionImpulse - oldLimitImpulse;
			}
			else if (this.m_limitState == b2Joint.e_atUpperLimit)
			{
				limitC = angle - this.m_upperAngle;
				angularError = b2Math.b2Max(0.0, limitC);

				// Prevent large angular corrections and allow some slop.
				limitC = b2Math.b2Clamp(limitC - b2Settings.b2_angularSlop, 0.0, b2Settings.b2_maxAngularCorrection);
				limitImpulse = -this.m_motorMass * limitC;
				oldLimitImpulse = this.m_limitPositionImpulse;
				this.m_limitPositionImpulse = b2Math.b2Min(this.m_limitPositionImpulse + limitImpulse, 0.0);
				limitImpulse = this.m_limitPositionImpulse - oldLimitImpulse;
			}

			b1.m_rotation -= b1.m_invI * limitImpulse;
			b1.m_R.Set(b1.m_rotation);
			b2.m_rotation += b2.m_invI * limitImpulse;
			b2.m_R.Set(b2.m_rotation);
		}

		return positionError <= b2Settings.b2_linearSlop && angularError <= b2Settings.b2_angularSlop;
	},

	m_localAnchor1: new b2Vec2(),
	m_localAnchor2: new b2Vec2(),
	m_ptpImpulse: new b2Vec2(),
	m_motorImpulse: null,
	m_limitImpulse: null,
	m_limitPositionImpulse: null,

	m_ptpMass: new b2Mat22(),
	m_motorMass: null,
	m_intialAngle: null,
	m_lowerAngle: null,
	m_upperAngle: null,
	m_maxMotorTorque: null,
	m_motorSpeed: null,

	m_enableLimit: null,
	m_enableMotor: null,
	m_limitState: 0});

b2RevoluteJoint.tImpulse = new b2Vec2();
