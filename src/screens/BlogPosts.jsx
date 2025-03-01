import { useEffect, useState } from 'react';
import { Box, Heading, Text, VStack, Tag, HStack } from '@chakra-ui/react';
import { Appbar, Footer } from '../components/ui/index';
import axios from 'axios';
import { getenv } from '../utils/getenv';
import {
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from '../components/ui/skeleton';

const fetchPosts = async () => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: getenv('URL'),
    headers: {
      'Content-Type': 'application/json',
      Authorization: getenv('AUTH'),
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
        <VStack spacing={4} align='start'>
          {[1, 2, 3, 4, 5].map((_, index) => (
            <Box key={index} p={4} shadow='md' borderWidth='1px' width='full'>
              <Skeleton height='20px' />
              <SkeletonText noOfLines={3} spacing={4} />
              <HStack spacing={2} mt={2}>
                {[1, 2, 3].map((_, tagIndex) => (
                  <SkeletonCircle key={tagIndex} size='8' />
                ))}
              </HStack>
              <SkeletonText noOfLines={1} spacing={4} mt={2} />
            </Box>
          ))}
        </VStack>
      </>
    );
  }

  return (
    <>
      <Appbar />
      <VStack spacing={4} align='start'>
        {posts.map((post) => (
          <Box key={post.id} p={4} shadow='md' borderWidth='1px' width='full'>
            <Heading size='md'>{post.title}</Heading>
            <Text>{post.content}</Text>

            <HStack spacing={2}>
              {post.tags?.length > 0 ? (
                post.tags.map((tag) => (
                  <Tag.Root key={tag.id} size='lg' colorPalette='green'>
                    <Tag.Label>{tag.name}</Tag.Label>
                  </Tag.Root>
                ))
              ) : (
                <Text>No tags available</Text>
              )}
            </HStack>

            <Text fontSize='sm' color='gray.500'>
              Author: {post.author.email || 'Unknown'} | Published:{' '}
              {new Date(post.createdAt).toLocaleDateString()}
            </Text>
          </Box>
        ))}
      </VStack>
      <Footer />
    </>
  );
};

export default BlogPosts;
