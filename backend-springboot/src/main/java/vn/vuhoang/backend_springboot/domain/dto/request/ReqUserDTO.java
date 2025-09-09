package vn.vuhoang.backend_springboot.domain.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ReqUserDTO {
    @NotBlank(message = "Tên không được để trống")
    private String fullName;

    @NotBlank(message = "Mật khẩu không được bỏ trống")
    private String password;

    @NotBlank(message = "Email không được bỏ trống")
    @Email(regexp = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$", message = "Email không hợp lệ")
    private String email;
    private String phone;
}
