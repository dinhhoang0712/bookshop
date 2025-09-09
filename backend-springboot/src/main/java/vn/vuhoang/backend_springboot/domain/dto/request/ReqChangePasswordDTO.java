package vn.vuhoang.backend_springboot.domain.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ReqChangePasswordDTO {
    @NotBlank
    private String currentPassword;

    @NotBlank
    private String newPassword;
}
