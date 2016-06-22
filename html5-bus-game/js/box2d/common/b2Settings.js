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





var b2Settings = Class.create();
b2Settings.prototype = {



	// Define your unit system here. The default system is
	// meters-kilograms-seconds. For the tuning to work well,
	// your dynamic objects should be bigger than a pebble and smaller
	// than a house.
	//static public const b2Settings.b2_lengthUnitsPerMeter = 1.0;

	// Use this for pixels:

	// Global tuning constants based on MKS units.

	// Collision

	// Dynamics

	// Sleep

	// assert

	initialize: function() {}}
b2Settings.USHRT_MAX = 0x0000ffff;
b2Settings.b2_pi = Math.PI;
b2Settings.b2_massUnitsPerKilogram = 1.0;
b2Settings.b2_timeUnitsPerSecond = 1.0;
b2Settings.b2_lengthUnitsPerMeter = 30.0;
b2Settings.b2_maxManifoldPoints = 2;
b2Settings.b2_maxShapesPerBody = 64;
b2Settings.b2_maxPolyVertices = 8;
b2Settings.b2_maxProxies = 1024;
b2Settings.b2_maxPairs = 8 * b2Settings.b2_maxProxies;
b2Settings.b2_linearSlop = 0.005 * b2Settings.b2_lengthUnitsPerMeter;
b2Settings.b2_angularSlop = 2.0 / 180.0 * b2Settings.b2_pi;
b2Settings.b2_velocityThreshold = 1.0 * b2Settings.b2_lengthUnitsPerMeter / b2Settings.b2_timeUnitsPerSecond;
b2Settings.b2_maxLinearCorrection = 0.2 * b2Settings.b2_lengthUnitsPerMeter;
b2Settings.b2_maxAngularCorrection = 8.0 / 180.0 * b2Settings.b2_pi;
b2Settings.b2_contactBaumgarte = 0.2;
b2Settings.b2_timeToSleep = 0.5 * b2Settings.b2_timeUnitsPerSecond;
b2Settings.b2_linearSleepTolerance = 0.01 * b2Settings.b2_lengthUnitsPerMeter / b2Settings.b2_timeUnitsPerSecond;
b2Settings.b2_angularSleepTolerance = 2.0 / 180.0 / b2Settings.b2_timeUnitsPerSecond;
b2Settings.b2Assert = function(a)
	{
		if (!a){
			var nullVec;
			nullVec.x++;
		}
	};
