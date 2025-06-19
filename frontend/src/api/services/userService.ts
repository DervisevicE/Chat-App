import axios from '../axios';

export const getGeneratedUsername = () => {
    return axios.get<string>("/api/user/username");
}