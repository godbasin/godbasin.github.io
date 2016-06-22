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





var b2NullContact = Class.create();
Object.extend(b2NullContact.prototype, b2Contact.prototype);
Object.extend(b2NullContact.prototype, 
{
		initialize: function(s1, s2) {
		// The constructor for b2Contact
		// initialize instance variables for references
		this.m_node1 = new b2ContactNode();
		this.m_node2 = new b2ContactNode();
		//
		this.m_flags = 0;

		if (!s1 || !s2){
			this.m_shape1 = null;
			this.m_shape2 = null;
			return;
		}

		this.m_shape1 = s1;
		this.m_shape2 = s2;

		this.m_manifoldCount = 0;

		this.m_friction = Math.sqrt(this.m_shape1.m_friction * this.m_shape2.m_friction);
		this.m_restitution = b2Math.b2Max(this.m_shape1.m_restitution, this.m_shape2.m_restitution);

		this.m_prev = null;
		this.m_next = null;

		this.m_node1.contact = null;
		this.m_node1.prev = null;
		this.m_node1.next = null;
		this.m_node1.other = null;

		this.m_node2.contact = null;
		this.m_node2.prev = null;
		this.m_node2.next = null;
		this.m_node2.other = null;
		//
},
	Evaluate: function() {},
	GetManifolds: function(){ return null; }});

