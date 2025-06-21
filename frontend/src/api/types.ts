export interface MessageResponse {
    text: string;
    senderUsername: string;
    conversationId: string;
    timestamp: Date
}

export interface ConversationResponse {
    conversationId: string;
    usernameA: string;
    usernameB: string;
}
