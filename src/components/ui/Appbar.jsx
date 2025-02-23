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
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useColorMode, useColorModeValue } from './color-mode';
import { GoSun, GoMoon } from 'react-icons/go';
import { HiMenuAlt3 } from 'react-icons/hi'; // Hamburger Icon
const Appbar = () => {
  const { toggleColorMode, colorMode } = useColorMode();
  const navigate = useNavigate();
  const textColor = useColorModeValue('black', 'white');
  const buttonSpacing = useBreakpointValue({ base: '2', md: '4' });

  return (
    <Box
      as='nav'
      position='fixed'
      top='20px'
      left='0'
      right='0'
      zIndex='1000'
      bg={'rgba(0, 0, 0, 0)'}
      color={textColor}
      boxShadow='sm'
      p='1rem'
      backdropFilter='blur(8px)'
      width={{ base: '100%', md: '80%' }}
      mx='auto'
      borderRadius='15px'
      border='1px solid white'
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
          <IconButton
            aria-label='Toggle color mode'
            onClick={toggleColorMode}
            variant='outline'
            size='lg'
          >
            {colorMode === 'light' ? <GoSun /> : <GoMoon />}
          </IconButton>

          <Button onClick={() => navigate('/BlogPosts')} variant='outline'>
            Blog Posts
          </Button>

          <Button onClick={() => navigate('/Editor')} variant='outline'>
            Add Post
          </Button>

          <MenuRoot placement='bottom-end'>
            <MenuTrigger asChild>
              <Button variant='outline' size='sm'>
                More
              </Button>
            </MenuTrigger>

            <MenuContent position='absolute' zIndex='999' top='100%' left='90%'>
              <MenuItem value='new-txt'>New Text File</MenuItem>

              <MenuItem value='new-file'>New File...</MenuItem>

              <MenuItem value='new-win'>New Window</MenuItem>

              <MenuItem value='open-file'>Open File...</MenuItem>

              <MenuItem value='export'>Export</MenuItem>
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
              <Button w='100%' mb={4} onClick={() => navigate('/BlogPosts')}>
                Blog Posts
              </Button>
              <Button w='100%' mb={4} onClick={() => navigate('/contact')}>
                Contact
              </Button>
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
