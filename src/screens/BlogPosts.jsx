import { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Spinner,
  Tag,
  HStack,
} from '@chakra-ui/react';
import Appbar from '../components/ui/Appbar';
import axios from 'axios';
const fetchPosts = async () => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: '',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ',
    },
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

const BlogPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPosts = async () => {
      const data = await fetchPosts();
      setPosts(data);
      setLoading(false);
    };

    getPosts();
  }, []);

  if (loading) {
    return (
      <>
        <Appbar />
        <VStack colorPalette='teal' fontSize={'xl'} marginTop={50}>
          <Spinner color='colorPalette.600' />
          <Text color=''>Loading...</Text>
        </VStack>
      </>
    );
  }

  return (
    <>
      <VStack spacing={4} align='start'>
        {console.log(posts)}
        {posts.map((post) => (
          <Box key={post.id} p={4} shadow='md' borderWidth='1px' width='full'>
            <Heading size='md'>{post.title}</Heading>
            <Text>{post.content}</Text>

            <HStack spacing={2}>
              {post.tags?.length > 0 ? (
                post.tags.map((tag) => {
                  return (
                    <>
                      <Tag.Root size='lg' colorPalette={'green'}>
                        <Tag.Label>{tag.name}</Tag.Label>
                      </Tag.Root>
                    </>
                  );
                })
              ) : (
                <Text></Text>
              )}
            </HStack>

            <Text fontSize='sm' color='gray.500'>
              Author: {post.author.email || 'Unknown'} | Published:{' '}
              {new Date(post.createdAt).toLocaleDateString()}
            </Text>
          </Box>
        ))}
      </VStack>
    </>
  );
};

export default BlogPosts;
