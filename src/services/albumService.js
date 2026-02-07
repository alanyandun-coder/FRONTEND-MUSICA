import api from '../api/axios';

const ENDPOINT = '/api/albumes/';

// GET
export const getAlbums = async () => {
    const response = await api.get(ENDPOINT);
    return response.data;
};

// POST (Crear con portada)
export const createAlbum = async (albumData) => {
    const formData = new FormData();
    formData.append('titulo', albumData.titulo);
    formData.append('anio_lanzamiento', albumData.anio_lanzamiento);
    formData.append('artista', albumData.artista); // ID del artista
    
    if (albumData.portada) {
        formData.append('portada', albumData.portada);
    }

    const response = await api.post(ENDPOINT, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

// PUT (Editar)
export const updateAlbum = async (id, albumData) => {
    const formData = new FormData();
    formData.append('titulo', albumData.titulo);
    formData.append('anio_lanzamiento', albumData.anio_lanzamiento);
    formData.append('artista', albumData.artista);

    // Solo enviamos la imagen si es un archivo nuevo
    if (albumData.portada instanceof File) {
        formData.append('portada', albumData.portada);
    }

    const response = await api.put(`${ENDPOINT}${id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

// DELETE
export const deleteAlbum = async (id) => {
    await api.delete(`${ENDPOINT}${id}/`);
    return id;
};