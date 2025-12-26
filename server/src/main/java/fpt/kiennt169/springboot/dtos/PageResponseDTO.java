package fpt.kiennt169.springboot.dtos;

import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.data.domain.Page;
import java.util.List;

@Schema(description = "Paginated response wrapper with navigation info")
public record PageResponseDTO<T>(
    
    @Schema(description = "List of items in current page")
    List<T> content,
    
    @Schema(description = "Current page number (0-indexed)", example = "0")
    int pageNumber,
    
    @Schema(description = "Number of items per page", example = "10")
    int pageSize,
    
    @Schema(description = "Total number of items across all pages", example = "100")
    long totalElements,
    
    @Schema(description = "Total number of pages", example = "10")
    int totalPages,
    
    @Schema(description = "Whether this is the first page", example = "true")
    boolean first,
    
    @Schema(description = "Whether this is the last page", example = "false")
    boolean last,
    
    @Schema(description = "Whether the page has content", example = "true")
    boolean hasContent,
    
    @Schema(description = "Whether there is a next page", example = "true")
    boolean hasNext,
    
    @Schema(description = "Whether there is a previous page", example = "false")
    boolean hasPrevious
) {
    
    /**
     * Creates a PageResponseDTO from Spring's Page object.
     */
    public static <T> PageResponseDTO<T> from(Page<T> page) {
        return new PageResponseDTO<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast(),
                page.hasContent(),
                page.hasNext(),
                page.hasPrevious()
        );
    }
}
