import axios from '../axios';
import type {MessageResponse} from "../types.ts";

export const getMessages = (coversationId: string) => {
    return axios.get<MessageResponse[]>("/api/messages/" + coversationId);
}