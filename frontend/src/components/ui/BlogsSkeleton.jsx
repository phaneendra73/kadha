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
        >
          <HStack spacing={4} flex='1'>
            <Skeleton width='60px' height='60px' borderRadius={'10px'} />
            <Box>
              <Skeleton height='20px' width='200px' />
              <SkeletonText noOfLines={2} spacing={4} mt={2} width='250px' />
            </Box>
          </HStack>
          <Box display='flex' flexDirection='column' alignItems='flex-end'>
            <Skeleton height='20px' width='100px' mb={2} />
            <HStack spacing={2} mt={2}>
              <Skeleton height='20px' width='50px' />
              <Skeleton height='20px' width='50px' />
              <Skeleton height='20px' width='50px' />
            </HStack>
          </Box>
        </Box>
      ))}
    </VStack>
  );
};
export default BlogsSkeleton;
