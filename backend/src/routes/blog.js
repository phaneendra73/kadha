import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { authenticateUser } from './middleware.js';
export const blogRoutes = new Hono();

// 1.Get All Home page
blogRoutes.get('/getall', async (c) => {
	try {
		const page = parseInt(c.req.param('page')) || 1;
		const limit = parseInt(c.req.param('limit')) || 20;
		const selectedTags = c.req.param('tags') ? c.req.param('tags').split(',') : []; // Get the selected tags from the query (comma-separated list)

		// Calculate pagination offset
		const skip = (page - 1) * limit;

		const prisma = new PrismaClient({
			datasourceUrl: c.env.DATABASE_URL,
		}).$extends(withAccelerate());

		let blogQuery = {
			where: {
				published: true, // Only published blogs
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
		};

		// If tags are selected, filter blogs by the tags
		if (selectedTags.length > 0) {
			blogQuery.where.tags = {
				some: {
					tag: {
						name: {
							in: selectedTags, // Filter by the selected tags
						},
					},
				},
			};
		}

		// Fetch blogs with pagination and tags filtering
		const blogs = await prisma.blogs.findMany(blogQuery);

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
				tags: selectedTags.length > 0 ? { some: { tag: { name: { in: selectedTags } } } } : undefined, // Only count blogs filtered by selected tags
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
blogRoutes.post('/add', authenticateUser, async (c) => {
	try {
		const body = await c.req.json();
		const { title, imageUrl, tagIds, content } = body;
		const authorId = c.get('UserId'); // Get the authorId from the context

		if (!authorId) {
			return c.json({ error: 'Unauthorized: Author ID is missing' }, 401);
		}

		if (!title || !content) {
			return c.json({ error: 'Title and content are required.' }, 400);
		}
		const prisma = new PrismaClient({
			datasourceUrl: c.env.DATABASE_URL,
			timeout: 10000,
		}).$extends(withAccelerate());
		const result = await prisma.$transaction(async (prisma) => {
			// Create the blog
			const blog = await prisma.blogs.create({
				data: {
					title,
					imageUrl,
					authorId: parseInt(authorId),
					published: true,
				},
			});

			// Create tag associations (if tagIds are provided)
			if (tagIds && tagIds.length > 0) {
				await prisma.tagsonblogs.createMany({
					data: tagIds.map((tagId) => ({
						blogId: blog.id,
						tagId,
					})),
				});
			}

			// Create the blog content
			const blogContent = await prisma.blogmd.create({
				data: {
					content,
					blogId: blog.id,
				},
			});

			// Return the blog and its content
			return { blog, blogContent };
		});

		// Return the success response
		return c.json({ message: 'Blog created successfully', blog: result.blog, blogContent: result.blogContent }, 201);
	} catch (error) {
		console.error(error);
		return c.json({ error: 'Failed to create blog' }, 500);
	}
});

// 3. Edit Blog Route
blogRoutes.put('/edit/:id', authenticateUser, async (c) => {
	const { id } = c.req.param();
	const body = await c.req.json();
	const { title, imageUrl, tagIds, content } = body;
	const authorId = c.get('UserId'); // Get the authorId from the context

	if (!authorId) {
		return c.json({ error: 'Unauthorized: Author ID is missing' }, 401);
	}

	try {
		// Check if the blog exists and belongs to the user
		const blog = await prisma.blogs.findUnique({
			where: { id: parseInt(id) },
		});

		if (!blog) {
			return c.json({ error: 'Blog not found' }, 404);
		}

		if (blog.authorId !== parseInt(authorId)) {
			return c.json({ error: 'Unauthorized: You can only edit your own blogs' }, 403);
		}

		const updatedBlog = await prisma.blogs.update({
			where: { id: parseInt(id) },
			data: {
				title,
				imageUrl,
				tags: {
					connect: tagIds ? tagIds.map((tagId) => ({ id: tagId })) : [],
				},
			},
		});

		const updatedBlogContent = await prisma.blogmd.update({
			where: { blogId: parseInt(id) },
			data: { content },
		});

		return c.json({ message: 'Blog updated successfully', updatedBlog, updatedBlogContent }, 200);
	} catch (error) {
		console.error(error);
		return c.json({ error: 'Failed to update blog' }, 500);
	}
});

//4. Delete Blog Route
blogRoutes.delete('/delete/:id', authenticateUser, async (c) => {
	const { id } = c.req.param();
	const authorId = c.get('UserId'); // Get the authorId from the context

	if (!authorId) {
		return c.json({ error: 'Unauthorized: Author ID is missing' }, 401);
	}

	try {
		const prisma = new PrismaClient({
			datasourceUrl: c.env.DATABASE_URL,
		}).$extends(withAccelerate());

		const blog = await prisma.blogs.findUnique({
			where: { id: parseInt(id) },
		});

		if (!blog) {
			return c.json({ error: 'Blog not found' }, 404);
		}

		if (blog.authorId !== parseInt(authorId)) {
			return c.json({ error: 'Unauthorized: You can only delete your own blogs' }, 403);
		}

		await prisma.blogs.update({
			where: { id: parseInt(id) },
			data: {
				published: false,
			},
		});

		return c.json({ message: 'Blog deleted successfully' }, 200);
	} catch (error) {
		console.error(error);
		return c.json({ error: 'Failed to delete blog' }, 500);
	}
});
// 5. get blog ruote fro user to read
blogRoutes.get('/get/:id', async (c) => {
	try {
		const prisma = new PrismaClient({
			datasourceUrl: c.env.DATABASE_URL,
		}).$extends(withAccelerate());

		const blogId = parseInt(c.req.param('id')); // Get the blog ID from the URL parameter

		if (!blogId || isNaN(blogId)) {
			return c.json({ error: 'Invalid or missing blog ID' }, 400);
		}

		// Fetch the blog by ID along with its markdown content (blogmd)
		const blog = await prisma.blogs.findUnique({
			where: {
				id: blogId, // Find the blog by ID
			},
			include: {
				blogContent: true, // Include the associated markdown content
				tags: {
					select: {
						tag: {
							select: {
								name: true, // Get the tag names
							},
						},
					},
				},
			},
		});

		// If the blog does not exist
		if (!blog) {
			return c.json({ error: 'Blog not found' }, 404);
		}

		// Format the response data to include tags and markdown content
		const blogWithMarkdown = {
			id: blog.id,
			title: blog.title,
			imageUrl: blog.imageUrl,
			createdAt: blog.createdAt,
			updatedAt: blog.updatedAt,
			authorId: blog.authorId,
			published: blog.published,
			tags: blog.tags.map((tagLink) => tagLink.tag.name), // Extract the tag names
			markdownContent: blog.blogContent ? blog.blogContent.content : null, // Get the markdown content if exists
		};

		return c.json(blogWithMarkdown);
	} catch (error) {
		console.error(error);
		return c.json({ error: 'Failed to fetch blog data' }, 500);
	}
});

// 6. All the tags
blogRoutes.get('/tags', async (c) => {
	try {
		const prisma = new PrismaClient({
			datasourceUrl: c.env.DATABASE_URL,
		}).$extends(withAccelerate());

		const tags = await prisma.tags.findMany();

		return c.json({ tags }, 200);
	} catch (error) {
		console.error(error);
		return c.json({ error: 'Failed to fetch tags' }, 500);
	}
});
