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
} from '@chakra-ui/react';
import {
  Appbar,
  Footer,
  useColorModeValue,
  SkeletonCircle,
  SkeletonText,
} from './index';
import { extractHeaders } from './extractheader';
import { GiHamburgerMenu } from 'react-icons/gi';
import {
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerBackdrop,
  DrawerCloseTrigger,
  DrawerTrigger,
} from './drawer';
import { getenv } from '../../utils/getenv';

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

    fetchBlog();
  }, [id]);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  // Function to highlight the active TOC link based on scroll
  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY;
    let active = null;

    toc.forEach((header) => {
      const element = document.getElementById(header.id);
      if (element) {
        const top = element.offsetTop - 70; // Adjust offset for header
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
        <Box>
          <Skeleton height='40px' mb={4} />
          <Skeleton height='200px' mb={4} />
          <SkeletonText mt={4} noOfLines={4} spacing='4' />
        </Box>
      </>
    );
  }

  if (!blog) {
    return <Text>Blog not found.</Text>;
  }

  return (
    <>
      <Appbar />
      <Flex
        direction={{ base: 'column', md: 'row' }}
        justify='space-between'
        m={4}
        alignItems='flex-start'
      >
        {/* Mobile Drawer for TOC */}
        {isMobile && (
          <>
            <DrawerRoot isOpen={isDrawerOpen} onClose={toggleDrawer}>
              <DrawerBackdrop />
              <DrawerTrigger asChild>
                <IconButton
                  aria-label='Open Table of Contents'
                  icon={<GiHamburgerMenu />}
                  onClick={toggleDrawer}
                  display={{ base: 'block', md: 'none' }}
                  mb={4}
                />
              </DrawerTrigger>

              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Table of Contents</DrawerTitle>
                </DrawerHeader>
                <DrawerBody>
                  {toc.length > 0 ? (
                    <ul>
                      {toc.map((header, index) => (
                        <li key={index}>
                          <Link
                            href={`#${header.id}`}
                            textDecoration='none'
                            onClick={() => header.id}
                          >
                            {' '.repeat(header.level - 1)} {header.text}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Text>No table of contents available.</Text>
                  )}
                </DrawerBody>
                <DrawerCloseTrigger />
              </DrawerContent>
            </DrawerRoot>
          </>
        )}

        {/* Main Content Section */}
        <Box
          flex={{ base: '1', md: '3' }} // Main content adjusts based on screen size
          mr={4}
          mb={{ base: 4, md: 0 }}
        >
          {/* Header Section with Blog Title, Image, and Tags */}
          <Box
            p={4}
            display='flex'
            alignItems='center'
            justifyContent='space-between'
            borderRadius='md'
            border='2px solid'
            borderColor='gray.200'
            boxShadow='sm'
          >
            {/* Left Section: Image and Title */}
            <Box display='flex' flex='1' alignItems='center'>
              <Box
                mr={4}
                width='100px'
                height='100px'
                display='flex'
                justifyContent='center'
                alignItems='center'
                borderRadius='10px'
                bg='gray.200'
                overflow='hidden'
              >
                {loading ? (
                  <SkeletonCircle size='100px' />
                ) : (
                  <Image
                    src={blog.imageUrl}
                    alt={blog.title}
                    objectFit='cover'
                    width='100%'
                    height='100%'
                    borderRadius='10px'
                  />
                )}
              </Box>

              <Box>
                {loading ? (
                  <SkeletonText mt={2} noOfLines={2} spacing='4' />
                ) : (
                  <>
                    <Text fontWeight='bold' fontSize='xl' mb={1}>
                      {blog.title}
                    </Text>
                    <Text fontSize='sm' color='gray.500'>
                      Published on{' '}
                      {new Date(blog.createdAt).toLocaleDateString()} by Author
                      #{blog.authorId}
                    </Text>
                  </>
                )}
              </Box>
            </Box>

            {/* Right Section: Tags */}
            <Box display='flex' flexDirection='column' alignItems='flex-end'>
              {/* Tags */}
              <Box
                display='flex'
                flexWrap='wrap'
                justifyContent='flex-end'
                mt={2}
              >
                {blog.tags.map((tag, tagIndex) => (
                  <Tag.Root key={tagIndex} size='sm' colorScheme='teal' mr={2}>
                    {tag}
                  </Tag.Root>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Markdown Content Section */}
          <Box
            width='full'
            p={6}
            borderWidth={1}
            borderRadius='md'
            boxShadow='sm'
            data-color-mode={ReaderTheme}
            mt={4}
            onScroll={handleScroll}
          >
            {loading ? (
              <SkeletonText mt={4} noOfLines={6} spacing='4' />
            ) : (
              <MarkdownEditor.Markdown
                source={blog.markdownContent || ''}
                remarkRehypeOptions={rehypeSanitize}
              />
            )}
          </Box>
        </Box>

        {/* Desktop Table of Contents (Sticky) */}
        {!isMobile && (
          <Box
            position='sticky'
            top={20}
            flex={{ base: '1', md: '0.8' }}
            ml={4}
            p={4}
            borderWidth={1}
            borderRadius='md'
            boxShadow='sm'
          >
            <Text fontSize='lg' fontWeight='bold' mb={2}>
              Table of Contents
            </Text>
            {toc.length > 0 ? (
              <ul>
                {toc.map((header, index) => (
                  <li key={index}>
                    <Link
                      href={`#${header.id}`}
                      textDecoration='none'
                      fontWeight={activeLink === header.id ? 'bold' : 'normal'}
                      borderBottom={
                        activeLink === header.id
                          ? `2px solid ${getenv('THEMECOLOR')}`
                          : 'none'
                      }
                      padding='2px'
                    >
                      {' '.repeat(header.level - 1)} {header.text}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <Text>No table of contents available.</Text>
            )}
          </Box>
        )}
      </Flex>
      <Footer />
    </>
  );
};

export default ReadBlog;
