import { motion } from 'framer-motion';
import { Box, Heading, Text, Container } from '@chakra-ui/react';
import {
  useColorModeValue,
  SearchBar,
  Appbar,
  HomePage,
} from '../components/ui/index.js';
import { useEffect, useState } from 'react';

export default function Hero() {
  const textColor = useColorModeValue('black', 'white');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    setMousePosition({ x: clientX, y: clientY });
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Animation based on mouse position
  const motionStyles = {
    x: (mousePosition.x - window.innerWidth / 2) * 0.02, // Parallax effect based on mouse X position
    y: (mousePosition.y - window.innerHeight / 2) * 0.02, // Parallax effect based on mouse Y position
    transition: {
      type: 'spring',
      damping: 10,
      stiffness: 100,
    },
  };

  // Add a slight idle up and down animation using `y`
  const oscillationAnimation = {
    y: [
      -3, // Starting position (slightly up)
      3, // Moving slightly down
      -3, // Moving slightly up again
    ],
    transition: {
      y: {
        duration: 2, // The duration of the oscillation cycle
        repeat: Infinity, // Repeat infinitely
        repeatType: 'loop', // Make it loop in both directions
        ease: 'easeInOut', // Smooth easing
      },
    },
  };

  return (
    <>
      <Appbar />
      <Container
        maxW='container.lg'
        display='flex'
        flexDirection='column'
        justifyContent='flex-start'
        alignItems='center'
        overflow='hidden'
        pt={6}
      >
        {/* Main Hero Content */}
        <motion.div
          animate={{ y: 0, opacity: 1 }}
          initial={{ y: -20, opacity: 0 }}
          transition={{
            duration: 0.5,
            ease: 'easeInOut',
            type: 'spring',
            damping: 10,
            delay: 0.3,
          }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Welcome Text */}
          <Box textAlign='center'>
            <Text fontSize='xl' fontWeight='medium' color={textColor}>
              Welcome to
            </Text>
          </Box>

          {/* Kadha Title with Motion */}
          <motion.div style={motionStyles} animate={oscillationAnimation}>
            <Box textAlign='center' mb={2}>
              <Heading
                as='h1'
                fontSize={{ base: '4xl', md: '6xl', xl: '7xl' }}
                fontWeight='bold'
                color={textColor}
                textShadow='2px 2px 5px rgba(0, 0, 0, 0.2)'
                background='linear-gradient(180deg, #00FF00, #39FF14)'
                backgroundClip='text'
                lineHeight='1.2'
              >
                Kadha
              </Heading>
            </Box>
          </motion.div>

          {/* Description Text Below Kadha */}
          <Box textAlign='center'>
            <Text
              fontSize={{ base: 'md', md: 'xl' }}
              color={textColor}
              maxW='lg'
              textAlign='center'
              mb={6}
            >
              A destination where learning never stops, providing you with the
              insights to grow, learn, and achieve more.
            </Text>
          </Box>
        </motion.div>
      </Container>
      <SearchBar />
      <HomePage />
    </>
  );
}
