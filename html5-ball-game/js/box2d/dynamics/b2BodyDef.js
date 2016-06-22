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





var b2BodyDef = Class.create();
b2BodyDef.prototype = 
{
	initialize: function()
	{
		// initialize instance variables for references
		this.shapes = new Array();
		//

		this.userData = null;
		for (var i = 0; i < b2Settings.b2_maxShapesPerBody; i++){
			this.shapes[i] = null;
		}
		this.position = new b2Vec2(0.0, 0.0);
		this.rotation = 0.0;
		this.linearVelocity = new b2Vec2(0.0, 0.0);
		this.angularVelocity = 0.0;
		this.linearDamping = 0.0;
		this.angularDamping = 0.0;
		this.allowSleep = true;
		this.isSleeping = false;
		this.preventRotation = false;
	},

	userData: null,
	shapes: new Array(),
	position: null,
	rotation: null,
	linearVelocity: null,
	angularVelocity: null,
	linearDamping: null,
	angularDamping: null,
	allowSleep: null,
	isSleeping: null,
	preventRotation: null,

	AddShape: function(shape)
	{
		for (var i = 0; i < b2Settings.b2_maxShapesPerBody; ++i)
		{
			if (this.shapes[i] == null)
			{
				this.shapes[i] = shape;
				break;
			}
		}
	}};
