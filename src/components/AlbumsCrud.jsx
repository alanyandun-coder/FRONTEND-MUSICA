import React, { useState, useEffect } from 'react';
import { 
    Container, Typography, Button, Grid, Card, CardMedia, CardContent, CardActions,
    Dialog, DialogTitle, DialogContent, TextField, DialogActions, Box, IconButton,
    FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { Edit, Delete, Add, PhotoCamera, Album as AlbumIcon } from '@mui/icons-material';
import { getAlbums, createAlbum, updateAlbum, deleteAlbum } from '../services/albumService';
import { getArtists } from '../services/artistService';

const AlbumsCrud = ({ filterByArtistId, onSelectAlbum, isAuth, externalRefresh, onDataChanged }) => {
    const [albums, setAlbums] = useState([]);
    const [artists, setArtists] = useState([]);
    const [open, setOpen] = useState(false);
    const [refresh, setRefresh] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    
    const [currentAlbum, setCurrentAlbum] = useState({ 
        id: null, titulo: '', anio_lanzamiento: '', artista: '', portada: null 
    });
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const albumsData = await getAlbums();
            const artistsData = await getArtists();
            setAlbums(albumsData);
            setArtists(artistsData);
        };
        fetchData();
    }, [refresh, externalRefresh]);

    const handleOpen = (album = null) => {
        if (album) {
            setCurrentAlbum(album);
            setPreview(album.portada);
            setIsEditing(true);
        } else {
            setCurrentAlbum({ 
                titulo: '', 
                anio_lanzamiento: '', 
                artista: filterByArtistId || '', 
                portada: null 
            });
            setPreview(null);
            setIsEditing(false);
        }
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCurrentAlbum({ ...currentAlbum, portada: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    const displayedAlbums = filterByArtistId 
        ? albums.filter(album => album.artista === filterByArtistId)
        : albums;

    const handleSave = async () => {
        try {
            if (isEditing) {
                await updateAlbum(currentAlbum.id, currentAlbum);
            } else {
                await createAlbum(currentAlbum);
            }
            setRefresh(prev => prev + 1);
            if (onDataChanged) onDataChanged();
            handleClose();
        } catch (error) {
            console.error(error);
            alert("Error al guardar. Revisa los campos.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Eliminar álbum?")) {
            await deleteAlbum(id);
            setRefresh(prev => prev + 1);
            if (onDataChanged) onDataChanged();
        }
    };

    const getArtistName = (id) => {
        const artist = artists.find(a => a.id === id);
        return artist ? artist.nombre : 'Desconocido';
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#fff' }}>
                    {filterByArtistId ? '💿 Álbumes del Artista' : '💿 Todos los Álbumes'}
                </Typography>
                
                {isAuth && (
                    <Button 
                        variant="contained" 
                        startIcon={<Add />} 
                        onClick={() => handleOpen(null)}
                        sx={{ borderRadius: 5, background: 'linear-gradient(45deg, #9c27b0 30%, #ce93d8 90%)' }}
                    >
                        Nuevo Álbum
                    </Button>
                )}
            </Box>

            {displayedAlbums.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 5, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                    <AlbumIcon sx={{ fontSize: 60, color: 'gray', mb: 2, opacity: 0.5 }} />
                    <Typography variant="h6" color="gray">
                        {filterByArtistId 
                            ? "Este artista no tiene álbumes registrados aún." 
                            : "No hay álbumes disponibles en el catálogo."}
                    </Typography>
                    {isAuth && (
                        <Typography variant="body2" color="gray" sx={{ mt: 1, opacity: 0.7 }}>
                            ¡Dale al botón de "Nuevo Álbum" para agregar uno!
                        </Typography>
                    )}
                </Box>
            ) : (
                // AQUÍ TAMBIÉN APLICAMOS EL CENTRADO
                <Grid container spacing={3} justifyContent="center">
                    {displayedAlbums.map((album) => (
                        <Grid item xs={12} sm={4} md={3} lg={2} xl={2} key={album.id}>
                            <Card 
                                onClick={() => onSelectAlbum && onSelectAlbum(album)}
                                sx={{ 
                                    height: '100%', display: 'flex', flexDirection: 'column', 
                                    borderRadius: 3, bgcolor: '#1e1e1e', color: 'white',
                                    transition: '0.3s', '&:hover': { transform: 'scale(1.03)', border: '1px solid #ce93d8' }, cursor: 'pointer'
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={album.portada || "https://via.placeholder.com/200?text=No+Cover"}
                                    alt={album.titulo}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" fontWeight="bold">{album.titulo}</Typography>
                                    <Typography variant="body2" color="gray">{album.anio_lanzamiento}</Typography>
                                    <Typography variant="caption" color="secondary">
                                        {getArtistName(album.artista)}
                                    </Typography>
                                </CardContent>
                                {isAuth && (
                                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                                        <IconButton size="small" sx={{ color: '#ce93d8' }} onClick={(e) => { e.stopPropagation(); handleOpen(album); }}><Edit /></IconButton>
                                        <IconButton size="small" sx={{ color: '#f44336' }} onClick={(e) => { e.stopPropagation(); handleDelete(album.id); }}><Delete /></IconButton>
                                    </CardActions>
                                )}
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{isEditing ? 'Editar Álbum' : 'Nuevo Álbum'}</DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2} mt={1}>
                        <Box display="flex" justifyContent="center">
                            <img src={preview || "https://via.placeholder.com/150"} style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8 }} alt="Preview" />
                        </Box>
                        <Button variant="outlined" component="label" startIcon={<PhotoCamera />}>
                            Subir Portada
                            <input hidden accept="image/*" type="file" onChange={handleFileChange} />
                        </Button>
                        <TextField label="Título" fullWidth value={currentAlbum.titulo} onChange={(e) => setCurrentAlbum({...currentAlbum, titulo: e.target.value})} />
                        <TextField label="Año" type="number" fullWidth value={currentAlbum.anio_lanzamiento} onChange={(e) => setCurrentAlbum({...currentAlbum, anio_lanzamiento: e.target.value})} />
                        
                        <FormControl fullWidth>
                            <InputLabel>Artista</InputLabel>
                            <Select value={currentAlbum.artista} label="Artista" onChange={(e) => setCurrentAlbum({...currentAlbum, artista: e.target.value})}>
                                {artists.map((a) => <MenuItem key={a.id} value={a.id}>{a.nombre}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleSave} variant="contained" color="secondary">Guardar</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AlbumsCrud;