import {
  Box,
  Button,
  Container,
  Heading,
  Image,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  useBreakpointValue,
  IconButton,
  useColorMode,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaDumbbell, FaSpa, FaChevronDown, FaSun, FaMoon } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const MotionBox = motion(Box);
const MotionImage = motion(Image);
const MotionStack = motion(Stack);
const MotionChevron = motion(FaChevronDown);

export default function Landing() {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userEmail = localStorage.getItem('agentx_user');
    setIsLoggedIn(!!userEmail);
  }, []);

  return (
    <Box
      position="relative"
      minH="100vh"
      overflow="hidden"
      bgGradient="radial(at top left, #1a1a2e, #000000)"
      px={{ base: 4, md: 0 }}
    >
      {/* Theme Toggle */}
      <IconButton
        aria-label="Toggle Theme"
        icon={colorMode === 'dark' ? <FaSun /> : <FaMoon />}
        position="fixed"
        top={4}
        right={4}
        zIndex={10}
        onClick={toggleColorMode}
      />

      {/* Aurora Animation */}
      <MotionBox
        position="absolute"
        top="-100px"
        left="-100px"
        w="600px"
        h="600px"
        bgGradient="radial(ellipse at center, rgba(72, 187, 255, 0.4), transparent)"
        filter="blur(150px)"
        zIndex={0}
        animate={{ scale: [1, 1.05, 1], opacity: [0.9, 1, 0.9] }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
      />

      {/* Floating Particles */}
      {[...Array(12)].map((_, i) => (
        <MotionBox
          key={i}
          position="absolute"
          top={`${Math.random() * 90}%`}
          left={`${Math.random() * 90}%`}
          w="2px"
          h="2px"
          bg="whiteAlpha.500"
          borderRadius="full"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: Math.random() * 5 + 3, repeat: Infinity }}
          zIndex={0}
        />
      ))}

      <Container maxW="7xl" pt={{ base: 20, md: 28 }} pb={20} position="relative" zIndex={2}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 10, md: 20 }} alignItems="center">
          {/* 🧠 Hero Text */}
          <MotionStack
            spacing={{ base: 6, md: 8 }}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            textAlign={{ base: 'center', md: 'left' }}
          >
            <Heading
              fontSize={{ base: '3xl', md: '5xl' }}
              fontWeight="bold"
              bgGradient="linear(to-r, cyan.400, purple.500)"
              bgClip="text"
            >
              Meet Your 3 AI Guides
            </Heading>
            <Text fontSize={{ base: 'md', md: 'lg' }} color="gray.300">
              ✨ <b>Supportive Coach</b>: Your caring companion helping you stay emotionally strong and productive.<br/>
              🏋️‍♂️ <b>Gym Trainer</b>: Your tough fitness coach motivating you to push harder.<br/>
              🧘 <b>Meditation Guru</b>: Your calm mentor guiding you toward mindfulness and inner peace.<br/><br/>
              Powered by 3 advanced AI models working seamlessly for your mind, body, and soul.
            </Text>

            <Stack direction="column" spacing={4}>
              {!isLoggedIn ? (
                <Button
                  size="lg"
                  px={8}
                  py={6}
                  bgGradient="linear(to-r, purple.500, blue.500)"
                  _hover={{ bgGradient: 'linear(to-r, purple.600, blue.600)', transform: 'scale(1.03)' }}
                  color="white"
                  boxShadow="0 0 20px rgba(128, 90, 213, 0.6)"
                  transition="all 0.3s ease-in-out"
                  onClick={() => navigate('/login')}
                >
                  🔑 Login to Continue
                </Button>
              ) : (
                <>
                  <Button as={Link} to="/chat" size="lg" bgGradient="linear(to-r, purple.400, blue.400)" color="white" _hover={{ transform: 'scale(1.03)' }}>
                    💬 Go to Chat
                  </Button>
                  <Button as={Link} to="/focus" size="lg" bgGradient="linear(to-r, pink.400, red.400)" color="white" _hover={{ transform: 'scale(1.03)' }}>
                    🧠 Enter Focus Mode
                  </Button>
                  <Button as={Link} to="/dashboard" size="lg" bgGradient="linear(to-r, teal.400, green.400)" color="white" _hover={{ transform: 'scale(1.03)' }}>
                    📊 View Dashboard
                  </Button>
                </>
              )}
            </Stack>
          </MotionStack>

          {/* Hero Image */}
          <Box position="relative">
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              w={{ base: '280px', md: '350px' }}
              h={{ base: '280px', md: '350px' }}
              bgGradient="radial(circle, rgba(59,130,246,0.4), transparent)"
              filter="blur(70px)"
              zIndex={0}
            />
            <MotionImage
              src="/agentx-hero.png"
              alt="AgentX Hero"
              maxH={{ base: '250px', md: '400px' }}
              objectFit="contain"
              zIndex={1}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              mx="auto"
            />
          </Box>
        </SimpleGrid>

        {/* Features */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 6, md: 8 }} mt={24}>
          <FeatureCard icon={<FaHeart />} title="Emotional Support" desc="Stay calm, supported, and productive with empathetic advice." />
          <FeatureCard icon={<FaDumbbell />} title="Fitness Coaching" desc="Get tough love motivation and personalized workout tips." />
          <FeatureCard icon={<FaSpa />} title="Mindfulness Mentor" desc="Relax your mind and reconnect through mindfulness practices." />
        </SimpleGrid>
      </Container>

      {/* ⬇ Scroll Down Indicator */}
      <MotionChevron
        size="24px"
        color="gray.400"
        position="absolute"
        bottom="40px"
        left="50%"
        style={{ transform: 'translateX(-50%)' }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      />

      {/* Wave Background */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        style={{ position: 'absolute', bottom: 0, left: 0, zIndex: 1 }}
      >
        <path
          fill="#111827"
          fillOpacity="1"
          d="M0,192L48,181.3C96,171,192,149,288,165.3C384,181,480,235,576,240C672,245,768,203,864,176C960,149,1056,139,1152,149.3C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>
    </Box>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <VStack
      spacing={4}
      align="start"
      p={6}
      bg="rgba(255, 255, 255, 0.03)"
      borderRadius="xl"
      boxShadow="lg"
      backdropFilter="blur(10px)"
      _hover={{ transform: 'translateY(-5px)', boxShadow: 'xl' }}
      transition="all 0.3s ease"
      textAlign="center"
    >
      <Box fontSize="2xl">{icon}</Box>
      <Heading fontSize={{ base: 'md', md: 'lg' }}>{title}</Heading>
      <Text fontSize={{ base: 'sm', md: 'sm' }} color="gray.300">{desc}</Text>
    </VStack>
  );
}
