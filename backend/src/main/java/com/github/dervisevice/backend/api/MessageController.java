package com.github.dervisevice.backend.api;

import com.github.dervisevice.backend.model.Message;
import com.github.dervisevice.backend.model.OutputMessage;
import com.github.dervisevice.backend.model.db.MessageEntity;
import com.github.dervisevice.backend.repository.MessageEntityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.text.SimpleDateFormat;
import java.util.Date;

@RestController
@RequiredArgsConstructor
public class MessageController {

    private final MessageEntityRepository messageEntityRepository;

    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    public OutputMessage send(Message message) throws Exception {
        var timestamp = new Date();
        String time = new SimpleDateFormat("HH:mm").format(timestamp);
        var messageEntity = new MessageEntity();
        messageEntity.setText(message.getText());
        messageEntity.setSenderUsername(message.getSenderUsername());
        messageEntity.setConversationId(message.getConversationId());
        messageEntity.setTimestamp(new java.sql.Date(timestamp.getTime()));
        messageEntityRepository.save(messageEntity);
        return new OutputMessage(message.getText(), message.getSenderUsername(), time, message.getConversationId());
    }


    @GetMapping("/api/messages/{conversationId}")
    public ResponseEntity<?> getMessages(@PathVariable("conversationId") String conversationId) {
        var messages = messageEntityRepository.findAllByConversationId(conversationId);
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


}
