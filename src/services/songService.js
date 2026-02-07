import api from '../api/axios';

const ENDPOINT = '/api/canciones/';

export const getSongs = async () => {
    const response = await api.get(ENDPOINT);
    return response.data;
};

export const createSong = async (songData) => {
    const response = await api.post(ENDPOINT, songData);
    return response.data;
};

export const updateSong = async (id, songData) => {
    const response = await api.put(`${ENDPOINT}${id}/`, songData);
    return response.data;
};

export const deleteSong = async (id) => {
    await api.delete(`${ENDPOINT}${id}/`);
    return id;
};