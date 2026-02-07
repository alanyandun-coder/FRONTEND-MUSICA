import React, { useState } from 'react';
// 1. IMPORTAMOS LOS COMPONENTES DE RUTA
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, AppBar, Toolbar, Box, Dialog, DialogContent } from '@mui/material';
import { Login as LoginIcon, Logout as LogoutIcon, Home, Album, MusicNote } from '@mui/icons-material';
import Login from './pages/Login';
import ArtistDetail from './pages/ArtistDetail'; 
import ArtistsCrud from './components/ArtistsCrud';
import AlbumsCrud from './components/AlbumsCrud';
import SongsCrud from './components/SongsCrud';
import { getCurrentUser, logout } from './services/authService'; 

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getCurrentUser());
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    navigate('/'); // Al salir, volvemos al inicio
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', bgcolor: '#121212', overflowX: 'hidden' }}>
      
      {/* --- BARRA DE NAVEGACIÓN (NAVBAR) --- */}
      <AppBar position="sticky" sx={{ bgcolor: '#000', borderBottom: '1px solid #333', zIndex: 1201 }}>
        <Toolbar>
          <Typography 
            variant="h6" 
            component={Link} 
            to="/" 
            sx={{ flexGrow: 1, fontWeight: 'bold', color: 'white', textDecoration: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 1 }}
          >
            🎧 Gestor de Música
          </Typography>

          {/* BOTONES DEL MENÚ */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, mr: 3 }}>
            <Button color="inherit" component={Link} to="/" startIcon={<Home />}>Inicio</Button>
            <Button color="inherit" component={Link} to="/albums" startIcon={<Album />}>Álbumes</Button>
            <Button color="inherit" component={Link} to="/songs" startIcon={<MusicNote />}>Canciones</Button>
          </Box>
          
          {isAuthenticated ? (
            <Button color="error" variant="outlined" onClick={handleLogout} startIcon={<LogoutIcon />}>Salir</Button>
          ) : (
            <Button color="success" variant="contained" onClick={() => setShowLoginModal(true)} startIcon={<LoginIcon />}>Entrar</Button>
          )}
        </Toolbar>
      </AppBar>

      {/* MODAL LOGIN */}
      <Dialog open={showLoginModal} onClose={() => setShowLoginModal(false)}>
        <DialogContent><Login onLoginSuccess={handleLoginSuccess} /></DialogContent>
      </Dialog>

      {/* --- RUTAS (Aquí cambia el contenido según el link) --- */}
      <Box sx={{ flexGrow: 1 }}>
        <Routes>
          
          {/* RUTA 1: INICIO (Muestra Artistas) */}
          <Route path="/" element={
            <Container maxWidth="xl" sx={{ mt: 4, pb: 5, textAlign: 'center' }}>
                <Box sx={{ mb: 6, p: 4, background: 'linear-gradient(180deg, rgba(29,185,84,0.3) 0%, rgba(18,18,18,0) 100%)', borderRadius: 4 }}>
                    <Typography variant="h2" fontWeight="bold" color="white">Tu Biblioteca</Typography>
                    <Typography variant="h6" color="gray">Explora tus artistas favoritos</Typography>
                </Box>
                <ArtistsCrud isAuth={isAuthenticated} />
            </Container>
          } />

          {/* RUTA 2: DETALLE DE ARTISTA */}
          <Route path="/artist/:id" element={<ArtistDetail isAuth={isAuthenticated} />} />

          {/* RUTA 3: ÁLBUMES */}
          <Route path="/albums" element={
             <Container maxWidth="xl" sx={{ mt: 4, pb: 5 }}>
                <Typography variant="h3" fontWeight="bold" color="white" mb={4} textAlign="center">Todos los Álbumes</Typography>
                <AlbumsCrud isAuth={isAuthenticated} />
             </Container>
          } />

          {/* RUTA 4: CANCIONES */}
          <Route path="/songs" element={
             <Container maxWidth="xl" sx={{ mt: 4, pb: 5 }}>
                <Typography variant="h3" fontWeight="bold" color="white" mb={4} textAlign="center">Todas las Canciones</Typography>
                <SongsCrud isAuth={isAuthenticated} />
             </Container>
          } />
        </Routes>
      </Box>

    </Box>
  );
}

export default App;