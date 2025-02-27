import { motion } from 'framer-motion';
import { Box, Heading, Text, Container } from '@chakra-ui/react'; // Chakra UI imports
import Appbar from '../components/ui/Appbar'; // Assuming this is a custom component
import { useColorModeValue } from '../components/ui/color-mode';
import SearchBar from '../components/searchbar';

export default function Hero() {
  const textColor = useColorModeValue('black', 'white');

  return (
    <>
      <Appbar />
      <Container
        maxW='container.lg'
        display='flex'
        flexDirection='column'
        justifyContent='flex-start' // Align content to the top instead of center
        alignItems='center'
        overflow='hidden' // Prevent overflow issues
        pt={6} // Optional: Add padding to the top for spacing if needed
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

          {/* Kadha Title */}
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

          {/* Description Text Below Kadha */}
          <Box textAlign='center'>
            <Text
              fontSize={{ base: 'md', md: 'xl' }}
              color={textColor}
              maxW='lg'
              textAlign='center'
              mb={6}
            >
              A place where you&apos;ll discover valuable content to enhance
              your skills and expand your knowledge.
            </Text>
          </Box>
        </motion.div>
      </Container>
      <SearchBar />
    </>
  );
}
