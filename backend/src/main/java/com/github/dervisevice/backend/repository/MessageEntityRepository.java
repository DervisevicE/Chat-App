package com.github.dervisevice.backend.repository;

import com.github.dervisevice.backend.model.db.MessageEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageEntityRepository extends JpaRepository<MessageEntity, Long> {

    Page<MessageEntity> findAllByConversationId(String conversationId, Pageable pageable);

}
