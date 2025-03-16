import { Skeleton, SkeletonText } from './index';
import { Box, VStack, HStack } from '@chakra-ui/react';

const BlogsSkeleton = () => {
  return (
    <VStack spacing={4} align='start' m={2}>
      {[1, 2, 3, 4, 5].map((_, index) => (
        <Box
          key={index}
          shadow='md'
          p={2}
          borderWidth='1px'
          width='full'
          display='flex'
          alignItems='center'
          justifyContent='space-between'
          borderRadius={7}
          flexDirection={{ base: 'column', sm: 'row' }} // Stack on mobile, row on larger screens
        >
          <HStack
            spacing={4}
            flex='1'
            wrap='wrap'
            justifyContent={{ base: 'center', sm: 'flex-start' }}
          >
            <Skeleton
              width={{ base: '50px', sm: '60px' }}
              height={{ base: '50px', sm: '60px' }}
              borderRadius={'10px'}
            />
            <Box>
              <Skeleton height='20px' width={{ base: '150px', sm: '200px' }} />
              <SkeletonText
                noOfLines={2}
                spacing={4}
                mt={2}
                width={{ base: '180px', sm: '250px' }}
              />
            </Box>
          </HStack>
          <Box
            display='flex'
            flexDirection='column'
            alignItems='flex-end'
            mt={{ base: 4, sm: 0 }} // Add margin on mobile to space out
          >
            <Skeleton
              height='20px'
              width={{ base: '80px', sm: '100px' }}
              mb={2}
            />
            <HStack
              spacing={2}
              mt={2}
              wrap='wrap'
              justifyContent={{ base: 'center', sm: 'flex-start' }}
            >
              <Skeleton height='20px' width={{ base: '50px', sm: '50px' }} />
              <Skeleton height='20px' width={{ base: '50px', sm: '50px' }} />
              <Skeleton height='20px' width={{ base: '50px', sm: '50px' }} />
            </HStack>
          </Box>
        </Box>
      ))}
    </VStack>
  );
};

export default BlogsSkeleton;
