package com.github.dervisevice.backend.model.db;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "conversations")
public class ConversationEntity {

    @Id
    private String conversationId;
    private String usernameA;
    private String usernameB;

}
