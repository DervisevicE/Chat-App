package com.github.dervisevice.backend.repository;

import com.github.dervisevice.backend.model.db.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserEntityRepository extends JpaRepository<UserEntity, Long> {
    void deleteByUsername(String username);
}
