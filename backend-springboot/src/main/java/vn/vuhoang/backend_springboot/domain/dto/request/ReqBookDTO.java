package vn.vuhoang.backend_springboot.domain.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class ReqBookDTO {
    private String thumbnail;
    private List<String> slider;
    private String mainTest;
    private String author;
    private Double price;
    private Integer quantity;
    private String category;
}
