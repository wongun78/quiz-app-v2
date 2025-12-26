package fpt.kiennt169.springboot.entities;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

import fpt.kiennt169.springboot.enums.RoleEnum;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "roles")
public class Role extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true, length = 50)
    private RoleEnum name;
}
