package fpt.kiennt169.springboot.mappers;

import fpt.kiennt169.springboot.dtos.users.UserRequestDTO;
import fpt.kiennt169.springboot.dtos.users.UserResponseDTO;
import fpt.kiennt169.springboot.entities.Role;
import fpt.kiennt169.springboot.entities.User;
import org.mapstruct.*;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "roles", expression = "java(mapRolesToStrings(user.getRoles()))")
    UserResponseDTO toResponseDTO(User user);
 
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "email", ignore = true)
    @Mapping(target = "username", ignore = true)
    @Mapping(target = "firstName", ignore = true)
    @Mapping(target = "lastName", ignore = true)
    @Mapping(target = "fullName", ignore = true)
    @Mapping(target = "dateOfBirth", ignore = true)
    @Mapping(target = "phoneNumber", ignore = true)
    @Mapping(target = "roles", ignore = true) 
    @Mapping(target = "submissions", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isDeleted", ignore = true)
    User toEntity(UserRequestDTO requestDTO);

    @InheritConfiguration(name = "toEntity")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDTO(UserRequestDTO requestDTO, @MappingTarget User user);

    default Set<String> mapRolesToStrings(Set<Role> roles) {
        if (roles == null) {
            return Set.of();
        }
        return roles.stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toSet());
    }
}
