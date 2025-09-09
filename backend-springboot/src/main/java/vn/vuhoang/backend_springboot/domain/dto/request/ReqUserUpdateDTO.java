package vn.vuhoang.backend_springboot.domain.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReqUserUpdateDTO {
    private String fullName;
    private String phone;
}
