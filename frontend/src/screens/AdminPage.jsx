import { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Button,
  HStack,
  Flex,
  Badge,
  Heading,
  Dialog,
  Portal,
  CloseButton,
  Table,
  Skeleton,
  Tag,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  useColorModeValue,
  toaster,
  Toaster,
  Appbar,
  Footer,
} from '../components/ui/index';
import useBlogs from '../hooks/useBlogs';
import useTags from '../hooks/useTags';
import { getenv } from '../utils/getenv';

const AdminPage = () => {
  const navigate = useNavigate();
  const authToken = localStorage.getItem('authToken');
  const [isAuthorized, setIsAuthorized] = useState(false);
  useEffect(() => {
    if (!authToken) {
      navigate('/Signin');

      toaster.create({
        title: 'Access Restricted',
        description: 'Please log in to access Admin Page.',
        type: 'warning',
        duration: 8000,
        isClosable: true,
      });
    } else {
      setIsAuthorized(true);
    }
  }, [navigate, authToken]);

  // States for pagination and dialog
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const baseUrl = getenv('APIURL');

  // Use hooks for blogs and tags
  const { blogs, totalCount, totalPages, loading } = useBlogs(
    currentPage,
    selectedTags,
    '',
    isAuthorized
  );
  const {
    tags,
    error: tagsError,
    loading: tagsLoading,
  } = useTags(isAuthorized);

  // Get background and text colors for the page based on theme
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.200');

  // Handle tag selection and deselection
  const handleTagClick = (tagName) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags((prevTags) => {
        const updatedTags = prevTags.filter((tag) => tag !== tagName);
        setCurrentPage(1); // Reset to page 1 when tag is deselected
        return updatedTags;
      });
    } else {
      setSelectedTags((prevTags) => {
        const updatedTags = [...prevTags, tagName];
        setCurrentPage(1); // Reset to page 1 when new tag is selected
        return updatedTags;
      });
    }
  };

  // Remove a tag from the selected tags array
  const handleTagRemove = (tagName) => {
    setSelectedTags((prevTags) => {
      const updatedTags = prevTags.filter((tag) => tag !== tagName);
      setCurrentPage(1); // Reset to page 1 when tag is removed
      return updatedTags;
    });
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle edit blog
  const handleEditBlog = (blogId) => {
    navigate(`/Editor/${blogId}`);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = (blog) => {
    setSelectedBlog(blog);
    setIsDialogOpen(true);
  };

  // Handle delete blog with auth token
  const handleDeleteBlog = async () => {
    try {
      await axios.delete(`${baseUrl}/blog/delete/${selectedBlog.id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      toaster.create({
        title: 'Blog deleted',
        description: `Successfully deleted blog`,
        type: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Close dialog and refresh page
      setIsDialogOpen(false);
      // Page will refresh automatically due to hook
    } catch (error) {
      console.error('Error deleting blog:', error);
      toaster.create({
        title: 'Error deleting blog',
        description: error.message,
        type: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Appbar />
      <Toaster />
      <Box width={{ base: '95%', md: '90%' }} mx='auto' p={4}>
        {/* Header */}
        <Flex justifyContent='space-between' alignItems='center' mb={4}>
          <Heading size='lg'>Blog Admin</Heading>
          <Box>
            <Button
              colorPalette='green'
              variant={'outline'}
              onClick={() => navigate('/Editor')}
              mr={2}
            >
              New Blog
            </Button>
            <Button
              colorPalette='green'
              variant={'outline'}
              onClick={() => navigate('/Tag')}
            >
              New Tags
            </Button>
          </Box>
        </Flex>

        {/* Tag Filter Section */}
        <Box
          p={4}
          borderRadius='md'
          bg={bgColor}
          boxShadow='sm'
          width={'100%'}
          mx='auto'
          mb={4}
          display='flex'
          flexDirection='column'
          alignItems='flex-start'
        >
          <Text
            fontSize='md'
            color={textColor}
            mb={2}
            textAlign='left'
            width='100%'
            fontFamily={'heading'}
          >
            TAG FILTER
          </Text>

          <HStack spacing={4} wrap='wrap' justify='flex-start' width='100%'>
            {tagsLoading ? (
              <HStack spacing={2} mt={2}>
                <Skeleton height='20px' width='50px' color={textColor} />
                <Skeleton height='20px' width='50px' />
                <Skeleton height='20px' width='50px' />
              </HStack>
            ) : tagsError ? (
              <Text color='red.500'>Error loading tags</Text>
            ) : (
              tags.map((tag) => (
                <Tag.Root
                  key={tag.id}
                  size='lg'
                  variant='solid'
                  colorPalette={
                    selectedTags.includes(tag.name) ? 'green' : 'gray'
                  }
                  onClick={() => handleTagClick(tag.name)}
                  cursor='pointer'
                  mb={2}
                  transition='background-color 0.3s ease'
                >
                  <Tag.Label>{tag.name}</Tag.Label>

                  {/* Show close button if the tag is selected */}
                  {selectedTags.includes(tag.name) && (
                    <Tag.EndElement>
                      <Tag.CloseTrigger
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTagRemove(tag.name);
                        }}
                      />
                    </Tag.EndElement>
                  )}
                </Tag.Root>
              ))
            )}
          </HStack>
        </Box>

        {/* Blog List */}
        <Box borderRadius='md' bg={bgColor} boxShadow='sm' overflow='hidden'>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Title</Table.ColumnHeader>
                <Table.ColumnHeader>Author</Table.ColumnHeader>
                <Table.ColumnHeader>Tags</Table.ColumnHeader>
                <Table.ColumnHeader>Date</Table.ColumnHeader>
                <Table.ColumnHeader>Actions</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {loading ? (
                Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <Table.Row key={index}>
                      <Table.Cell>
                        <Skeleton height='20px' />
                      </Table.Cell>
                      <Table.Cell>
                        <Skeleton height='20px' />
                      </Table.Cell>
                      <Table.Cell>
                        <Skeleton height='20px' />
                      </Table.Cell>
                      <Table.Cell>
                        <Skeleton height='20px' />
                      </Table.Cell>
                      <Table.Cell>
                        <Skeleton height='20px' />
                      </Table.Cell>
                    </Table.Row>
                  ))
              ) : blogs.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={5} textAlign='center' py={4}>
                    No blogs found
                  </Table.Cell>
                </Table.Row>
              ) : (
                blogs.map((blog) => (
                  <Table.Row key={blog.id}>
                    <Table.Cell maxWidth='300px' isTruncated>
                      {blog.title}
                    </Table.Cell>
                    <Table.Cell>{blog.authorId}</Table.Cell>
                    <Table.Cell>
                      <HStack spacing={1} flexWrap='wrap'>
                        {blog.tags &&
                          blog.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} colorPalette='green' mr={1}>
                              {tag}
                            </Badge>
                          ))}
                        {blog.tags && blog.tags.length > 2 && (
                          <Badge colorPalette='gray'>
                            +{blog.tags.length - 2}
                          </Badge>
                        )}
                      </HStack>
                    </Table.Cell>
                    <Table.Cell>
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <HStack spacing={2}>
                        <Button
                          size='sm'
                          colorPalette='blue'
                          onClick={() => handleEditBlog(blog.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          size='sm'
                          colorPalette='red'
                          onClick={() => handleDeleteConfirm(blog)}
                        >
                          Delete
                        </Button>
                      </HStack>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>

          {/* Pagination */}
          <HStack p={4} spacing={4} justify='center'>
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              isDisabled={currentPage === 1}
              size='sm'
              colorPalette='green'
              variant='outline'
            >
              Previous
            </Button>

            <Text fontSize='md' fontWeight='bold'>
              Page {currentPage} of {totalPages}
            </Text>

            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              isDisabled={currentPage === totalPages || totalCount === 0}
              size='sm'
              colorPalette='green'
              variant='outline'
            >
              Next
            </Button>
          </HStack>
        </Box>

        {/* Delete Confirmation Dialog */}
        {isDialogOpen && (
          <Dialog.Root role='alertdialog' open={isDialogOpen}>
            <Portal>
              <Dialog.Backdrop />
              <Dialog.Positioner>
                <Dialog.Content>
                  <Dialog.Header>
                    <Dialog.Title>Delete Blog</Dialog.Title>
                  </Dialog.Header>
                  <Dialog.Body>
                    <p>
                      Are you sure you want to delete &quot;
                      {selectedBlog?.title}&quot;? This action cannot be undone.
                    </p>
                  </Dialog.Body>
                  <Dialog.Footer>
                    <Dialog.ActionTrigger asChild>
                      <Button
                        variant='outline'
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                    </Dialog.ActionTrigger>
                    <Button colorPalette='red' onClick={handleDeleteBlog}>
                      Delete
                    </Button>
                  </Dialog.Footer>
                  <Dialog.CloseTrigger asChild>
                    <CloseButton
                      size='sm'
                      onClick={() => setIsDialogOpen(false)}
                    />
                  </Dialog.CloseTrigger>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>
        )}
      </Box>
      <Footer />
    </>
  );
};

export default AdminPage;
