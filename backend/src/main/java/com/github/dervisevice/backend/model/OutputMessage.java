package com.github.dervisevice.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OutputMessage extends Message {
    private String timestamp;

    public OutputMessage(String text, String senderUsername, String time) {
        this.setText(text);
        this.setSenderUsername(senderUsername);
        this.setTimestamp(time);
    }
}
