import api from '../api/axios';

const ENDPOINT = '/api/artistas/';

// GET
export const getArtists = async () => {
    const response = await api.get(ENDPOINT);
    return response.data;
};

// POST
export const createArtist = async (artistData) => {
    const formData = new FormData();
    formData.append('nombre', artistData.nombre);
    formData.append('genero', artistData.genero);
    formData.append('pais', artistData.pais);
    
    // Solo adjuntamos si existe imagen
    if (artistData.imagen) {
        formData.append('imagen', artistData.imagen); 
    }

    const response = await api.post(ENDPOINT, formData, {
        headers: {
            'Content-Type': 'multipart/form-data', 
        },
    });
    return response.data;
};

// PUT
export const updateArtist = async (id, artistData) => {
    const formData = new FormData();
    formData.append('nombre', artistData.nombre);
    formData.append('genero', artistData.genero);
    formData.append('pais', artistData.pais);
    
    if (artistData.imagen instanceof File) {
        formData.append('imagen', artistData.imagen);
    }

    const response = await api.put(`${ENDPOINT}${id}/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};  

// DELETE
export const deleteArtist = async (id) => {
    await api.delete(`${ENDPOINT}${id}/`);
    return id;
};