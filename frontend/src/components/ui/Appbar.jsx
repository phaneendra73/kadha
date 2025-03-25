import {
  Box,
  Flex,
  Heading,
  Button,
  useBreakpointValue,
  Avatar,
  IconButton,
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
  Icon,
  Switch,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useColorMode, useColorModeValue } from './color-mode';
import { GoSun, GoMoon } from 'react-icons/go';
import { HiMenuAlt3 } from 'react-icons/hi';
const Appbar = () => {
  const { toggleColorMode, colorMode } = useColorMode();
  const navigate = useNavigate();
  const textColor = useColorModeValue('black', 'white');
  const buttonSpacing = useBreakpointValue({ base: '2', md: '4' });
  const [authToken, setAuthToken] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('p73SessionData');
    setAuthToken(token);
  }, []);

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('p73SessionData');
    setAuthToken(null); // Update the state to reflect logout
    navigate('/Signin'); // Redirect to the SignIn page after logout
  };
  return (
    <Box
      as='nav'
      position='fixed'
      top='1rem'
      left='0'
      right='0'
      zIndex='1000'
      bg={'rgba(0, 0, 0, 0)'}
      color={textColor}
      boxShadow='sm'
      p='0.5rem'
      backdropFilter='blur(8px)'
      width={{ base: '100%', md: '80%' }}
      mx='auto'
      borderRadius='15px'
      border={`1px solid ${textColor}`}
    >
      <Flex justify='space-between' align='center'>
        {/* Blog Heading */}
        <Heading
          size='md'
          onClick={() => navigate('/')}
          cursor='pointer'
          fontWeight='bold'
          letterSpacing='widest'
        >
          <Flex align='center' gap={2}>
            {' '}
            <Avatar.Root>
              <Avatar.Fallback name='Kadha' />
              <Avatar.Image src='https://avatars.githubusercontent.com/u/118047850?v=4' />
            </Avatar.Root>
          </Flex>
        </Heading>

        <Flex
          gap={buttonSpacing}
          direction={{ base: 'column', md: 'row' }}
          display={{ base: 'none', md: 'flex' }}
        >
          <Box display='flex' alignItems='center' gap={2}>
            {/* Sun Icon */}
            <Icon
              as={GoSun}
              boxSize={6}
              transition='all 0.3s'
              color={colorMode === 'dark' ? 'gray.400' : 'green.400'}
            />

            {/* Switch */}
            <Switch.Root
              checked={colorMode === 'dark'}
              colorPalette={'green'}
              size='lg'
              onCheckedChange={() => {
                toggleColorMode();
              }}
            >
              <Switch.HiddenInput />
              <Switch.Control />
            </Switch.Root>

            {/* Moon Icon */}
            <Icon
              as={GoMoon}
              boxSize={6}
              transition='all 0.3s'
              color={colorMode === 'dark' ? 'green.400' : 'gray.400'}
            />
          </Box>
          <Button
            onClick={() => navigate('/')}
            variant='outline'
            borderColor={textColor}
            color={textColor}
            size='sm'
          >
            Home
          </Button>

          <MenuRoot placement='bottom-end'>
            <MenuTrigger asChild>
              <Button
                variant='outline'
                size='sm'
                borderColor={textColor}
                color={textColor}
              >
                More
              </Button>
            </MenuTrigger>

            <MenuContent position='absolute' zIndex='999' top='100%' left='90%'>
              {authToken ? (
                <MenuItem value='Admin' onClick={handleLogout}>
                  {' '}
                  Log Out
                </MenuItem>
              ) : (
                <MenuItem value='Admin' onClick={() => navigate('/Signin')}>
                  Sign In
                </MenuItem>
              )}
            </MenuContent>
          </MenuRoot>
        </Flex>

        {/* Mobile Hamburger Icon (visible on smaller screens) */}
        <DrawerRoot>
          <DrawerBackdrop />
          <DrawerTrigger asChild>
            <IconButton
              display={{ base: 'block', md: 'none' }} // Display only on mobile
              aria-label='Open menu'
              variant='outline'
              size='lg'
            >
              <HiMenuAlt3 />
            </IconButton>
          </DrawerTrigger>

          {/* Drawer Content for Mobile Navigation */}
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Menu</DrawerTitle>
            </DrawerHeader>
            <DrawerBody>
              <Button
                variant='outline'
                w='100%'
                mb={4}
                borderColor={textColor}
                onClick={() => navigate('/')}
                color={textColor}
              >
                Home
              </Button>
              {authToken ? (
                <Button w='100%' mb={4} onClick={handleLogout}>
                  Log Out
                </Button>
              ) : (
                <Button w='100%' mb={4} onClick={() => navigate('/Signin')}>
                  Sign In
                </Button>
              )}
              <Button w='100%' mb={4} onClick={toggleColorMode}>
                {colorMode === 'light' ? <GoSun /> : <GoMoon />}
              </Button>
            </DrawerBody>
            <DrawerCloseTrigger />
          </DrawerContent>
        </DrawerRoot>
      </Flex>
    </Box>
  );
};

export default Appbar;
