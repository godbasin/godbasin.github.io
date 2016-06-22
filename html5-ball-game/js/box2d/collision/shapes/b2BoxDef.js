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







var b2BoxDef = Class.create();
Object.extend(b2BoxDef.prototype, b2ShapeDef.prototype);
Object.extend(b2BoxDef.prototype, 
{
	initialize: function()
	{
		// The constructor for b2ShapeDef
		this.type = b2Shape.e_unknownShape;
		this.userData = null;
		this.localPosition = new b2Vec2(0.0, 0.0);
		this.localRotation = 0.0;
		this.friction = 0.2;
		this.restitution = 0.0;
		this.density = 0.0;
		this.categoryBits = 0x0001;
		this.maskBits = 0xFFFF;
		this.groupIndex = 0;	
		//

		this.type = b2Shape.e_boxShape;
		this.extents = new b2Vec2(1.0, 1.0);
	},

	extents: null});

