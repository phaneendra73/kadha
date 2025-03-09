import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Input, VStack, Heading } from '@chakra-ui/react';
import { Toaster, toaster } from '../components/ui/toaster'; // Assuming toaster is set up properly
import axios from 'axios';
import { getenv } from '../utils/getenv';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // useNavigate instead of history

  const handleSignin = async () => {
    setLoading(true);

    try {
      const response = await axios.post(`${getenv('APIURL')}/user/signin`, {
        email,
        password,
      });

      const { jwt, message } = response.data;

      // Save JWT to localStorage
      localStorage.setItem('authToken', jwt);

      toaster.create({
        title: message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Redirect to the Editor page (use navigate instead of history.push)
      navigate('/Editor'); // Correct use of navigate
    } catch (error) {
      toaster.create({
        title: 'Error signing in',
        description: error.response?.data?.message || 'Please try again later.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW='md' mx='auto' mt={10} p={6} borderWidth={1} borderRadius='lg'>
      <VStack spacing={4}>
        <Heading size='lg'>Sign In</Heading>
        <Toaster />
        <Input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Enter your email'
        />
        <Input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Enter your password'
        />

        <Button
          colorScheme='blue'
          width='full'
          onClick={handleSignin}
          isLoading={loading}
        >
          Sign In
        </Button>
      </VStack>
    </Box>
  );
};

export default Signin;
