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





//typedef b2Contact* b2ContactCreateFcn(b2Shape* shape1, b2Shape* shape2, b2BlockAllocator* allocator);
//typedef void b2ContactDestroyFcn(b2Contact* contact, b2BlockAllocator* allocator);



var b2Contact = Class.create();
b2Contact.prototype = 
{
	GetManifolds: function(){return null},
	GetManifoldCount: function()
	{
		return this.m_manifoldCount;
	},

	GetNext: function(){
		return this.m_next;
	},

	GetShape1: function(){
		return this.m_shape1;
	},

	GetShape2: function(){
		return this.m_shape2;
	},

	//--------------- Internals Below -------------------

	// this.m_flags
	// enum


	initialize: function(s1, s2)
	{
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
	},

	//virtual ~b2Contact() {}

	Evaluate: function(){},

	m_flags: 0,

	// World pool and list pointers.
	m_prev: null,
	m_next: null,

	// Nodes for connecting bodies.
	m_node1: new b2ContactNode(),
	m_node2: new b2ContactNode(),

	m_shape1: null,
	m_shape2: null,

	m_manifoldCount: 0,

	// Combined friction
	m_friction: null,
	m_restitution: null};
b2Contact.e_islandFlag = 0x0001;
b2Contact.e_destroyFlag = 0x0002;
b2Contact.AddType = function(createFcn, destroyFcn, type1, type2)
	{
		//b2Settings.b2Assert(b2Shape.e_unknownShape < type1 && type1 < b2Shape.e_shapeTypeCount);
		//b2Settings.b2Assert(b2Shape.e_unknownShape < type2 && type2 < b2Shape.e_shapeTypeCount);

		b2Contact.s_registers[type1][type2].createFcn = createFcn;
		b2Contact.s_registers[type1][type2].destroyFcn = destroyFcn;
		b2Contact.s_registers[type1][type2].primary = true;

		if (type1 != type2)
		{
			b2Contact.s_registers[type2][type1].createFcn = createFcn;
			b2Contact.s_registers[type2][type1].destroyFcn = destroyFcn;
			b2Contact.s_registers[type2][type1].primary = false;
		}
	};
b2Contact.InitializeRegisters = function(){
		b2Contact.s_registers = new Array(b2Shape.e_shapeTypeCount);
		for (var i = 0; i < b2Shape.e_shapeTypeCount; i++){
			b2Contact.s_registers[i] = new Array(b2Shape.e_shapeTypeCount);
			for (var j = 0; j < b2Shape.e_shapeTypeCount; j++){
				b2Contact.s_registers[i][j] = new b2ContactRegister();
			}
		}

		b2Contact.AddType(b2CircleContact.Create, b2CircleContact.Destroy, b2Shape.e_circleShape, b2Shape.e_circleShape);
		b2Contact.AddType(b2PolyAndCircleContact.Create, b2PolyAndCircleContact.Destroy, b2Shape.e_polyShape, b2Shape.e_circleShape);
		b2Contact.AddType(b2PolyContact.Create, b2PolyContact.Destroy, b2Shape.e_polyShape, b2Shape.e_polyShape);

	};
b2Contact.Create = function(shape1, shape2, allocator){
		if (b2Contact.s_initialized == false)
		{
			b2Contact.InitializeRegisters();
			b2Contact.s_initialized = true;
		}

		var type1 = shape1.m_type;
		var type2 = shape2.m_type;

		//b2Settings.b2Assert(b2Shape.e_unknownShape < type1 && type1 < b2Shape.e_shapeTypeCount);
		//b2Settings.b2Assert(b2Shape.e_unknownShape < type2 && type2 < b2Shape.e_shapeTypeCount);

		var createFcn = b2Contact.s_registers[type1][type2].createFcn;
		if (createFcn)
		{
			if (b2Contact.s_registers[type1][type2].primary)
			{
				return createFcn(shape1, shape2, allocator);
			}
			else
			{
				var c = createFcn(shape2, shape1, allocator);
				for (var i = 0; i < c.GetManifoldCount(); ++i)
				{
					var m = c.GetManifolds()[ i ];
					m.normal = m.normal.Negative();
				}
				return c;
			}
		}
		else
		{
			return null;
		}
	};
b2Contact.Destroy = function(contact, allocator){
		//b2Settings.b2Assert(b2Contact.s_initialized == true);

		if (contact.GetManifoldCount() > 0)
		{
			contact.m_shape1.m_body.WakeUp();
			contact.m_shape2.m_body.WakeUp();
		}

		var type1 = contact.m_shape1.m_type;
		var type2 = contact.m_shape2.m_type;

		//b2Settings.b2Assert(b2Shape.e_unknownShape < type1 && type1 < b2Shape.e_shapeTypeCount);
		//b2Settings.b2Assert(b2Shape.e_unknownShape < type2 && type2 < b2Shape.e_shapeTypeCount);

		var destroyFcn = b2Contact.s_registers[type1][type2].destroyFcn;
		destroyFcn(contact, allocator);
	};
b2Contact.s_registers = null;
b2Contact.s_initialized = false;
