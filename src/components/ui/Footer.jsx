import { Box, Flex, Text, Button, Link } from '@chakra-ui/react';
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaGithub,
} from 'react-icons/fa';
import { useColorModeValue, useColorMode } from './index.js';

const Footer = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const color = useColorModeValue('gray.800', 'gray.200');
  const iconColor = useColorModeValue('black', 'white');
  const buttonColor = useColorModeValue('gray.200', 'gray.800');

  return (
    <Box
      color={color}
      py={3}
      px={8}
      borderRadius='lg'
      boxShadow='xl'
      w='100%' // Ensure the footer takes up the full width of the viewport
      position='relative' // Make sure footer doesn't overlap with other content
      zIndex='10'
    >
      <Flex
        justify='space-between'
        align='center'
        direction={{ base: 'column', md: 'row' }}
        w='100%' // Make sure Flex container takes full width
      >
        <Text fontSize='lg' fontWeight='bold' mb={{ base: 4, md: 0 }}>
          &copy; {new Date().getFullYear()} Kadha
        </Text>
        <Flex align='center' gap={4}>
          <Link href='https://facebook.com/yourfacebookpage' target='_blank'>
            <FaFacebook size={24} color={iconColor} />
          </Link>
          <Link href='https://twitter.com/yourtwitterhandle' target='_blank'>
            <FaTwitter size={24} color={iconColor} />
          </Link>
          <Link
            href='https://instagram.com/yourinstagramhandle'
            target='_blank'
          >
            <FaInstagram size={24} color={iconColor} />
          </Link>
          <Link
            href='https://linkedin.com/in/yourlinkedinprofile'
            target='_blank'
          >
            <FaLinkedin size={24} color={iconColor} />
          </Link>
          <Link href='https://github.com/yourgithubusername' target='_blank'>
            <FaGithub size={24} color={iconColor} />
          </Link>
          <Button
            variant='outline'
            borderColor={iconColor}
            color={iconColor}
            _hover={{
              borderColor: 'gray.500',
              backgroundColor: 'gray.500',
              color: buttonColor,
            }}
            onClick={toggleColorMode}
            aria-label='Toggle theme'
            size='sm'
          >
            {colorMode === 'light' ? 'Switch to Dark' : 'Switch to Light'}
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Footer;
