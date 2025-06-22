import axios from '../axios';
import type {MessageResponse} from "../types.ts";

export const getMessages = (conversationId: string, page: number, size: number = 10) => {
    return axios.get<MessageResponse[]>(`/api/messages/${conversationId}?page=${page}&size=${size}`);
}
