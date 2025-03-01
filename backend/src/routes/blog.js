import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

export const blogRoutes = new Hono();

// 1. Get All Blogs (Only ID, Title, Tags)
blogRoutes.get('/blogs', async (c) => {
	try {
		const prisma = new PrismaClient().$extends(withAccelerate());
		const blogs = await prisma.blogs.findMany({
			select: {
				id: true,
				title: true,
				tags: {
					select: {
						name: true,
					},
				},
			},
		});

		return c.json({ blogs });
	} catch (error) {
		return c.json({ error: 'Failed to fetch blogs' }, 500);
	}
});

// 2. Add a New Blog
blogRoutes.post('/blogs', async (c) => {
	try {
		const prisma = new PrismaClient().$extends(withAccelerate());
		const body = await c.req.json();
		const { title, imageUrl, tagIds, authorId } = body;

		// Check if the title and authorId are provided
		if (!title || !authorId) {
			return c.json({ error: 'Title and author ID are required.' }, 400);
		}

		// Create the blog post
		const blog = await prisma.blogs.create({
			data: {
				title,
				imageUrl,
				authorId,
				tags: {
					connect: tagIds.map((tagId) => ({ id: tagId })),
				},
			},
		});

		return c.json({ message: 'Blog created successfully', blog }, 201);
	} catch (error) {
		return c.json({ error: 'Failed to create blog' }, 500);
	}
});

// 3. Delete a Blog by ID
blogRoutes.delete('/blogs/:id', async (c) => {
	const { id } = c.req.param();

	if (!id) {
		return c.json({ error: 'Blog ID is required' }, 400);
	}

	try {
		const prisma = new PrismaClient().$extends(withAccelerate());
		const blog = await prisma.blogs.delete({
			where: { id: parseInt(id) },
		});

		return c.json({ message: `Blog with ID ${id} deleted successfully`, blog });
	} catch (error) {
		return c.json({ error: 'Failed to delete blog or Blog not found' }, 404);
	}
});
