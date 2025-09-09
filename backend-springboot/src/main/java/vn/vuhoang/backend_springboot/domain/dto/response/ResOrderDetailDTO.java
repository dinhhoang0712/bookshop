package vn.vuhoang.backend_springboot.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResOrderDetailDTO {
    private Long id;
    private String bookName;
    private Long quantity;
    private String img;
}