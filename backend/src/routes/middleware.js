import { verify } from 'hono/jwt';

export async function hashPassword(password) {
	const encoder = new TextEncoder();
	const data = encoder.encode(password);
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
	return hashHex;
}

export async function verifyPassword(inputPassword, storedHash) {
	const inputHash = await hashPassword(inputPassword);
	return inputHash === storedHash;
}

export const authenticateUser = async (c, next) => {
	const authHeader = c.req.header('Authorization');

	if (!authHeader) {
		return c.json({ error: 'Unauthorized: No token provided' }, 401);
	}

	const token = authHeader.split(' ')[1];
	console.log(token);
	try {
		const user = await verify(token, c.env.JWT_SECRET);
		if (user) {
			c.set('UserId', user.id); // Set user ID for later use in the request
			await next(); // Proceed to the next middleware or route handler
		} else {
			return c.json({ error: 'Unauthorized: Invalid token' }, 401);
		}
	} catch (err) {
		console.error(err); // Log the error for debugging
		return c.json({ error: 'Unauthorized: Token verification failed' }, 401);
	}
};
