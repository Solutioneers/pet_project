package org.solutioneers.tictactoe.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/players")
public class PlayerController {

    @GetMapping("/get")
    public String test() {
        return "PlayerController";
    }
}
