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






// A rigid body. Internal computation are done in terms
// of the center of mass position. The center of mass may
// be offset from the body's origin.
var b2Body = Class.create();
b2Body.prototype = 
{
	// Set the position of the body's origin and rotation (radians).
	// This breaks any contacts and wakes the other bodies.
	SetOriginPosition: function(position, rotation){
		if (this.IsFrozen())
		{
			return;
		}

		this.m_rotation = rotation;
		this.m_R.Set(this.m_rotation);
		this.m_position = b2Math.AddVV(position , b2Math.b2MulMV(this.m_R, this.m_center));

		this.m_position0.SetV(this.m_position);
		this.m_rotation0 = this.m_rotation;

		for (var s = this.m_shapeList; s != null; s = s.m_next)
		{
			s.Synchronize(this.m_position, this.m_R, this.m_position, this.m_R);
		}

		this.m_world.m_broadPhase.Commit();
	},

	// Get the position of the body's origin. The body's origin does not
	// necessarily coincide with the center of mass. It depends on how the
	// shapes are created.
	GetOriginPosition: function(){
		return b2Math.SubtractVV(this.m_position, b2Math.b2MulMV(this.m_R, this.m_center));
	},

	// Set the position of the body's center of mass and rotation (radians).
	// This breaks any contacts and wakes the other bodies.
	SetCenterPosition: function(position, rotation){
		if (this.IsFrozen())
		{
			return;
		}

		this.m_rotation = rotation;
		this.m_R.Set(this.m_rotation);
		this.m_position.SetV( position );

		this.m_position0.SetV(this.m_position);
		this.m_rotation0 = this.m_rotation;

		for (var s = this.m_shapeList; s != null; s = s.m_next)
		{
			s.Synchronize(this.m_position, this.m_R, this.m_position, this.m_R);
		}

		this.m_world.m_broadPhase.Commit();
	},

	// Get the position of the body's center of mass. The body's center of mass
	// does not necessarily coincide with the body's origin. It depends on how the
	// shapes are created.
	GetCenterPosition: function(){
		return this.m_position;
	},

	// Get the rotation in radians.
	GetRotation: function(){
		return this.m_rotation;
	},

	GetRotationMatrix: function(){
		return this.m_R;
	},

	// Set/Get the linear velocity of the center of mass.
	SetLinearVelocity: function(v){
		this.m_linearVelocity.SetV(v);
	},
	GetLinearVelocity: function(){
		return this.m_linearVelocity;
	},

	// Set/Get the angular velocity.
	SetAngularVelocity: function(w){
		this.m_angularVelocity = w;
	},
	GetAngularVelocity: function(){
		return this.m_angularVelocity;
	},

	// Apply a force at a world point. Additive.
	ApplyForce: function(force, point)
	{
		if (this.IsSleeping() == false)
		{
			this.m_force.Add( force );
			this.m_torque += b2Math.b2CrossVV(b2Math.SubtractVV(point, this.m_position), force);
		}
	},

	// Apply a torque. Additive.
	ApplyTorque: function(torque)
	{
		if (this.IsSleeping() == false)
		{
			this.m_torque += torque;
		}
	},

	// Apply an impulse at a point. This immediately modifies the velocity.
	ApplyImpulse: function(impulse, point)
	{
		if (this.IsSleeping() == false)
		{
			this.m_linearVelocity.Add( b2Math.MulFV(this.m_invMass, impulse) );
			this.m_angularVelocity += ( this.m_invI * b2Math.b2CrossVV( b2Math.SubtractVV(point, this.m_position), impulse)  );
		}
	},

	GetMass: function(){
		return this.m_mass;
	},

	GetInertia: function(){
		return this.m_I;
	},

	// Get the world coordinates of a point give the local coordinates
	// relative to the body's center of mass.
	GetWorldPoint: function(localPoint){
		return b2Math.AddVV(this.m_position , b2Math.b2MulMV(this.m_R, localPoint));
	},

	// Get the world coordinates of a vector given the local coordinates.
	GetWorldVector: function(localVector){
		return b2Math.b2MulMV(this.m_R, localVector);
	},

	// Returns a local point relative to the center of mass given a world point.
	GetLocalPoint: function(worldPoint){
		return b2Math.b2MulTMV(this.m_R, b2Math.SubtractVV(worldPoint, this.m_position));
	},

	// Returns a local vector given a world vector.
	GetLocalVector: function(worldVector){
		return b2Math.b2MulTMV(this.m_R, worldVector);
	},

	// Is this body static (immovable)?
	IsStatic: function(){
		return (this.m_flags & b2Body.e_staticFlag) == b2Body.e_staticFlag;
	},

	IsFrozen: function()
	{
		return (this.m_flags & b2Body.e_frozenFlag) == b2Body.e_frozenFlag;
	},

	// Is this body sleeping (not simulating).
	IsSleeping: function(){
		return (this.m_flags & b2Body.e_sleepFlag) == b2Body.e_sleepFlag;
	},

	// You can disable sleeping on this particular body.
	AllowSleeping: function(flag)
	{
		if (flag)
		{
			this.m_flags |= b2Body.e_allowSleepFlag;
		}
		else
		{
			this.m_flags &= ~b2Body.e_allowSleepFlag;
			this.WakeUp();
		}
	},

	// Wake up this body so it will begin simulating.
	WakeUp: function(){
		this.m_flags &= ~b2Body.e_sleepFlag;
		this.m_sleepTime = 0.0;
	},

	// Get the list of all shapes attached to this body.
	GetShapeList: function(){
		return this.m_shapeList;
	},

	GetContactList: function()
	{
		return this.m_contactList;
	},

	GetJointList: function()
	{
		return this.m_jointList;
	},

	// Get the next body in the world's body list.
	GetNext: function(){
		return this.m_next;
	},

	GetUserData: function(){
		return this.m_userData;
	},

	//--------------- Internals Below -------------------

	initialize: function(bd, world){
		// initialize instance variables for references
		this.sMat0 = new b2Mat22();
		this.m_position = new b2Vec2();
		this.m_R = new b2Mat22(0);
		this.m_position0 = new b2Vec2();
		//

		var i = 0;
		var sd;
		var massData;

		this.m_flags = 0;
		this.m_position.SetV( bd.position );
		this.m_rotation = bd.rotation;
		this.m_R.Set(this.m_rotation);
		this.m_position0.SetV(this.m_position);
		this.m_rotation0 = this.m_rotation;
		this.m_world = world;

		this.m_linearDamping = b2Math.b2Clamp(1.0 - bd.linearDamping, 0.0, 1.0);
		this.m_angularDamping = b2Math.b2Clamp(1.0 - bd.angularDamping, 0.0, 1.0);

		this.m_force = new b2Vec2(0.0, 0.0);
		this.m_torque = 0.0;

		this.m_mass = 0.0;

		var massDatas = new Array(b2Settings.b2_maxShapesPerBody);
		for (i = 0; i < b2Settings.b2_maxShapesPerBody; i++){
			massDatas[i] = new b2MassData();
		}

		// Compute the shape mass properties, the bodies total mass and COM.
		this.m_shapeCount = 0;
		this.m_center = new b2Vec2(0.0, 0.0);
		for (i = 0; i < b2Settings.b2_maxShapesPerBody; ++i)
		{
			sd = bd.shapes[i];
			if (sd == null) break;
			massData = massDatas[ i ];
			sd.ComputeMass(massData);
			this.m_mass += massData.mass;
			//this.m_center += massData->mass * (sd->localPosition + massData->center);
			this.m_center.x += massData.mass * (sd.localPosition.x + massData.center.x);
			this.m_center.y += massData.mass * (sd.localPosition.y + massData.center.y);
			++this.m_shapeCount;
		}

		// Compute center of mass, and shift the origin to the COM.
		if (this.m_mass > 0.0)
		{
			this.m_center.Multiply( 1.0 / this.m_mass );
			this.m_position.Add( b2Math.b2MulMV(this.m_R, this.m_center) );
		}
		else
		{
			this.m_flags |= b2Body.e_staticFlag;
		}

		// Compute the moment of inertia.
		this.m_I = 0.0;
		for (i = 0; i < this.m_shapeCount; ++i)
		{
			sd = bd.shapes[i];
			massData = massDatas[ i ];
			this.m_I += massData.I;
			var r = b2Math.SubtractVV( b2Math.AddVV(sd.localPosition, massData.center), this.m_center );
			this.m_I += massData.mass * b2Math.b2Dot(r, r);
		}

		if (this.m_mass > 0.0)
		{
			this.m_invMass = 1.0 / this.m_mass;
		}
		else
		{
			this.m_invMass = 0.0;
		}

		if (this.m_I > 0.0 && bd.preventRotation == false)
		{
			this.m_invI = 1.0 / this.m_I;
		}
		else
		{
			this.m_I = 0.0;
			this.m_invI = 0.0;
		}

		// Compute the center of mass velocity.
		this.m_linearVelocity = b2Math.AddVV(bd.linearVelocity, b2Math.b2CrossFV(bd.angularVelocity, this.m_center));
		this.m_angularVelocity = bd.angularVelocity;

		this.m_jointList = null;
		this.m_contactList = null;
		this.m_prev = null;
		this.m_next = null;

		// Create the shapes.
		this.m_shapeList = null;
		for (i = 0; i < this.m_shapeCount; ++i)
		{
			sd = bd.shapes[i];
			var shape = b2Shape.Create(sd, this, this.m_center);
			shape.m_next = this.m_shapeList;
			this.m_shapeList = shape;
		}

		this.m_sleepTime = 0.0;
		if (bd.allowSleep)
		{
			this.m_flags |= b2Body.e_allowSleepFlag;
		}
		if (bd.isSleeping)
		{
			this.m_flags |= b2Body.e_sleepFlag;
		}

		if ((this.m_flags & b2Body.e_sleepFlag)  || this.m_invMass == 0.0)
		{
			this.m_linearVelocity.Set(0.0, 0.0);
			this.m_angularVelocity = 0.0;
		}

		this.m_userData = bd.userData;
	},
	// does not support destructors
	/*~b2Body(){
		b2Shape* s = this.m_shapeList;
		while (s)
		{
			b2Shape* s0 = s;
			s = s->this.m_next;

			b2Shape::this.Destroy(s0);
		}
	}*/

	Destroy: function(){
		var s = this.m_shapeList;
		while (s)
		{
			var s0 = s;
			s = s.m_next;

			b2Shape.Destroy(s0);
		}
	},

	// Temp mat
	sMat0: new b2Mat22(),
	SynchronizeShapes: function(){
		//b2Mat22 R0(this.m_rotation0);
		this.sMat0.Set(this.m_rotation0);
		for (var s = this.m_shapeList; s != null; s = s.m_next)
		{
			s.Synchronize(this.m_position0, this.sMat0, this.m_position, this.m_R);
		}
	},

	QuickSyncShapes: function(){
		for (var s = this.m_shapeList; s != null; s = s.m_next)
		{
			s.QuickSync(this.m_position, this.m_R);
		}
	},

	// This is used to prevent connected bodies from colliding.
	// It may lie, depending on the collideConnected flag.
	IsConnected: function(other){
		for (var jn = this.m_jointList; jn != null; jn = jn.next)
		{
			if (jn.other == other)
				return jn.joint.m_collideConnected == false;
		}

		return false;
	},

	Freeze: function(){
		this.m_flags |= b2Body.e_frozenFlag;
		this.m_linearVelocity.SetZero();
		this.m_angularVelocity = 0.0;

		for (var s = this.m_shapeList; s != null; s = s.m_next)
		{
			s.DestroyProxy();
		}
	},

	m_flags: 0,

	m_position: new b2Vec2(),
	m_rotation: null,
	m_R: new b2Mat22(0),

	// Conservative advancement data.
	m_position0: new b2Vec2(),
	m_rotation0: null,

	m_linearVelocity: null,
	m_angularVelocity: null,

	m_force: null,
	m_torque: null,

	m_center: null,

	m_world: null,
	m_prev: null,
	m_next: null,

	m_shapeList: null,
	m_shapeCount: 0,

	m_jointList: null,
	m_contactList: null,

	m_mass: null,
	m_invMass: null,
	m_I: null,
	m_invI: null,

	m_linearDamping: null,
	m_angularDamping: null,

	m_sleepTime: null,

	m_userData: null};
b2Body.e_staticFlag = 0x0001;
b2Body.e_frozenFlag = 0x0002;
b2Body.e_islandFlag = 0x0004;
b2Body.e_sleepFlag = 0x0008;
b2Body.e_allowSleepFlag = 0x0010;
b2Body.e_destroyFlag = 0x0020;
