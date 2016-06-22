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





var b2PrismaticJointDef = Class.create();
Object.extend(b2PrismaticJointDef.prototype, b2JointDef.prototype);
Object.extend(b2PrismaticJointDef.prototype, 
{
	initialize: function()
	{
		// The constructor for b2JointDef
		this.type = b2Joint.e_unknownJoint;
		this.userData = null;
		this.body1 = null;
		this.body2 = null;
		this.collideConnected = false;
		//

		this.type = b2Joint.e_prismaticJoint;
		this.anchorPoint = new b2Vec2(0.0, 0.0);
		this.axis = new b2Vec2(0.0, 0.0);
		this.lowerTranslation = 0.0;
		this.upperTranslation = 0.0;
		this.motorForce = 0.0;
		this.motorSpeed = 0.0;
		this.enableLimit = false;
		this.enableMotor = false;
	},

	anchorPoint: null,
	axis: null,
	lowerTranslation: null,
	upperTranslation: null,
	motorForce: null,
	motorSpeed: null,
	enableLimit: null,
	enableMotor: null});

