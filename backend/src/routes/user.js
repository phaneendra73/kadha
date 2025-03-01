import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { hashPassword, verifyPassword } from './middleware';
import { sign } from 'hono/jwt';

export const userRoutes = new Hono();

userRoutes.post('/signup', async (c) => {
	const body = await c.req.json();
	const parsedBody = body;

	if (!parsedBody.success) {
		const errors = parsedBody.error.errors.map((err) => ({
			field: err.path[0],
			message: err.message,
		}));
		return c.json({ error: 'Invalid input', details: errors }, 400);
	}

	const prisma = new PrismaClient({
		datasourceUrl: c.env.DATABASE_URL,
	}).$extends(withAccelerate());

	const { email, password, name } = parsedBody.data;
	const Existinguser = await prisma.user.findFirst({
		where: { email },
	});

	if (Existinguser) {
		return c.json({ error: 'User already exists with the same Email' }, 400);
	}

	// Hash the password
	const hashedPassword = await hashPassword(password);

	// Create a new user
	const user = await prisma.user.create({
		data: {
			email,
			password: hashedPassword,
			name,
		},
	});

	// Generate JWT token
	const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
	return c.json({ jwt }, 201);
});

userRoutes.post('/signin', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env.DATABASE_URL,
	}).$extends(withAccelerate());

	const body = await c.req.json();
	const parsedBody = body;

	if (!parsedBody.success) {
		return c.json({ error: 'Invalid input', details: parsedBody.error.errors }, 400);
	}

	const { email, password } = parsedBody.data;

	// Find the user by email
	const user = await prisma.user.findFirst({
		where: { email },
	});

	if (!user) {
		return c.json({ error: 'Invalid Email' }, 400);
	}

	// Verify the password
	const passwordIsValid = await verifyPassword(password, user.password);

	if (!passwordIsValid) {
		return c.json({ error: 'Invalid Password' }, 400);
	}

	// Generate JWT token
	const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);

	return c.json({ jwt, message: 'Signed In' }, 200);
});
