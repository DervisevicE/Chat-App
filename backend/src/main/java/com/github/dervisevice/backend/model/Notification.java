package com.github.dervisevice.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
    public enum Type {
        USER_CONNECTED,
        USER_DISCONNECTED,
        NEW_CONVERSATION,
        NEW_MESSAGE,
    }

    private Type type;
    private Map<String, Object>  data;

    public static Notification userConnected(String username) {
        return new Notification(Type.USER_CONNECTED, Map.of("username", username));
    }

    public static Notification userDisconnected(String username) {
        return new Notification(Type.USER_DISCONNECTED, Map.of("username", username));
    }

    public static Notification newConversation(String conversationId, String username) {
        return new Notification(Type.NEW_CONVERSATION, Map.of("conversationId", conversationId,  "username", username));
    }

    public static Notification newMessage(Message message) {
        return new Notification(Type.NEW_MESSAGE, Map.of("message", message));
    }

}
