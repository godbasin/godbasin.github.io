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





var b2ContactConstraint = Class.create();
b2ContactConstraint.prototype = 
{
	initialize: function(){
		// initialize instance variables for references
		this.normal = new b2Vec2();
		//

		this.points = new Array(b2Settings.b2_maxManifoldPoints);
		for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++){
			this.points[i] = new b2ContactConstraintPoint();
		}


	},
	points: null,
	normal: new b2Vec2(),
	manifold: null,
	body1: null,
	body2: null,
	friction: null,
	restitution: null,
	pointCount: 0};
