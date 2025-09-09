package vn.vuhoang.backend_springboot.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class ResBookDTO {
    private Long id;
    private String thumbnail;
    private List<String> slider;
    private String mainTest;
    private String author;
    private Double price;
    private Integer sold;
    private Integer quantity;
    private String category;
    private Instant createdAt;
    private Instant updatedAt;
}
