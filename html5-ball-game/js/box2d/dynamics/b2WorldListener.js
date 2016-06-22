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







var b2WorldListener = Class.create();
b2WorldListener.prototype = 
{

	// If a body is destroyed, then any joints attached to it are also destroyed.
	// This prevents memory leaks, but you may unexpectedly be left with an
	// orphaned joint pointer.
	// Box2D will notify you when a joint is implicitly destroyed.
	// It is NOT called if you directly destroy a joint.
	// Implement this abstract class and provide it to b2World via
	// b2World::SetListener().
	// DO NOT modify the Box2D world inside this callback.
	NotifyJointDestroyed: function(joint){},

	// This is called when a body's shape passes outside of the world boundary. If you
	// override this and pass back e_destroyBody, you must nullify your copies of the
	// body pointer.
	NotifyBoundaryViolated: function(body)
	{
		//NOT_USED(body);
		return b2WorldListener.b2_freezeBody;
	},



	initialize: function() {}};
b2WorldListener.b2_freezeBody = 0;
b2WorldListener.b2_destroyBody = 1;
