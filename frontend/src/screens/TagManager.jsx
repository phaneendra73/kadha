import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Input,
  Stack,
  Tag,
  TagLabel,
  Text,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Skeleton,
  CloseButton,
} from '@chakra-ui/react';
import { Field } from '@chakra-ui/react';
import { Dialog, Portal } from '@chakra-ui/react';
import { Appbar, Footer, useColorModeValue } from '../components/ui/index';
import { Toaster, toaster } from '../components/ui/toaster';
import axios from 'axios';
import { getenv } from '../utils/getenv';
import useTags from '../hooks/useTags';

export default function TagManager() {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.700');
  const tagBgColor = useColorModeValue('gray.50', 'gray.600');

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const apiUrl = getenv('APIURL');

  // Use the existing useTags hook
  const {
    tags,
    error: tagsError,
    loading: tagsLoading,
    refetch: fetchTags,
  } = useTags(isAuthorized);

  // Check auth
  useEffect(() => {
    const checkAuth = async () => {
      const authToken = localStorage.getItem('p73SessionData');
      if (!authToken) {
        toaster.create({
          title: 'Access Restricted',
          description:
            'Please log in to manage tags. Only admins can modify content.',
          type: 'warning',
          duration: 5000,
          isClosable: true,
        });
        setTimeout(() => {
          navigate('/Admin');
        }, 3000);
        return;
      }

      setIsAuthorized(true);
    };

    checkAuth();
  }, [navigate]);

  const handleAddTag = async () => {
    if (!newTagName.trim()) {
      toaster.create({
        title: 'Error',
        description: 'Tag name cannot be empty',
        type: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${apiUrl}/blog/tags/create`,
        { tags: [newTagName.trim()] },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('p73SessionData')}`,
          },
        }
      );

      if (response.status === 201) {
        toaster.create({
          title: 'Success',
          description: 'Tag created successfully!',
          type: 'success',
          duration: 3000,
          isClosable: true,
        });
        setNewTagName('');
        fetchTags(); // Refresh tags list
      }
    } catch (error) {
      console.error('Failed to add tag:', error);
      toaster.create({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to add tag',
        type: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
      setIsDialogOpen(false);
    }
  };

  const openDeleteDialog = (tag) => {
    setSelectedTag(tag);
    setIsDialogOpen(true);
  };

  const handleDeleteTag = async () => {
    if (!selectedTag) return;

    setIsSubmitting(true);

    try {
      const response = await axios.delete(
        `${apiUrl}/blog/tags/${selectedTag.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('p73SessionData')}`,
          },
        }
      );

      if (response.status === 200) {
        toaster.create({
          title: 'Success',
          description: 'Tag deleted successfully!',
          type: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Failed to delete tag:', error);
      toaster.create({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to delete tag',
        type: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
      setIsDialogOpen(false);
    }
  };

  if (!isAuthorized) {
    return null; // Don't render until auth check is complete
  }

  return (
    <>
      <Toaster />
      <Appbar />
      <Container maxW='container.xl' py={8} mt={20} minH={'95vh'}>
        <Heading mb={6} textAlign='center'>
          Tag Management
        </Heading>

        {tagsLoading ? (
          <Stack spacing={4}>
            <Skeleton height='60px' />
            <Skeleton height='40px' />
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              {[...Array(9)].map((_, i) => (
                <Skeleton key={i} height='40px' />
              ))}
            </SimpleGrid>
          </Stack>
        ) : (
          <>
            {/* Add new tag section */}
            <Box
              mb={8}
              p={5}
              borderWidth='1px'
              borderRadius='lg'
              boxShadow='sm'
              bg={bgColor}
            >
              <Heading size='md' mb={4}>
                Add New Tag
              </Heading>
              <Stack spacing={4}>
                <Field.Root>
                  <Field.Label>Tag Name</Field.Label>
                  <Flex>
                    <Input
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      placeholder='Enter tag name'
                      mr={3}
                    />
                    <Button
                      colorScheme='blue'
                      loading={isSubmitting}
                      onClick={handleAddTag}
                      minW='100px'
                    >
                      Add Tag
                    </Button>
                  </Flex>
                </Field.Root>

                {tagsError && (
                  <Box p={3} bg='red.50' color='red.500' borderRadius='md'>
                    {tagsError}
                  </Box>
                )}
              </Stack>
            </Box>

            {/* Existing tags section */}
            <Box
              p={5}
              borderWidth='1px'
              borderRadius='lg'
              boxShadow='sm'
              bg={bgColor}
            >
              <Heading size='md' mb={4}>
                Manage Existing Tags
              </Heading>
              {tags && tags.length === 0 ? (
                <Text color='gray.500' textAlign='center' py={4}>
                  No tags found. Add your first tag above.
                </Text>
              ) : (
                <SimpleGrid
                  columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
                  spacing={4}
                >
                  {tags &&
                    tags.map((tag) => (
                      <Flex
                        key={tag.id}
                        p={3}
                        m={1}
                        borderWidth='1px'
                        borderRadius='md'
                        justifyContent='space-between'
                        alignItems='center'
                        bg={tagBgColor}
                        _hover={{
                          boxShadow: 'md',
                          transform: 'translateY(-2px)',
                          transition: 'all 0.2s',
                        }}
                      >
                        <Tag.Root colorScheme='blue' size='lg'>
                          <TagLabel>{tag.name}</TagLabel>
                        </Tag.Root>
                        <Button
                          size='sm'
                          colorPalette='red'
                          onClick={() => openDeleteDialog(tag)}
                        >
                          Delete
                        </Button>
                      </Flex>
                    ))}
                </SimpleGrid>
              )}
            </Box>

            <Flex justifyContent='center' mt={8}>
              <Button
                variant='outline'
                onClick={() => navigate('/Admin')}
                size='lg'
              >
                Back to Admin
              </Button>
            </Flex>
          </>
        )}
      </Container>

      {/* Delete Confirmation Dialog */}
      {isDialogOpen && (
        <Dialog.Root role='alertdialog' open={isDialogOpen}>
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>Confirm Delete</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                  <p>
                    Are you sure you want to delete the tag {selectedTag?.name}?
                    <Text mt={2} color='red.500' fontWeight='bold'>
                      This action cannot be undone.
                    </Text>
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
                  <Button
                    colorScheme='red'
                    onClick={handleDeleteTag}
                    loading={isSubmitting}
                  >
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

      <Footer />
    </>
  );
}
