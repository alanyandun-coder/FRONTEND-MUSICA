import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, Divider, Avatar, Chip } from '@mui/material';
import { ArrowBack, Album as AlbumIcon } from '@mui/icons-material';
import AlbumsCrud from '../components/AlbumsCrud';
import SongsCrud from '../components/SongsCrud';
import { getArtists } from '../services/artistService';

const ArtistDetail = ({ isAuth }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [artist, setArtist] = useState(null);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    
    // Estado para comunicar cambios en los albumes a las canciones
    const [albumsTrigger, setAlbumsTrigger] = useState(0);

    useEffect(() => {
        const fetchArtist = async () => {
            const allArtists = await getArtists();
            const found = allArtists.find(a => a.id === parseInt(id));
            setArtist(found);
        };
        fetchArtist();
    }, [id]);

    if (!artist) return <Typography sx={{color:'white', mt:10, textAlign:'center'}}>Cargando...</Typography>;

    return (
        <Container maxWidth="xl" sx={{ mt: 4, pb: 5 }}>
            <Button 
                startIcon={<ArrowBack />} 
                onClick={() => navigate('/')} 
                sx={{ mb: 2, color: 'white', borderColor: 'white' }} 
                variant="outlined"
            >
                Volver
            </Button>

            <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' }, 
                alignItems: 'center', 
                gap: 4, 
                mb: 6, 
                bgcolor: '#1e1e1e', 
                p: 4, 
                borderRadius: 4,
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}>
                <Avatar 
                    src={artist.imagen} 
                    alt={artist.nombre}
                    sx={{ width: 200, height: 200, border: '4px solid #ce93d8' }} 
                />
                <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                    <Typography variant="h2" fontWeight="bold" color="white">{artist.nombre}</Typography>
                    <Typography variant="h5" color="gray" sx={{ mt: 1 }}>{artist.genero} • {artist.pais}</Typography>
                </Box>
            </Box>

            <Typography variant="h4" color="white" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
                Albumes
            </Typography>
            <Typography variant="body2" color="gray" sx={{ mb: 2 }}>
                Haz clic en un album para filtrar las canciones de abajo.
            </Typography>

            <AlbumsCrud 
                isAuth={isAuth} 
                filterByArtistId={artist.id}
                onSelectAlbum={(album) => setSelectedAlbum(album)} 
                // Cuando cambia un album, actualizamos el trigger
                onDataChanged={() => setAlbumsTrigger(prev => prev + 1)}
            />

            <Divider sx={{ my: 6, bgcolor: '#333' }} />

            <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Typography variant="h4" color="white" fontWeight="bold">
                    Canciones
                </Typography>
                
                {selectedAlbum && (
                    <Chip 
                        icon={<AlbumIcon />}
                        label={`Filtrado por: ${selectedAlbum.titulo}`} 
                        onDelete={() => setSelectedAlbum(null)}
                        color="secondary"
                        variant="outlined"
                        sx={{ color: 'white', borderColor: '#ce93d8' }}
                    />
                )}
            </Box>

            <SongsCrud 
                isAuth={isAuth} 
                filterByArtistId={artist.id}
                filterByAlbumId={selectedAlbum?.id} 
                externalRefresh={albumsTrigger}
            />
        </Container>
    );
};

export default ArtistDetail;