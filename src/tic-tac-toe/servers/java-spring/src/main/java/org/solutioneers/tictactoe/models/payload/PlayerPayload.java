package org.solutioneers.tictactoe.models.payload;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.lang.NonNull;

public record PlayerPayload(@JsonProperty("nickname") @NonNull String nickname) {
}
