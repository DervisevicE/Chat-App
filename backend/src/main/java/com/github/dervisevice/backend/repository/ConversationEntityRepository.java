package com.github.dervisevice.backend.repository;

import com.github.dervisevice.backend.model.db.ConversationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ConversationEntityRepository extends JpaRepository<ConversationEntity, Long> {

    Optional<ConversationEntity> findByConversationId(String conversationId);
    Optional<ConversationEntity> findByUsernameAAndUsernameB(String usernamesA, String usernamesB);

}
