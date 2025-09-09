package vn.vuhoang.backend_springboot.domain.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import vn.vuhoang.backend_springboot.constant.RoleEnum;

import java.time.Instant;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResUserDTO {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String avatar;
    private RoleEnum role;
    private boolean isActive;
    private Instant createdAt;
    private Instant updatedAt;
}
