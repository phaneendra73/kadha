import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Center,
  Container,
  Heading,
  Text,
  VStack,
  Flex,
} from '@chakra-ui/react';
import { Appbar, useColorModeValue } from '../components/ui/index';
const NotFound = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(10);
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const accentColor = useColorModeValue('blue.500', 'blue.300');

  useEffect(() => {
    // Redirect after timeLeft seconds
    if (timeLeft === 0) {
      navigate('/');
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, navigate]);

  const goHome = () => {
    navigate('/');
  };

  return (
    <>
      <Appbar />
      <Box
        minH='100vh'
        bg={bgColor}
        py={12}
        px={4}
        display='flex'
        alignItems='center'
      >
        <Container maxW='container.lg'>
          <Center flexDirection='column'>
            <Flex
              mb={10}
              position='relative'
              alignItems='center'
              justifyContent='center'
              flexDirection='column'
            >
              <Heading
                fontSize={{ base: '8xl', md: '9xl' }}
                fontWeight='extrabold'
                color={accentColor}
                textAlign='center'
                lineHeight='1'
                mb={4}
              >
                404
              </Heading>
            </Flex>

            <VStack spacing={6} align='center' maxW='xl' mx='auto'>
              <Heading
                as='h1'
                fontSize={{ base: '2xl', md: '4xl' }}
                fontWeight='bold'
                color={textColor}
                textAlign='center'
              >
                Oops! Page Not Found
              </Heading>
              <Text
                fontSize={{ base: 'md', md: 'lg' }}
                color={textColor}
                textAlign='center'
                opacity={0.8}
              >
                The page you are looking for might have been removed, had its
                name changed, or is temporarily unavailable.
              </Text>

              <Flex
                direction={{ base: 'column', md: 'row' }}
                gap={4}
                mt={4}
                align='center'
                justify='center'
                width='full'
              >
                <Button colorScheme='blue' size='lg' onClick={goHome} px={8}>
                  Go Home
                </Button>

                <Flex align='center' mt={{ base: 6, md: 0 }}>
                  <Text ml={4} fontSize='md' color={textColor} opacity={0.8}>
                    Redirecting to home in {timeLeft} second
                    {timeLeft !== 1 ? 's' : ''}
                  </Text>
                </Flex>
              </Flex>
            </VStack>
          </Center>
        </Container>
      </Box>
    </>
  );
};

export default NotFound;
