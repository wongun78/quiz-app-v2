package fpt.kiennt169.springboot.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenAPIConfig {

    @Value("${api.contact.name}")
    private String contactName;
    
    @Value("${api.contact.email}")
    private String contactEmail;
    
    @Value("${api.project.url}")
    private String projectUrl;
    
    @Value("${api.server.url}")
    private String serverUrl;
    
    @Value("${api.server.description}")
    private String serverDescription;

    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "bearerAuth";
        
        return new OpenAPI()
                .info(new Info()
                        .title("Quiz Application REST API")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name(contactName)
                                .email(contactEmail))
                        .license(new License()
                                .name("Quiz Application Project")
                                .url(projectUrl)))
                .servers(List.of(
                        new Server().url(serverUrl).description(serverDescription)
                ))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("""
                                                JWT Authorization header using the Bearer scheme.
                                                
                                                **How to get token:**
                                                1. Call POST /api/v1/auth/login
                                                2. Copy 'token' from response
                                                3. Enter in format: `<your_token_here>` (no 'Bearer' prefix needed)
                                                
                                                **Token expires in:** 24 hours
                                                **Refresh token expires in:** 7 days
                                                """)));
    }
}
