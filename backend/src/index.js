import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { userprofilesRoutes } from './routes/user';
import { blogRoutes } from './routes/blog';

const app = new Hono();
app.use('/*', cors());

app.route('/user', userprofilesRoutes);
app.route('/blog', blogRoutes);
app.get('/', (c) => {
	return c.json({ message: 'Welcome to the kadha API!' }, 200);
});

// Catch-all route for unmatched routes
app.notFound((c) => {
	return c.json({ error: 'Not Found' }, 404);
});

// Optional: Catch-all for other types of errors
app.onError((err, c) => {
	console.error(err);
	return c.json({ error: 'Internal Server Error' }, 500);
});

export default app;
