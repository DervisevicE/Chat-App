import axios from '../axios';

export const getGeneratedUsername = () => {
    return axios.get<string>("/api/user/username");
}

export const getActiveUsers = () => {
    return axios.get("/api/user")
}