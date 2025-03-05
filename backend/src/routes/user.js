import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { hashPassword, verifyPassword } from './middleware';
import { sign } from 'hono/jwt';

export const userprofilesRoutes = new Hono();

userprofilesRoutes.post('/signup', async (c) => {
	const body = await c.req.json();
	const prisma = new PrismaClient({
		datasourceUrl: c.env.DATABASE_URL,
	}).$extends(withAccelerate());

	const { email, password, name } = body;
	const Existinguserprofiles = await prisma.userprofiles.findFirst({
		where: { email },
	});

	if (Existinguserprofiles) {
		return c.json({ error: 'userprofiles already exists with the same Email' }, 400);
	}

	// Hash the password
	const hashedPassword = await hashPassword(password);

	// Create a new userprofiles
	const userprofiles = await prisma.userprofiles.create({
		data: {
			email,
			password: hashedPassword,
		},
	});

	// Generate JWT token
	const jwt = await sign({ id: userprofiles.id }, c.env.JWT_SECRET);
	return c.json({ jwt }, 201);
});

userprofilesRoutes.post('/signin', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env.DATABASE_URL,
	}).$extends(withAccelerate());

	const body = await c.req.json();
	const { email, password } = body;

	// Find the userprofiles by email
	const userprofiles = await prisma.userprofiles.findFirst({
		where: { email },
	});

	if (!userprofiles) {
		return c.json({ error: 'Invalid Email' }, 400);
	}

	// Verify the password
	const passwordIsValid = await verifyPassword(password, userprofiles.password);

	if (!passwordIsValid) {
		return c.json({ error: 'Invalid Password' }, 400);
	}

	// Generate JWT token
	const jwt = await sign({ id: userprofiles.id }, c.env.JWT_SECRET);

	return c.json({ jwt, message: 'Signed In' }, 200);
});
