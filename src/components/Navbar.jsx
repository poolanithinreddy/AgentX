import {
  Box,
  Flex,
  Heading,
  HStack,
  VStack,
  Button,
  Link as ChakraLink,
  useBreakpointValue,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Chat', path: '/chat' },
    { label: 'Focus Mode', path: '/focus' },
    { label: 'Dashboard', path: '/dashboard' },
  ];

  useEffect(() => {
    const storedName = localStorage.getItem('agentx_name');
    if (storedName) {
      setUserName(storedName);
    } else {
      setUserName('');
    }
  }, [pathname]); // Refresh userName when path changes (like after login)

  const handleLogout = () => {
    localStorage.removeItem('agentx_user');
    localStorage.removeItem('agentx_name');
    navigate('/login');
  };

  // 📱 Dynamic Stack direction based on screen size
  const stackDirection = useBreakpointValue({ base: 'column', md: 'row' });

  return (
    <Box
      as="nav"
      position="sticky"
      top="0"
      zIndex="999"
      backdropFilter="blur(10px)"
      bg="rgba(15, 15, 15, 0.85)"
      borderBottom="1px solid rgba(255, 255, 255, 0.05)"
      px={{ base: 4, md: 6 }}
      py={{ base: 3, md: 4 }}
    >
      <Flex
        maxW="7xl"
        mx="auto"
        align="center"
        flexDirection={stackDirection}
        gap={{ base: 3, md: 0 }}
      >
        {/* Brand */}
        <Heading
          fontSize="2xl"
          bgGradient="linear(to-r, cyan.400, blue.500, purple.600)"
          bgClip="text"
          fontWeight="extrabold"
          textAlign={{ base: 'center', md: 'left' }}
          w={{ base: '100%', md: 'auto' }}
        >
          AgentX
        </Heading>

        <Spacer />

        {/* Navigation Items */}
        <HStack
          spacing={{ base: 4, md: 6 }}
          flexWrap="wrap"
          justify={{ base: 'center', md: 'flex-start' }}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <ChakraLink
                as={Link}
                to={item.path}
                key={item.path}
                fontWeight="medium"
                fontSize="sm"
                px={2}
                py={1}
                color={isActive ? 'blue.400' : 'gray.300'}
                borderBottom={isActive ? '2px solid' : '2px solid transparent'}
                borderColor={isActive ? 'blue.400' : 'transparent'}
                _hover={{
                  color: 'blue.300',
                  borderColor: 'blue.300',
                }}
                transition="all 0.2s ease-in-out"
              >
                {item.label}
              </ChakraLink>
            );
          })}
        </HStack>

        <Spacer />

        {/* 👤 User Section */}
        {userName && (
          <HStack spacing={{ base: 2, md: 4 }} mt={{ base: 2, md: 0 }}>
            <Text fontSize="sm" color="gray.300" textAlign="center">
              Welcome, {userName.split(' ')[0]} 👋
            </Text>
            <Button
              size="sm"
              colorScheme="red"
              variant="outline"
              onClick={handleLogout}
              fontSize="sm"
            >
              Logout
            </Button>
          </HStack>
        )}
      </Flex>
    </Box>
  );
}
