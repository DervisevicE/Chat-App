package com.github.dervisevice.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConversationRequest {

    private String usernamesA;
    private String usernamesB;

}
