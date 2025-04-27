import {
  Box,
  Flex,
  Heading,
  HStack,
  Button,
  Link as ChakraLink,
  useColorModeValue,
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
  }, [pathname]); //Listen when path changes (like after Login)

  const handleLogout = () => {
    localStorage.removeItem('agentx_user');
    localStorage.removeItem('agentx_name');
    navigate('/login');
  };

  return (
    <Box
      as="nav"
      position="sticky"
      top="0"
      zIndex="999"
      backdropFilter="blur(10px)"
      bg="rgba(15, 15, 15, 0.85)"
      borderBottom="1px solid rgba(255, 255, 255, 0.05)"
      px={6}
      py={4}
    >
      <Flex maxW="7xl" mx="auto" align="center">
        <Heading
          fontSize="2xl"
          bgGradient="linear(to-r, cyan.400, blue.500, purple.600)"
          bgClip="text"
          fontWeight="extrabold"
        >
          AgentX
        </Heading>

        <Spacer />

        <HStack spacing={6}>
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <ChakraLink
                as={Link}
                to={item.path}
                key={item.path}
                fontWeight="medium"
                fontSize="sm"
                px={3}
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

        {/* 👤 User Section */}
        {userName && (
          <HStack spacing={4} ml={6}>
            <Text fontSize="sm" color="gray.300">
              Welcome, {userName.split(' ')[0]} 👋
            </Text>
            <Button
              size="sm"
              colorScheme="red"
              variant="outline"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </HStack>
        )}
      </Flex>
    </Box>
  );
}
