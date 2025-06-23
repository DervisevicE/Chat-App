package com.github.dervisevice.backend.api;

import com.github.dervisevice.backend.model.ConversationRequest;
import com.github.dervisevice.backend.model.Message;
import com.github.dervisevice.backend.model.Notification;
import com.github.dervisevice.backend.model.OutputMessage;
import com.github.dervisevice.backend.model.db.ConversationEntity;
import com.github.dervisevice.backend.model.db.MessageEntity;
import com.github.dervisevice.backend.repository.ConversationEntityRepository;
import com.github.dervisevice.backend.repository.MessageEntityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.core.AbstractMessageSendingTemplate;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@Slf4j
public class MessageController {

    private final MessageEntityRepository messageEntityRepository;
    private final ConversationEntityRepository conversationEntityRepository;
    private final AbstractMessageSendingTemplate messageSendingTemplate;

    @MessageMapping("/chat")
    public OutputMessage send(Message message) {
        var timestamp = new Date();
        var time = new SimpleDateFormat("HH:mm").format(timestamp);
        var conversationId = message.getConversationId();
        var messageEntity = new MessageEntity();
        messageEntity.setText(message.getText());
        messageEntity.setSenderUsername(message.getSenderUsername());
        messageEntity.setConversationId(conversationId);
        messageEntity.setTimestamp(new java.util.Date());
        messageEntityRepository.save(messageEntity);

        var outputMessage = new OutputMessage(
                message.getText(),
                message.getSenderUsername(),
                time,
                conversationId
        );


        var notification = Notification.newMessage(outputMessage);
        if (conversationId != null && conversationId.equals("global")) {
            messageSendingTemplate.convertAndSend("/topic/notifications", notification);
        }

        conversationEntityRepository.findByConversationId(conversationId)
                .ifPresent((ConversationEntity p) -> {
                    messageSendingTemplate.convertAndSend("/topic/notifications/" + p.getUsernameA(), notification);
                    messageSendingTemplate.convertAndSend("/topic/notifications/" + p.getUsernameB(), notification);
                });


        return new OutputMessage(message.getText(), message.getSenderUsername(), time, conversationId);
    }


    @GetMapping("/api/messages/{conversationId}")
    public ResponseEntity<?> getMessages(@PathVariable("conversationId") String conversationId,
                                         @RequestParam(defaultValue = "0") int page,
                                         @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());
        var messages = messageEntityRepository.findAllByConversationId(conversationId, pageable);
        var response = messages.stream().map((m) -> {
            var output = new OutputMessage();
            output.setText(m.getText());
            output.setSenderUsername(m.getSenderUsername());
            output.setConversationId(m.getConversationId());
            String time = new SimpleDateFormat("HH:mm").format(m.getTimestamp());
            output.setTimestamp(time);
            return output;
        }).toList();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/api/messages")
    public ResponseEntity<?> conversation(@RequestBody ConversationRequest conversationRequest) {
        var conversationOptional = conversationEntityRepository.findByUsernameAAndUsernameB(conversationRequest.getUsernamesA(), conversationRequest.getUsernamesB());
        if (conversationOptional.isEmpty()) {
            conversationOptional = conversationEntityRepository.findByUsernameAAndUsernameB(conversationRequest.getUsernamesB(), conversationRequest.getUsernamesA());
        }

        if (conversationOptional.isEmpty()) {
            var conversationId = UUID.randomUUID().toString();
            var conversationEntity = conversationEntityRepository.save(
                    ConversationEntity.builder()
                            .conversationId(conversationId)
                            .usernameA(conversationRequest.getUsernamesA())
                            .usernameB(conversationRequest.getUsernamesB())
                            .build());
            messageSendingTemplate.convertAndSend("/topic/notifications/" + conversationEntity.getUsernameB(), Notification.newConversation(conversationId, conversationEntity.getUsernameA()));
            messageSendingTemplate.convertAndSend("/topic/notifications/" + conversationEntity.getUsernameA(), Notification.newConversation(conversationId, conversationEntity.getUsernameB()));
            return ResponseEntity.ok(conversationEntity);
        }

        return ResponseEntity.ok(conversationOptional.get());
    }


}
