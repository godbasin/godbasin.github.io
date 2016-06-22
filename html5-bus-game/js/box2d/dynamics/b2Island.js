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





/*
Position Correction Notes
=========================
I tried the several algorithms for position correction of the 2D revolute joint.
I looked at these systems:
- simple pendulum (1m diameter sphere on massless 5m stick) with initial angular velocity of 100 rad/s.
- suspension bridge with 30 1m long planks of length 1m.
- multi-link chain with 30 1m long links.

Here are the algorithms:

Baumgarte - A fraction of the position error is added to the velocity error. There is no
separate position solver.

Pseudo Velocities - After the velocity solver and position integration,
the position error, Jacobian, and effective mass are recomputed. Then
the velocity constraints are solved with pseudo velocities and a fraction
of the position error is added to the pseudo velocity error. The pseudo
velocities are initialized to zero and there is no warm-starting. After
the position solver, the pseudo velocities are added to the positions.
This is also called the First Order World method or the Position LCP method.

Modified Nonlinear Gauss-Seidel (NGS) - Like Pseudo Velocities except the
position error is re-computed for each constraint and the positions are updated
after the constraint is solved. The radius vectors (aka Jacobians) are
re-computed too (otherwise the algorithm has horrible instability). The pseudo
velocity states are not needed because they are effectively zero at the beginning
of each iteration. Since we have the current position error, we allow the
iterations to terminate early if the error becomes smaller than b2_linearSlop.

Full NGS or just NGS - Like Modified NGS except the effective mass are re-computed
each time a constraint is solved.

Here are the results:
Baumgarte - this is the cheapest algorithm but it has some stability problems,
especially with the bridge. The chain links separate easily close to the root
and they jitter struggle to pull together. This is one of the most common
methods in the field. The big drawback is that the position correction artificially
affects the momentum, thus leading to instabilities and false bounce. I used a
bias factor of 0.2. A larger bias factor makes the bridge less stable, a smaller
factor makes joints and contacts more spongy.

Pseudo Velocities - the is more stable than the Baumgarte method. The bridge is
stable. However, joints still separate with large angular velocities. Drag the
simple pendulum in a circle quickly and the joint will separate. The chain separates
easily and does not recover. I used a bias factor of 0.2. A larger value lead to
the bridge collapsing when a heavy cube drops on it.

Modified NGS - this algorithm is better in some ways than Baumgarte and Pseudo
Velocities, but in other ways it is worse. The bridge and chain are much more
stable, but the simple pendulum goes unstable at high angular velocities.

Full NGS - stable in all tests. The joints display good stiffness. The bridge
still sags, but this is better than infinite forces.

Recommendations
Pseudo Velocities are not really worthwhile because the bridge and chain cannot
recover from joint separation. In other cases the benefit over Baumgarte is small.

Modified NGS is not a robust method for the revolute joint due to the violent
instability seen in the simple pendulum. Perhaps it is viable with other constraint
types, especially scalar constraints where the effective mass is a scalar.

This leaves Baumgarte and Full NGS. Baumgarte has small, but manageable instabilities
and is very fast. I don't think we can escape Baumgarte, especially in highly
demanding cases where high constraint fidelity is not needed.

Full NGS is robust and easy on the eyes. I recommend this option for
higher fidelity simulation and certainly for suspension bridges and long chains.
Full NGS might be a good choice for ragdolls, especially motorized ragdolls where
joint separation can be problematic. The number of NGS iterations can be reduced
for better performance without harming robustness much.

Each joint in a can be handled differently in the position solver. So I recommend
a system where the user can select the algorithm on a per joint basis. I would
probably default to the slower Full NGS and let the user select the faster
Baumgarte method in performance critical scenarios.
*/


var b2Island = Class.create();
b2Island.prototype = 
{
	initialize: function(bodyCapacity, contactCapacity, jointCapacity, allocator)
	{
		var i = 0;

		this.m_bodyCapacity = bodyCapacity;
		this.m_contactCapacity = contactCapacity;
		this.m_jointCapacity	 = jointCapacity;
		this.m_bodyCount = 0;
		this.m_contactCount = 0;
		this.m_jointCount = 0;


		//this.m_bodies = (b2Body**)allocator->Allocate(bodyCapacity * sizeof(b2Body*));
		this.m_bodies = new Array(bodyCapacity);
		for (i = 0; i < bodyCapacity; i++)
			this.m_bodies[i] = null;

		//this.m_contacts = (b2Contact**)allocator->Allocate(contactCapacity	 * sizeof(b2Contact*));
		this.m_contacts = new Array(contactCapacity);
		for (i = 0; i < contactCapacity; i++)
			this.m_contacts[i] = null;

		//this.m_joints = (b2Joint**)allocator->Allocate(jointCapacity * sizeof(b2Joint*));
		this.m_joints = new Array(jointCapacity);
		for (i = 0; i < jointCapacity; i++)
			this.m_joints[i] = null;

		this.m_allocator = allocator;
	},
	//~b2Island();

	Clear: function()
	{
		this.m_bodyCount = 0;
		this.m_contactCount = 0;
		this.m_jointCount = 0;
	},

	Solve: function(step, gravity)
	{
		var i = 0;
		var b;

		for (i = 0; i < this.m_bodyCount; ++i)
		{
			b = this.m_bodies[i];

			if (b.m_invMass == 0.0)
				continue;

			b.m_linearVelocity.Add( b2Math.MulFV (step.dt, b2Math.AddVV(gravity, b2Math.MulFV( b.m_invMass, b.m_force ) ) ) );
			b.m_angularVelocity += step.dt * b.m_invI * b.m_torque;

			//b.m_linearVelocity *= b.m_linearDamping;
			b.m_linearVelocity.Multiply(b.m_linearDamping);
			b.m_angularVelocity *= b.m_angularDamping;

			// Store positions for conservative advancement.
			b.m_position0.SetV(b.m_position);
			b.m_rotation0 = b.m_rotation;
		}

		var contactSolver = new b2ContactSolver(this.m_contacts, this.m_contactCount, this.m_allocator);

		// Pre-solve
		contactSolver.PreSolve();

		for (i = 0; i < this.m_jointCount; ++i)
		{
			this.m_joints[i].PrepareVelocitySolver();
		}

		// this.Solve velocity constraints.
		for (i = 0; i < step.iterations; ++i)
		{
			contactSolver.SolveVelocityConstraints();

			for (var j = 0; j < this.m_jointCount; ++j)
			{
				this.m_joints[j].SolveVelocityConstraints(step);
			}
		}

		// Integrate positions.
		for (i = 0; i < this.m_bodyCount; ++i)
		{
			b = this.m_bodies[i];

			if (b.m_invMass == 0.0)
				continue;

			//b.m_position.Add( b2Math.MulFV (step.dt, b.m_linearVelocity) );
			b.m_position.x += step.dt * b.m_linearVelocity.x;
			b.m_position.y += step.dt * b.m_linearVelocity.y;
			b.m_rotation += step.dt * b.m_angularVelocity;

			b.m_R.Set(b.m_rotation);
		}

		for (i = 0; i < this.m_jointCount; ++i)
		{
			this.m_joints[i].PreparePositionSolver();
		}

		// this.Solve position constraints.
		if (b2World.s_enablePositionCorrection)
		{
			for (b2Island.m_positionIterationCount = 0; b2Island.m_positionIterationCount < step.iterations; ++b2Island.m_positionIterationCount)
			{
				var contactsOkay = contactSolver.SolvePositionConstraints(b2Settings.b2_contactBaumgarte);

				var jointsOkay = true;
				for (i = 0; i < this.m_jointCount; ++i)
				{
					var jointOkay = this.m_joints[i].SolvePositionConstraints();
					jointsOkay = jointsOkay && jointOkay;
				}

				if (contactsOkay && jointsOkay)
				{
					break;
				}
			}
		}

		// Post-solve.
		contactSolver.PostSolve();

		// Synchronize shapes and reset forces.
		for (i = 0; i < this.m_bodyCount; ++i)
		{
			b = this.m_bodies[i];

			if (b.m_invMass == 0.0)
				continue;

			b.m_R.Set(b.m_rotation);

			b.SynchronizeShapes();
			b.m_force.Set(0.0, 0.0);
			b.m_torque = 0.0;
		}
	},

	UpdateSleep: function(dt)
	{
		var i = 0;
		var b;

		var minSleepTime = Number.MAX_VALUE;

		var linTolSqr = b2Settings.b2_linearSleepTolerance * b2Settings.b2_linearSleepTolerance;
		var angTolSqr = b2Settings.b2_angularSleepTolerance * b2Settings.b2_angularSleepTolerance;

		for (i = 0; i < this.m_bodyCount; ++i)
		{
			b = this.m_bodies[i];
			if (b.m_invMass == 0.0)
			{
				continue;
			}

			if ((b.m_flags & b2Body.e_allowSleepFlag) == 0)
			{
				b.m_sleepTime = 0.0;
				minSleepTime = 0.0;
			}

			if ((b.m_flags & b2Body.e_allowSleepFlag) == 0 ||
				b.m_angularVelocity * b.m_angularVelocity > angTolSqr ||
				b2Math.b2Dot(b.m_linearVelocity, b.m_linearVelocity) > linTolSqr)
			{
				b.m_sleepTime = 0.0;
				minSleepTime = 0.0;
			}
			else
			{
				b.m_sleepTime += dt;
				minSleepTime = b2Math.b2Min(minSleepTime, b.m_sleepTime);
			}
		}

		if (minSleepTime >= b2Settings.b2_timeToSleep)
		{
			for (i = 0; i < this.m_bodyCount; ++i)
			{
				b = this.m_bodies[i];
				b.m_flags |= b2Body.e_sleepFlag;
			}
		}
	},

	AddBody: function(body)
	{
		//b2Settings.b2Assert(this.m_bodyCount < this.m_bodyCapacity);
		this.m_bodies[this.m_bodyCount++] = body;
	},

	AddContact: function(contact)
	{
		//b2Settings.b2Assert(this.m_contactCount < this.m_contactCapacity);
		this.m_contacts[this.m_contactCount++] = contact;
	},

	AddJoint: function(joint)
	{
		//b2Settings.b2Assert(this.m_jointCount < this.m_jointCapacity);
		this.m_joints[this.m_jointCount++] = joint;
	},

	m_allocator: null,

	m_bodies: null,
	m_contacts: null,
	m_joints: null,

	m_bodyCount: 0,
	m_jointCount: 0,
	m_contactCount: 0,

	m_bodyCapacity: 0,
	m_contactCapacity: 0,
	m_jointCapacity: 0,

	m_positionError: null};
b2Island.m_positionIterationCount = 0;
