import axios from '../axios';
import type {ConversationResponse} from "../types.ts";

export const openConversation = (data: Record<string, string>) => {
    return axios.post<ConversationResponse>("/api/messages", data);
}