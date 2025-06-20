package com.github.dervisevice.backend.api;

import com.github.dervisevice.backend.model.User;
import com.github.dervisevice.backend.repository.UserEntityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserEntityRepository userEntityRepository;

    @GetMapping
    public ResponseEntity<?> getActiveUsers() {
        var users = userEntityRepository.findAll()
                .stream()
                .map(userEntity -> new User(userEntity.getUsername()))
                .toList();

        return ResponseEntity.ok(users);
    }

    @GetMapping("/username")
    public ResponseEntity<?> generateUsername() {
        var adjectives = List.of("Quick", "Brave", "Silly", "Witty", "Pretty", "Cute");
        var animals = List.of("Panda", "Tiger", "Mouse", "Otter", "Koala", "Cat", "Bird");

        var adj = adjectives.get((int) Math.floor(Math.random() * adjectives.size()));
        var animal = animals.get((int) Math.floor(Math.random() * animals.size()));
        var number = Math.floor(Math.random() * 1000);
        var username = "%s%s%.0f".formatted(adj, animal, number);
        return ResponseEntity.ok(username);

    }

}
