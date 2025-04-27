// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box, Container } from '@chakra-ui/react';

import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Chat from './pages/Chat';
import Focus from './pages/Focus';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './pages/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Box minH="100vh" w="100%" overflowX="hidden" bgGradient="linear(to-b, gray.900, black)" color="white">
        <Navbar />
        <Container maxW="6xl" pt={20} pb={10}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes below */}
            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/focus" element={<ProtectedRoute><Focus /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          </Routes>
        </Container>
      </Box>
    </BrowserRouter>
  );
}
