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





var b2ContactManager = Class.create();
Object.extend(b2ContactManager.prototype, b2PairCallback.prototype);
Object.extend(b2ContactManager.prototype, 
{
	initialize: function(){
		// The constructor for b2PairCallback
		//

		// initialize instance variables for references
		this.m_nullContact = new b2NullContact();
		//

		this.m_world = null;
		this.m_destroyImmediate = false;
	},

	// This is a callback from the broadphase when two AABB proxies begin
	// to overlap. We create a b2Contact to manage the narrow phase.
	PairAdded: function(proxyUserData1, proxyUserData2){
		var shape1 = proxyUserData1;
		var shape2 = proxyUserData2;

		var body1 = shape1.m_body;
		var body2 = shape2.m_body;

		if (body1.IsStatic() && body2.IsStatic())
		{
			return this.m_nullContact;
		}

		if (shape1.m_body == shape2.m_body)
		{
			return this.m_nullContact;
		}

		if (body2.IsConnected(body1))
		{
			return this.m_nullContact;
		}

		if (this.m_world.m_filter != null && this.m_world.m_filter.ShouldCollide(shape1, shape2) == false)
		{
			return this.m_nullContact;
		}

		// Ensure that body2 is dynamic (body1 is static or dynamic).
		if (body2.m_invMass == 0.0)
		{
			var tempShape = shape1;
			shape1 = shape2;
			shape2 = tempShape;
			//b2Math.b2Swap(shape1, shape2);
			var tempBody = body1;
			body1 = body2;
			body2 = tempBody;
			//b2Math.b2Swap(body1, body2);
		}

		// Call the factory.
		var contact = b2Contact.Create(shape1, shape2, this.m_world.m_blockAllocator);

		if (contact == null)
		{
			return this.m_nullContact;
		}
		else
		{
			// Insert into the world.
			contact.m_prev = null;
			contact.m_next = this.m_world.m_contactList;
			if (this.m_world.m_contactList != null)
			{
				this.m_world.m_contactList.m_prev = contact;
			}
			this.m_world.m_contactList = contact;
			this.m_world.m_contactCount++;
		}

		return contact;
	},

	// This is a callback from the broadphase when two AABB proxies cease
	// to overlap. We destroy the b2Contact.
	PairRemoved: function(proxyUserData1, proxyUserData2, pairUserData){

		if (pairUserData == null)
		{
			return;
		}

		var c = pairUserData;
		if (c != this.m_nullContact)
		{
			//b2Settings.b2Assert(this.m_world.m_contactCount > 0);
			if (this.m_destroyImmediate == true)
			{
				this.DestroyContact(c);
				c = null;
			}
			else
			{
				c.m_flags |= b2Contact.e_destroyFlag;
			}
		}
	},

	DestroyContact: function(c)
	{

		//b2Settings.b2Assert(this.m_world.m_contactCount > 0);

		// Remove from the world.
		if (c.m_prev)
		{
			c.m_prev.m_next = c.m_next;
		}

		if (c.m_next)
		{
			c.m_next.m_prev = c.m_prev;
		}

		if (c == this.m_world.m_contactList)
		{
			this.m_world.m_contactList = c.m_next;
		}

		// If there are contact points, then disconnect from the island graph.
		if (c.GetManifoldCount() > 0)
		{
			var body1 = c.m_shape1.m_body;
			var body2 = c.m_shape2.m_body;
			var node1 = c.m_node1;
			var node2 = c.m_node2;

			// Wake up touching bodies.
			body1.WakeUp();
			body2.WakeUp();

			// Remove from body 1
			if (node1.prev)
			{
				node1.prev.next = node1.next;
			}

			if (node1.next)
			{
				node1.next.prev = node1.prev;
			}

			if (node1 == body1.m_contactList)
			{
				body1.m_contactList = node1.next;
			}

			node1.prev = null;
			node1.next = null;

			// Remove from body 2
			if (node2.prev)
			{
				node2.prev.next = node2.next;
			}

			if (node2.next)
			{
				node2.next.prev = node2.prev;
			}

			if (node2 == body2.m_contactList)
			{
				body2.m_contactList = node2.next;
			}

			node2.prev = null;
			node2.next = null;
		}

		// Call the factory.
		b2Contact.Destroy(c, this.m_world.m_blockAllocator);
		--this.m_world.m_contactCount;
	},


	// Destroy any contacts marked for deferred destruction.
	CleanContactList: function()
	{
		var c = this.m_world.m_contactList;
		while (c != null)
		{
			var c0 = c;
			c = c.m_next;

			if (c0.m_flags & b2Contact.e_destroyFlag)
			{
				this.DestroyContact(c0);
				c0 = null;
			}
		}
	},


	// This is the top level collision call for the time step. Here
	// all the narrow phase collision is processed for the world
	// contact list.
	Collide: function()
	{
		var body1;
		var body2;
		var node1;
		var node2;

		for (var c = this.m_world.m_contactList; c != null; c = c.m_next)
		{
			if (c.m_shape1.m_body.IsSleeping() &&
				c.m_shape2.m_body.IsSleeping())
			{
				continue;
			}

			var oldCount = c.GetManifoldCount();
			c.Evaluate();

			var newCount = c.GetManifoldCount();

			if (oldCount == 0 && newCount > 0)
			{
				//b2Settings.b2Assert(c.GetManifolds().pointCount > 0);

				// Connect to island graph.
				body1 = c.m_shape1.m_body;
				body2 = c.m_shape2.m_body;
				node1 = c.m_node1;
				node2 = c.m_node2;

				// Connect to body 1
				node1.contact = c;
				node1.other = body2;

				node1.prev = null;
				node1.next = body1.m_contactList;
				if (node1.next != null)
				{
					node1.next.prev = c.m_node1;
				}
				body1.m_contactList = c.m_node1;

				// Connect to body 2
				node2.contact = c;
				node2.other = body1;

				node2.prev = null;
				node2.next = body2.m_contactList;
				if (node2.next != null)
				{
					node2.next.prev = node2;
				}
				body2.m_contactList = node2;
			}
			else if (oldCount > 0 && newCount == 0)
			{
				// Disconnect from island graph.
				body1 = c.m_shape1.m_body;
				body2 = c.m_shape2.m_body;
				node1 = c.m_node1;
				node2 = c.m_node2;

				// Remove from body 1
				if (node1.prev)
				{
					node1.prev.next = node1.next;
				}

				if (node1.next)
				{
					node1.next.prev = node1.prev;
				}

				if (node1 == body1.m_contactList)
				{
					body1.m_contactList = node1.next;
				}

				node1.prev = null;
				node1.next = null;

				// Remove from body 2
				if (node2.prev)
				{
					node2.prev.next = node2.next;
				}

				if (node2.next)
				{
					node2.next.prev = node2.prev;
				}

				if (node2 == body2.m_contactList)
				{
					body2.m_contactList = node2.next;
				}

				node2.prev = null;
				node2.next = null;
			}
		}
	},

	m_world: null,

	// This lets us provide broadphase proxy pair user data for
	// contacts that shouldn't exist.
	m_nullContact: new b2NullContact(),
	m_destroyImmediate: null});

