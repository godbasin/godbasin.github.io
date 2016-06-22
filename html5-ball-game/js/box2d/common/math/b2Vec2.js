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





// b2Vec2 has no constructor so that it
// can be placed in a union.
var b2Vec2 = Class.create();
b2Vec2.prototype = 
{
	initialize: function(x_, y_) {this.x=x_; this.y=y_;},

	SetZero: function() { this.x = 0.0; this.y = 0.0; },
	Set: function(x_, y_) {this.x=x_; this.y=y_;},
	SetV: function(v) {this.x=v.x; this.y=v.y;},

	Negative: function(){ return new b2Vec2(-this.x, -this.y); },


	Copy: function(){
		return new b2Vec2(this.x,this.y);
	},

	Add: function(v)
	{
		this.x += v.x; this.y += v.y;
	},

	Subtract: function(v)
	{
		this.x -= v.x; this.y -= v.y;
	},

	Multiply: function(a)
	{
		this.x *= a; this.y *= a;
	},

	MulM: function(A)
	{
		var tX = this.x;
		this.x = A.col1.x * tX + A.col2.x * this.y;
		this.y = A.col1.y * tX + A.col2.y * this.y;
	},

	MulTM: function(A)
	{
		var tX = b2Math.b2Dot(this, A.col1);
		this.y = b2Math.b2Dot(this, A.col2);
		this.x = tX;
	},

	CrossVF: function(s)
	{
		var tX = this.x;
		this.x = s * this.y;
		this.y = -s * tX;
	},

	CrossFV: function(s)
	{
		var tX = this.x;
		this.x = -s * this.y;
		this.y = s * tX;
	},

	MinV: function(b)
	{
		this.x = this.x < b.x ? this.x : b.x;
		this.y = this.y < b.y ? this.y : b.y;
	},

	MaxV: function(b)
	{
		this.x = this.x > b.x ? this.x : b.x;
		this.y = this.y > b.y ? this.y : b.y;
	},

	Abs: function()
	{
		this.x = Math.abs(this.x);
		this.y = Math.abs(this.y);
	},

	Length: function()
	{
		return Math.sqrt(this.x * this.x + this.y * this.y);
	},

	Normalize: function()
	{
		var length = this.Length();
		if (length < Number.MIN_VALUE)
		{
			return 0.0;
		}
		var invLength = 1.0 / length;
		this.x *= invLength;
		this.y *= invLength;

		return length;
	},

	IsValid: function()
	{
		return b2Math.b2IsValid(this.x) && b2Math.b2IsValid(this.y);
	},

	x: null,
	y: null};
b2Vec2.Make = function(x_, y_)
	{
		return new b2Vec2(x_, y_);
	};
