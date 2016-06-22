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



// We use contact ids to facilitate warm starting.
var b2ContactID = Class.create();
b2ContactID.prototype = 
{
	initialize: function(){
		// initialize instance variables for references
		this.features = new Features();
		//

		this.features._m_id = this;

	},
	Set: function(id){
		this.set_key(id._key);
	},
	Copy: function(){
		var id = new b2ContactID();
		id.set_key(this._key);
		return id;
	},
	get_key: function(){
		return this._key;
	},
	set_key: function(value) {
		this._key = value;
		this.features._referenceFace = this._key & 0x000000ff;
		this.features._incidentEdge = ((this._key & 0x0000ff00) >> 8) & 0x000000ff;
		this.features._incidentVertex = ((this._key & 0x00ff0000) >> 16) & 0x000000ff;
		this.features._flip = ((this._key & 0xff000000) >> 24) & 0x000000ff;
	},
	features: new Features(),
	_key: 0};
