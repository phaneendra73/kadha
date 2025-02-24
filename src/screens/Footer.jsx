import { Box, Flex, Text, Button, Link } from '@chakra-ui/react';
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaGithub,
} from 'react-icons/fa';
import { useColorModeValue, useColorMode } from '../components/ui/color-mode';
const Footer = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue('gray.100', 'gray.999');
  const color = useColorModeValue('gray.800', 'gray.200');
  const iconColor = useColorModeValue('black', 'white');
  const buttonColor = useColorModeValue('gray.200', 'gray.800');
  const hoverColor = useColorModeValue('gray.300', 'gray.600');

  return (
    <Box bg={bg} color={color} py={3} px={8} borderRadius='lg' boxShadow='xl'>
      <Flex
        justify='space-between'
        align='center'
        direction={{ base: 'column', md: 'row' }}
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
              borderColor: hoverColor,
              backgroundColor: hoverColor,
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
