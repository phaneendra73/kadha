import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

export const blogRoutes = new Hono();

blogRoutes.get('/blogs', async (c) => {
	try {
		console.log('Fetching blogs...');
		const page = parseInt(c.req.param('page')) || 1;
		const limit = parseInt(c.req.param('limit')) || 20;

		// Calculate pagination offset
		const skip = (page - 1) * limit;
		console.log('PAge', page);
		const prisma = new PrismaClient({
			datasourceUrl: c.env.DATABASE_URL,
		}).$extends(withAccelerate());

		// Fetch blogs with pagination and filter for only published blogs
		const blogs = await prisma.blogs.findMany({
			where: {
				published: true, // Filter to only include blogs with published = true
			},
			skip: skip, // Skip for pagination
			take: limit, // Limit the number of results
			include: {
				tags: {
					select: {
						tag: {
							select: {
								name: true, // Get the tag name
							},
						},
					},
				},
			},
		});

		// Map the tags data for each blog and return the desired structure
		const mappedBlogs = blogs.map((blog) => ({
			id: blog.id,
			title: blog.title,
			imageUrl: blog.imageUrl,
			createdAt: blog.createdAt,
			updatedAt: blog.updatedAt,
			authorId: blog.authorId,
			published: blog.published,
			tags: blog.tags.map((tagLink) => tagLink.tag.name), // Extract the tag names
		}));

		// Fetch the total number of blogs with published = true for pagination metadata
		const totalBlogs = await prisma.blogs.count({
			where: {
				published: true,
			},
		});

		return c.json({
			blogs: mappedBlogs,
			pagination: {
				currentPage: page,
				totalPages: Math.ceil(totalBlogs / limit),
				totalCount: totalBlogs,
			},
		});
	} catch (error) {
		console.error(error); // Optional: log the error for debugging
		return c.json({ error: 'Failed to fetch blogs' }, 500);
	}
});

// 2. Add a New Blog
blogRoutes.post('/blogs', async (c) => {
	try {
		const prisma = new PrismaClient({}).$extends(withAccelerate());
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
		const prisma = new PrismaClient({
			datasourceUrl: c.env.DATABASE_URL,
		}).$extends(withAccelerate());
		const blog = await prisma.blogs.delete({
			where: { id: parseInt(id) },
		});

		return c.json({ message: `Blog with ID ${id} deleted successfully`, blog });
	} catch (error) {
		return c.json({ error: 'Failed to delete blog or Blog not found' }, 404);
	}
});
