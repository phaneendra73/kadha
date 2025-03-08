import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { authenticateUser } from './middleware.js';
export const blogRoutes = new Hono();

// 1.Get All Home page
blogRoutes.get('/getall', async (c) => {
	try {
		// Retrieve query parameters from the request
		const page = parseInt(c.req.query('page')) || 1; // Default page is 1 if not provided
		const limit = parseInt(c.req.query('limit')) || 10; // Default limit is 10 if not provided
		const query = c.req.query('query') || ''; // Search query for the title (optional)
		const selectedTags = c.req.query('tags') ? c.req.query('tags').split(',') : []; // Tags parameter, split by commas if present

		console.log(`Query: ${query}, Tags: ${selectedTags}, Page: ${page}, Limit: ${limit}`);

		// Calculate the skip (pagination offset)
		const skip = (page - 1) * limit;

		const prisma = new PrismaClient({
			datasourceUrl: c.env.DATABASE_URL,
		}).$extends(withAccelerate());

		let blogQuery = {
			where: {
				published: true, // Only published blogs
				...(query && { title: { contains: query, mode: 'insensitive' } }), // Filter by title if query is provided
				...(selectedTags.length > 0 && {
					tags: {
						some: {
							tag: {
								name: {
									in: selectedTags, // Filter by selected tags
								},
							},
						},
					},
				}),
			},
			skip: skip, // Skip for pagination
			take: limit, // Limit the number of results
			orderBy: {
				createdAt: 'desc', // Order by createdAt, latest first
			},
			include: {
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
		};

		// Fetch blogs based on the query parameters (pagination, title search, and tag filtering)
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
				...(query && { title: { contains: query, mode: 'insensitive' } }), // Count with title search if query is provided
				...(selectedTags.length > 0 && {
					tags: {
						some: {
							tag: {
								name: {
									in: selectedTags, // Only count blogs filtered by selected tags
								},
							},
						},
					},
				}),
			},
		});

		// Return the response with the blog data and pagination information
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

		// Get the blog ID from the URL parameter
		const blogId = parseInt(c.req.param('id'));

		if (!blogId || isNaN(blogId)) {
			return c.json({ error: 'Invalid or missing blog ID' }, 400);
		}

		// Fetch the blog by ID, including related content and tags
		const blog = await prisma.blogs.findUnique({
			where: {
				id: blogId, // Find the blog by ID
			},
			include: {
				blogContent: true, // Include associated markdown content
				tags: {
					select: {
						tag: {
							select: {
								name: true, // Get tag names
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
		console.log(blog);
		// Format the response with blog data
		const blogWithMarkdown = {
			id: blog.id,
			title: blog.title,
			imageUrl: blog.imageUrl,
			createdAt: blog.createdAt,
			updatedAt: blog.updatedAt,
			authorId: blog.authorId,
			published: blog.published,
			tags: blog.tags.map((tagLink) => tagLink.tag.name), // Extract tag names
			markdownContent: blog.blogContent ? blog.blogContent.content : '', // Fallback to empty string if no markdown content
		};

		return c.json(blogWithMarkdown); // Return the formatted blog data
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
