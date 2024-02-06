package org.solutioneers.tictactoe.controllers;

import org.solutioneers.tictactoe.models.Player;
import org.solutioneers.tictactoe.models.payload.PlayerPayload;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.UUID;

@RestController
@RequestMapping("/players")
public class PlayerController {

    ArrayList<Player> players = new ArrayList<>();

    @PostMapping(value = "/register", consumes = "application/json", produces = "application/json")
    public ResponseEntity<String> register(@RequestBody PlayerPayload payload) {
        for (Player player: players) {
            if (payload.nickname().equalsIgnoreCase(player.nickname())) {
                return ResponseEntity.badRequest().body("Nickname already exists");
            }
        }
        Player newPlayer = new Player(UUID.randomUUID().toString(), payload.nickname());
        players.add(newPlayer);
        return new ResponseEntity<>("Nickname already exists", HttpStatus.CREATED);
    }
}
