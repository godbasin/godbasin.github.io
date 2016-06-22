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



var b2PairCallback = Class.create();
b2PairCallback.prototype = 
{
	//virtual ~b2PairCallback() {}

	// This returns the new pair user data.
	PairAdded: function(proxyUserData1, proxyUserData2){return null},

	// This should free the pair's user data. In extreme circumstances, it is possible
	// this will be called with null pairUserData because the pair never existed.
	PairRemoved: function(proxyUserData1, proxyUserData2, pairUserData){},
	initialize: function() {}};


