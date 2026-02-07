import React, { useState, useEffect } from 'react';
import { 
    Container, Typography, Button, Grid, Card, CardMedia, CardContent, CardActions,
    Dialog, DialogTitle, DialogContent, TextField, DialogActions, Box, IconButton 
} from '@mui/material';
import { Edit, Delete, Add, PhotoCamera } from '@mui/icons-material';
import { getArtists, createArtist, updateArtist, deleteArtist } from '../services/artistService';
// 1. IMPORTAMOS EL HOOK DE NAVEGACIÓN
import { useNavigate } from 'react-router-dom';

const ArtistsCrud = ({ isAuth, onDataChanged }) => {
    const navigate = useNavigate(); // 2. INICIALIZAMOS
    const [artists, setArtists] = useState([]);
    const [open, setOpen] = useState(false);
    const [refresh, setRefresh] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    
    const [currentArtist, setCurrentArtist] = useState({ 
        id: null, nombre: '', genero: '', pais: '', imagen: null 
    });
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        const fetchArtists = async () => {
            const data = await getArtists();
            setArtists(data);
        };
        fetchArtists();
    }, [refresh]);

    const handleOpen = (artist = null) => {
        if (artist) {
            setCurrentArtist(artist);
            setPreview(artist.imagen);
            setIsEditing(true);
        } else {
            setCurrentArtist({ nombre: '', genero: '', pais: '', imagen: null });
            setPreview(null);
            setIsEditing(false);
        }
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCurrentArtist({ ...currentArtist, imagen: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        try {
            if (isEditing) {
                await updateArtist(currentArtist.id, currentArtist);
            } else {
                await createArtist(currentArtist);
            }
            setRefresh(prev => prev + 1);
            if (onDataChanged) onDataChanged();
            handleClose();
        } catch (error) {
            console.error(error);
            alert("Error al guardar");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Eliminar artista?")) {
            await deleteArtist(id);
            setRefresh(prev => prev + 1);
            if (onDataChanged) onDataChanged();
        }
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#fff' }}>
                    🎤 Artistas
                </Typography>
                {isAuth && (
                    <Button 
                        variant="contained" 
                        startIcon={<Add />} 
                        onClick={() => handleOpen(null)}
                        sx={{ borderRadius: 5, textTransform: 'none', fontSize: '1rem', background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)' }}
                    >
                        Nuevo Artista
                    </Button>
                )}
            </Box>

            <Grid container spacing={3} justifyContent="center">
                {artists.map((artist) => (
                    <Grid item xs={12} sm={4} md={3} lg={2} xl={2} key={artist.id}>
                        <Card 
                            // 3. AQUÍ ESTÁ LA MAGIA: NAVEGAMOS AL DETALLE
                            onClick={() => navigate(`/artist/${artist.id}`)}
                            sx={{ 
                                height: '100%', display: 'flex', flexDirection: 'column',
                                borderRadius: 4, transition: '0.3s', cursor: 'pointer',
                                '&:hover': { transform: 'scale(1.03)', boxShadow: '0 8px 40px -12px rgba(255,255,255,0.2)' },
                                border: '1px solid #333'
                            }}
                        >
                            <CardMedia
                                component="img"
                                height="250"
                                image={artist.imagen || "https://via.placeholder.com/300x250?text=Sin+Imagen"}
                                alt={artist.nombre}
                                sx={{ objectFit: 'cover' }}
                            />
                            <CardContent sx={{ flexGrow: 1, bgcolor: '#1e1e1e', color: 'white' }}>
                                <Typography gutterBottom variant="h5" component="h2" fontWeight="bold">{artist.nombre}</Typography>
                                <Typography variant="body2" color="gray">{artist.genero}</Typography>
                            </CardContent>
                            
                            {isAuth && (
                                <CardActions sx={{ bgcolor: '#1e1e1e', justifyContent: 'flex-end', p: 2 }}>
                                    {/* STOP PROPAGATION EVITA QUE SE ABRA LA PÁGINA AL QUERER EDITAR */}
                                    <IconButton size="small" sx={{ color: '#4dabf5' }} onClick={(e) => { e.stopPropagation(); handleOpen(artist); }}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton size="small" sx={{ color: '#f44336' }} onClick={(e) => { e.stopPropagation(); handleDelete(artist.id); }}>
                                        <Delete />
                                    </IconButton>
                                </CardActions>
                            )}
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* MODAL */}
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{isEditing ? 'Editar Artista' : 'Nuevo Artista'}</DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2} mt={1}>
                        <Box display="flex" justifyContent="center" mb={2}>
                            <img src={preview || "https://via.placeholder.com/150"} alt="Vista previa" style={{ width: 150, height: 150, objectFit: 'cover', borderRadius: '50%' }} />
                        </Box>
                        <Button variant="outlined" component="label" startIcon={<PhotoCamera />}>
                            Subir Foto
                            <input hidden accept="image/*" type="file" onChange={handleFileChange} />
                        </Button>
                        <TextField label="Nombre" fullWidth value={currentArtist.nombre} onChange={(e) => setCurrentArtist({ ...currentArtist, nombre: e.target.value })} />
                        <TextField label="Género" fullWidth value={currentArtist.genero} onChange={(e) => setCurrentArtist({ ...currentArtist, genero: e.target.value })} />
                        <TextField label="País" fullWidth value={currentArtist.pais} onChange={(e) => setCurrentArtist({ ...currentArtist, pais: e.target.value })} />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleSave} variant="contained">Guardar</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ArtistsCrud;