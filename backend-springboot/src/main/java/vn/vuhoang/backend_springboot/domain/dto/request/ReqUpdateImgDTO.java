package vn.vuhoang.backend_springboot.domain.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ReqUpdateImgDTO {
    private Long id;
    private String img;
    private String fullName;
    private String phone;
}
