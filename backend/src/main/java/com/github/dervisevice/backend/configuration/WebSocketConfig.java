package com.github.dervisevice.backend.configuration;

import com.github.dervisevice.backend.model.Notification;
import com.github.dervisevice.backend.model.db.UserEntity;
import com.github.dervisevice.backend.repository.UserEntityRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.core.AbstractMessageSendingTemplate;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final UserEntityRepository userEntityRepository;

    private final Map<String, String> sessionUsernameMap = new HashMap<>();

    @Lazy
    @Autowired
    private AbstractMessageSendingTemplate messageSendingTemplate;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/chat").setAllowedOrigins("http://localhost:5173");
        registry.addEndpoint("/chat").setAllowedOrigins("http://localhost:5173").withSockJS();
    }


    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = accessor.getSessionId();
        String username = accessor.getNativeHeader("username") != null ?
                accessor.getNativeHeader("username").get(0) : null;

        if (username != null) {
            sessionUsernameMap.put(sessionId, username);
            var userEntity = new UserEntity();
            userEntity.setUsername(username);
            userEntityRepository.save(userEntity);
            sendUserConnectedNotification(username);
            getActiveUsers();
        }
    }


    @EventListener
    @Transactional
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        String sessionId = StompHeaderAccessor.wrap(event.getMessage()).getSessionId();
        String username = sessionUsernameMap.get(sessionId);

        if (username != null) {
            userEntityRepository.deleteByUsername(username);
            sessionUsernameMap.remove(sessionId);
            getActiveUsers();
            sendUserDisconnectedNotification(username);
            System.out.println("Disconnected via event: " + username);
        }
    }

    public void sendUserConnectedNotification(String username) {
        messageSendingTemplate.convertAndSend("/topic/notifications", Notification.userConnected(username));
    }

    public void sendUserDisconnectedNotification(String username) {
        messageSendingTemplate.convertAndSend("/topic/notifications", Notification.userDisconnected(username));
    }

    private void getActiveUsers() {
        var users = userEntityRepository.findAll().stream()
                .map(user -> Map.of("username", user.getUsername()))
                .collect(Collectors.toList());

        messageSendingTemplate.convertAndSend("/topic/active-users", users);
    }

}
