import React, { useState, useEffect } from 'react';
import { 
    Container, Typography, Button, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Paper, IconButton, 
    Dialog, DialogTitle, DialogContent, TextField, DialogActions,
    MenuItem, Select, InputLabel, FormControl, Box, Avatar
} from '@mui/material';
import { Edit, Delete, MusicNote } from '@mui/icons-material';
import { getSongs, createSong, updateSong, deleteSong } from '../services/songService';
import { getAlbums } from '../services/albumService';

const SongsCrud = ({ filterByAlbumId, filterByArtistId, isAuth, externalRefresh }) => {
    const [songs, setSongs] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentSong, setCurrentSong] = useState({ titulo: '', duracion: '', album: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const songsData = await getSongs();
                const albumsData = await getAlbums();
                setSongs(songsData);
                setAlbums(albumsData);
            } catch (error) {
                console.error("Error cargando datos:", error);
            }
        };
        fetchData();
    }, [refresh, externalRefresh]);

    const handleOpen = (song = null) => {
        if (song) {
            setCurrentSong(song);
            setIsEditing(true);
        } else {
            setCurrentSong({ 
                titulo: '', 
                duracion: '', 
                album: filterByAlbumId || '' 
            });
            setIsEditing(false);
        }
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleSave = async () => {
        try {
            if (isEditing) {
                await updateSong(currentSong.id, currentSong);
            } else {
                await createSong(currentSong);
            }
            setRefresh(prev => prev + 1);
            handleClose();
        } catch (error) {
            console.error("Error:", error);
            alert("Error al guardar");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Borrar cancion?")) {
            await deleteSong(id);
            setRefresh(prev => prev + 1);
        }
    };

    const getAlbumInfo = (albumId) => {
        return albums.find(a => a.id === albumId) || {};
    };

    const displayedSongs = songs.filter(song => {
        if (filterByAlbumId) {
            return song.album === filterByAlbumId;
        }
        if (filterByArtistId) {
            const albumDeLaCancion = albums.find(a => a.id === song.album);
            return albumDeLaCancion && albumDeLaCancion.artista === filterByArtistId;
        }
        return true;
    });

    // Filtramos la lista de albumes para el dropdown si estamos en la vista de un artista especifico
    const albumsForDropdown = filterByArtistId 
        ? albums.filter(a => a.artista === filterByArtistId)
        : albums;

    return (
        <Container sx={{ mt: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#fff' }}>
                    {filterByAlbumId ? 'Canciones del Album' : 
                     filterByArtistId ? 'Canciones del Artista' : 'Todas las Canciones'}
                </Typography>
                
                {isAuth && (
                    <Button 
                        startIcon={<MusicNote />} 
                        variant="contained" 
                        color="success" 
                        onClick={() => handleOpen(null)}
                        sx={{ borderRadius: 5, background: 'linear-gradient(45deg, #66bb6a 30%, #43a047 90%)' }}
                    >
                        Nueva Cancion
                    </Button>
                )}
            </Box>

            <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2, bgcolor: '#1e1e1e' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#333' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'gray' }}>Portada</TableCell>
                            <TableCell sx={{ color: 'white' }}>Titulo</TableCell>
                            <TableCell sx={{ color: 'white' }}>Duracion</TableCell>
                            <TableCell sx={{ color: 'white' }}>Album</TableCell>
                            {isAuth && <TableCell align="right" sx={{ color: 'white' }}>Acciones</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayedSongs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={isAuth ? 5 : 4} align="center" sx={{ color: 'gray', py: 3 }}>
                                    No hay canciones disponibles.
                                </TableCell>
                            </TableRow>
                        ) : (
                            displayedSongs.map((song) => {
                                const album = getAlbumInfo(song.album);
                                return (
                                    <TableRow key={song.id} hover sx={{ '&:hover': { bgcolor: '#2c2c2c' } }}>
                                        <TableCell>
                                            <Avatar 
                                                variant="rounded" 
                                                src={album.portada} 
                                                alt={album.titulo}
                                                sx={{ width: 50, height: 50, bgcolor: '#444' }}
                                            >
                                                <MusicNote />
                                            </Avatar>
                                        </TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>{song.titulo}</TableCell>
                                        <TableCell sx={{ color: '#ccc' }}>{song.duracion}</TableCell>
                                        <TableCell sx={{ color: '#ccc' }}>{album.titulo || 'Desconocido'}</TableCell>
                                        
                                        {isAuth && (
                                            <TableCell align="right">
                                                <IconButton size="small" color="primary" onClick={() => handleOpen(song)}><Edit /></IconButton>
                                                <IconButton size="small" color="error" onClick={() => handleDelete(song.id)}><Delete /></IconButton>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{isEditing ? 'Editar Cancion' : 'Nueva Cancion'}</DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2} mt={1} minWidth="300px">
                        <TextField autoFocus label="Titulo" fullWidth 
                            value={currentSong.titulo} onChange={(e) => setCurrentSong({ ...currentSong, titulo: e.target.value })} 
                        />
                        <TextField label="Duracion (ej: 3:45)" fullWidth 
                            value={currentSong.duracion} onChange={(e) => setCurrentSong({ ...currentSong, duracion: e.target.value })} 
                        />
                        <FormControl fullWidth>
                            <InputLabel>Album</InputLabel>
                            <Select
                                value={currentSong.album}
                                label="Album"
                                onChange={(e) => setCurrentSong({ ...currentSong, album: e.target.value })}
                            >
                                {albumsForDropdown.map((a) => <MenuItem key={a.id} value={a.id}>{a.titulo}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleSave} variant="contained" color="success">Guardar</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default SongsCrud;