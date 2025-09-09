package vn.vuhoang.backend_springboot.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import vn.vuhoang.backend_springboot.constant.RoleEnum;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class ResLoginDTO {
    private String accessToken;
    private UserDTO user;

    @Getter
    @Setter
    @AllArgsConstructor
    @Builder
    public static class UserDTO {
        private Long id;
        private String email;
        private String phone;
        private String fullName;
        private RoleEnum role;
        private String avatar;
    }
}
