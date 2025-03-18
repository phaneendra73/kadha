import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import MarkdownEditor from '@uiw/react-markdown-editor';
import rehypeSanitize from 'rehype-sanitize';
import {
  Box,
  Text,
  Image,
  Tag,
  Flex,
  Link,
  IconButton,
  useBreakpointValue,
  Skeleton,
  Container,
  Heading,
  Badge,
  HStack,
  VStack,
} from '@chakra-ui/react';
import {
  Appbar,
  Footer,
  useColorModeValue,
  SkeletonText,
} from '../components/ui/index';
import { extractHeaders } from '../components/ui/extractheader';
import { LuTableOfContents } from 'react-icons/lu';
import { FaCalendarAlt } from 'react-icons/fa';
import {
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerBackdrop,
  DrawerCloseTrigger,
  DrawerTrigger,
  DrawerFooter,
} from '../components/ui/drawer';
import { getenv } from '../utils/getenv';

const ReadBlog = () => {
  const location = useLocation();

  // Extract the 'id' query parameter from the URL
  const params = new URLSearchParams(location.search);
  const id = params.get('id'); // Get 'id' from the query string
  const [blog, setBlog] = useState(null); // State to store the blog data
  const [loading, setLoading] = useState(true); // Loading state
  const [toc, setToc] = useState([]); // State to store the Table of Contents (TOC)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State to control drawer visibility
  const [activeLink, setActiveLink] = useState(null); // State to highlight the active TOC link
  const ReaderTheme = useColorModeValue('light', 'dark');
  const isMobile = useBreakpointValue({ base: true, md: false }); // Check if the screen is mobile

  // Theme colors
  const headerBgColor = useColorModeValue('white', 'gray.800');
  const headerBorderColor = useColorModeValue('gray.200', 'gray.700');
  const tocBgColor = useColorModeValue('gray.50', 'gray.800');
  const themeColor = getenv('THEMECOLOR') || '#3182CE';
  // Fetch blog data using the ID from the API
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`${getenv('APIURL')}/blog/get/${id}`);
        const data = await response.json();
        if (data.error) {
          console.error(data.error);
          return;
        }
        setBlog(data);
        setLoading(false);

        // Parse the markdown content to extract headers for TOC
        if (data.markdownContent) {
          const headers = await extractHeaders(data.markdownContent);
          setToc(headers);
        }
      } catch (error) {
        console.error('Failed to fetch blog data:', error);
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  // Function to handle TOC link clicks with hash router
  const handleTocLinkClick = (e, headerId) => {
    e.preventDefault();

    // Update the URL but maintain the hash router state
    const basePath = window.location.pathname;
    const hashRoutePart = window.location.hash.split('?')[0];
    const queryParams = window.location.hash.includes('?')
      ? '?' + window.location.hash.split('?')[1].split('#')[0]
      : '';

    // Update the URL
    const newUrl = `${basePath}${hashRoutePart}${queryParams}#${headerId}`;
    window.history.pushState(null, '', newUrl);

    // Find the element and scroll to it
    setTimeout(() => {
      const targetElement = document.getElementById(headerId);
      if (targetElement) {
        // Calculate offset if you have a fixed header
        const headerOffset = 80; // Adjust based on your header height
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }, 50); // Small delay to ensure DOM is ready

    // Close drawer if open
    if (isDrawerOpen) {
      setIsDrawerOpen(false);
    }
  };

  // Function to highlight the active TOC link based on scroll
  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY;
    let active = null;

    // Find the header closest to the top of the viewport
    toc.forEach((header) => {
      const element = document.getElementById(header.id);
      if (element) {
        const top = element.offsetTop - 100; // Adjust offset for header
        if (scrollPosition >= top) {
          active = header.id;
        }
      }
    });

    setActiveLink(active);
  }, [toc]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (loading) {
    return (
      <>
        <Appbar />
        <Container maxW='container.xl' pt={4} pb={8}>
          <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
            <Box flex='3' p={4}>
              <Skeleton height='60px' mb={4} />
              <Skeleton height='250px' mb={6} />
              <SkeletonText
                mt={6}
                noOfLines={8}
                spacing={4}
                skeletonHeight={4}
              />
            </Box>
            <Box flex='1' display={{ base: 'none', md: 'block' }}>
              <Skeleton height='300px' />
            </Box>
          </Flex>
        </Container>
        <Footer />
      </>
    );
  }

  if (!blog) {
    return (
      <>
        <Appbar />
        <Container maxW='container.xl' py={10}>
          <Box textAlign='center' py={10} px={6}>
            <Heading as='h2' size='xl'>
              Blog not found
            </Heading>
            <Text mt={4}>
              The blog post you&apos;re looking for doesn&apos;t exist or has
              been removed.
            </Text>
          </Box>
        </Container>
        <Footer />
      </>
    );
  }

  // Calculate the approximate reading time
  const calculateReadingTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
  };

  const readingTime = calculateReadingTime(blog.markdownContent || '');

  return (
    <>
      <Appbar />
      <Container maxW='container.xl' py={{ base: 4, md: 6 }}>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify='space-between'
          gap={{ base: 4, md: 6 }}
          alignItems='flex-start'
        >
          {/* Mobile TOC Drawer */}
          {isMobile && (
            <>
              <Box
                position='sticky'
                top='0'
                zIndex='sticky'
                bg={headerBgColor}
                py={2}
              >
                <DrawerRoot isOpen={isDrawerOpen} onClose={toggleDrawer}>
                  <DrawerBackdrop />
                  <DrawerTrigger asChild>
                    <IconButton
                      aria-label='Open Table of Contents'
                      colorScheme='blue'
                      variant='outline'
                      onClick={toggleDrawer}
                      position='fixed'
                      bottom='24px'
                      right='24px'
                      size='lg'
                      rounded='full'
                      shadow='lg'
                      zIndex={9}
                    >
                      <LuTableOfContents />
                    </IconButton>
                  </DrawerTrigger>

                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Table of Contents</DrawerTitle>
                      <DrawerCloseTrigger />
                    </DrawerHeader>
                    <DrawerBody>
                      {toc.length > 0 ? (
                        <VStack align='stretch' spacing={2}>
                          {toc.map((header, index) => (
                            <Link
                              key={index}
                              href={`#${header.id}`}
                              textDecoration='none'
                              onClick={(e) => handleTocLinkClick(e, header.id)}
                              pl={`${(header.level - 1) * 4}px`}
                              py={2}
                              borderLeft={`2px solid ${
                                activeLink === header.id
                                  ? themeColor
                                  : 'transparent'
                              }`}
                              bg={
                                activeLink === header.id
                                  ? 'blue.50'
                                  : 'transparent'
                              }
                              color={
                                activeLink === header.id
                                  ? 'blue.600'
                                  : 'inherit'
                              }
                              fontWeight={
                                activeLink === header.id ? 'bold' : 'normal'
                              }
                              _hover={{
                                bg: 'blue.50',
                                color: 'blue.600',
                              }}
                              transition='all 0.2s'
                              borderRadius='md'
                            >
                              {header.text}
                            </Link>
                          ))}
                        </VStack>
                      ) : (
                        <Text>No table of contents available.</Text>
                      )}
                    </DrawerBody>
                    <DrawerFooter>
                      <Text fontSize='sm' color='gray.500'>
                        {toc.length} sections in this article
                      </Text>
                    </DrawerFooter>
                  </DrawerContent>
                </DrawerRoot>
              </Box>
            </>
          )}

          {/* Main Content Section */}
          <Box flex={{ base: '1', md: '3' }} width='100%'>
            {/* Header Section with Blog Title, Image, and Tags */}
            <Box
              p={{ base: 4, md: 6 }}
              bg={headerBgColor}
              borderRadius='lg'
              borderWidth='1px'
              borderColor={headerBorderColor}
              boxShadow='md'
              mb={6}
            >
              <Flex
                direction={{ base: 'column', sm: 'row' }}
                justify='space-between'
                align={{ base: 'start', sm: 'center' }}
              >
                {/* Left Side Content */}
                <Box flex='1' mr={{ base: 0, sm: 4 }}>
                  {/* Blog Title */}
                  <Heading as='h1' size='xl' mb={4}>
                    {blog.title}
                  </Heading>

                  {/* Author and Date Info */}
                  <HStack spacing={4} mb={4} wrap='wrap'>
                    <Flex align='center'>
                      <Text fontSize='sm' color='gray.500'>
                        Author #{blog.authorId}
                      </Text>
                    </Flex>
                    <Flex align='center'>
                      <Box as={FaCalendarAlt} mr={2} color='gray.500' />
                      <Text fontSize='sm' color='gray.500'>
                        {new Date(blog.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Text>
                    </Flex>
                    <Badge colorPalette='blue' variant='subtle' px={2} py={1}>
                      {readingTime} min read
                    </Badge>
                  </HStack>

                  {/* Tags */}
                  <Flex wrap='wrap' gap={2} mt={4}>
                    {blog.tags &&
                      blog.tags.map((tag, tagIndex) => (
                        <Tag.Root
                          key={tagIndex}
                          size='lg'
                          colorPalette='green'
                          px={3}
                        >
                          {tag}
                        </Tag.Root>
                      ))}
                  </Flex>
                </Box>

                {/* Right Side Image */}
                <Box
                  width={{ base: '100%', sm: '120px' }}
                  height={{ base: '120px', sm: '120px' }}
                  mt={{ base: 4, sm: 0 }}
                  borderRadius='10px'
                  bg='gray.200'
                  overflow='hidden'
                  flexShrink={0}
                >
                  {blog.imageUrl ? (
                    <Image
                      src={blog.imageUrl}
                      alt={blog.title}
                      objectFit='cover'
                      width='100%'
                      height='100%'
                      borderRadius='10px'
                    />
                  ) : (
                    <Flex
                      width='100%'
                      height='100%'
                      justify='center'
                      align='center'
                      bg='teal.500'
                    >
                      <Text
                        fontSize='3xl'
                        color='white'
                        fontWeight='bold'
                        textAlign='center'
                      >
                        {blog.title[0]}
                      </Text>
                    </Flex>
                  )}
                </Box>
              </Flex>
            </Box>

            <Box mb={6} />

            {/* Markdown Content Section */}
            <Box
              width='100%'
              p={{ base: 4, md: 6 }}
              borderWidth='1px'
              borderRadius='lg'
              boxShadow='md'
              bg={headerBgColor}
              data-color-mode={ReaderTheme}
              className='markdown-content'
              minHeight='500px'
              overflowX='auto'
              onScroll={handleScroll}
              mb={'6'}
            >
              <MarkdownEditor.Markdown
                source={blog.markdownContent || ''}
                remarkRehypeOptions={rehypeSanitize}
                urlTransform={(url) => {
                  // Check if it's an internal anchor link (starts with #)
                  if (url && url.startsWith('#')) {
                    // Get the current hash router path and query parameters
                    const hashRoutePart = window.location.hash.split('?')[0];
                    const queryParams = window.location.hash.includes('?')
                      ? '?' + window.location.hash.split('?')[1].split('#')[0]
                      : '';

                    // Return the properly formatted URL that maintains the hash router
                    return `${hashRoutePart}${queryParams}${url}`;
                  }

                  // For external links, return unchanged
                  return url;
                }}
              />
            </Box>
          </Box>

          {/* Desktop Table of Contents (Sticky) */}
          {!isMobile && (
            <Box
              position='sticky'
              top='20px'
              flex={{ base: '1', md: '1' }}
              maxW={{ md: '300px' }}
              p={4}
              borderWidth='1px'
              borderRadius='lg'
              boxShadow='md'
              bg={tocBgColor}
              height='fit-content'
              maxHeight='calc(100vh - 100px)'
              overflowY='auto'
              alignSelf='flex-start'
            >
              <Heading
                as='h3'
                size='md'
                mb={4}
                pb={2}
                borderBottom='1px solid'
                borderColor='gray.200'
              >
                Table of Contents
              </Heading>
              {toc.length > 0 ? (
                <VStack align='stretch' spacing={1}>
                  {toc.map((header, index) => (
                    <Link
                      key={index}
                      href={`#${header.id}`}
                      textDecoration='none'
                      onClick={(e) => handleTocLinkClick(e, header.id)}
                      pl={`${(header.level - 1) * 4}px`}
                      py={2}
                      borderLeft={`2px solid ${
                        activeLink === header.id ? themeColor : 'transparent'
                      }`}
                      bg={activeLink === header.id ? 'blue.50' : 'transparent'}
                      color={activeLink === header.id ? 'blue.600' : 'inherit'}
                      fontWeight={
                        activeLink === header.id ? 'medium' : 'normal'
                      }
                      fontSize={`${16 - (header.level - 1) * 1}px`}
                      _hover={{
                        bg: 'blue.50',
                        color: 'blue.600',
                      }}
                      transition='all 0.2s'
                      borderRadius='md'
                    >
                      {header.text}
                    </Link>
                  ))}
                </VStack>
              ) : (
                <Text>No table of contents available.</Text>
              )}
            </Box>
          )}
        </Flex>
        <Footer />
      </Container>
    </>
  );
};
export default ReadBlog;
