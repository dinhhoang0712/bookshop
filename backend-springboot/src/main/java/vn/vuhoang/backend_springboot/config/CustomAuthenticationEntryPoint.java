package vn.vuhoang.backend_springboot.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import vn.vuhoang.backend_springboot.domain.dto.response.RestResponse;

import java.io.IOException;

//Xử lý lỗi khi không có token hoặc token không hợp lệ và trả về mã lỗi 401
@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper mapper;

    public CustomAuthenticationEntryPoint(ObjectMapper objectMapper) {
        this.mapper = objectMapper;
    }

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException authException) throws IOException, ServletException {
        // Không gọi delegate.commence, tự thiết lập response
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType("application/json;charset=UTF-8");

        RestResponse<Object> res = new RestResponse<>();
        res.setStatusCode(HttpStatus.UNAUTHORIZED.value());

        String errorMessage;
        // Kiểm tra xem có phải là lỗi JWT không
        if (authException.getCause() instanceof JwtException) {
            errorMessage = "JWT không hợp lệ: " + authException.getCause().getMessage();
        } else if (authException.getCause() != null) {
            errorMessage = authException.getCause().getMessage();
        } else {
            errorMessage = authException.getMessage();
        }

        res.setError(errorMessage);
        res.setMessage("Token không hợp lệ (hết hạn, không đúng định dạng, hoặc không truyền JWT ở header)...");

        mapper.writeValue(response.getWriter(), res);
    }
}
