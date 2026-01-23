package fpt.kiennt169.springboot.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefreshToken implements Serializable {
    
    private static final long serialVersionUID = 1L;

    private String token;

    private UUID userId;

    private String email;

    private Set<String> roles;

    private Instant createdAt;

    private Instant expiresAt;

    public boolean isExpired() {
        return Instant.now().isAfter(expiresAt);
    }

    public long getRemainingSeconds() {
        if (isExpired()) {
            return 0;
        }
        return expiresAt.getEpochSecond() - Instant.now().getEpochSecond();
    }
}
