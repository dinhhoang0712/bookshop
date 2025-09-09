package vn.vuhoang.backend_springboot.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import vn.vuhoang.backend_springboot.domain.dto.response.ResLoginDTO;
import vn.vuhoang.backend_springboot.domain.entity.User;
import vn.vuhoang.backend_springboot.mapper.LoginMapper;
import vn.vuhoang.backend_springboot.service.JwtService;
import vn.vuhoang.backend_springboot.service.UserService;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    @Value("${vuhoang.jwt.refresh-token-validity-in-seconds}")
    private long refreshTokenValidityInSeconds;
    private final JwtService jwtService;
    private final UserService userService;
    private final LoginMapper loginMapper;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        // Lấy hoặc tạo user từ email
        User user = userService.getUserByEmail(email);

        ResLoginDTO.UserDTO userDTO = loginMapper.toUserDTO(user);

        String accessToken = jwtService.createAccessToken(email, userDTO);
        String refreshToken = jwtService.createRefreshToken(email, userDTO);

        // Tạo cookie
        ResponseCookie refreshCookie = ResponseCookie
                .from("refreshToken", refreshToken)
                .httpOnly(false)
                .secure(false)
                .path("/")
                .maxAge(refreshTokenValidityInSeconds)
                .sameSite("Lax")
                .build();

        // Gửi cookie và redirect kèm accessToken về frontend
        response.setHeader("Set-Cookie", refreshCookie.toString());

        // Encode data to URL-safe format
        String encodedAccessToken = java.net.URLEncoder.encode(accessToken, "UTF-8");
        String encodedUserData = java.net.URLEncoder.encode(
                new ObjectMapper().writeValueAsString(userDTO), "UTF-8");

        // Redirect with data in query parameters
        response.sendRedirect(String.format(
                "http://localhost:3000/oauth2-success?accessToken=%s&user=%s",
                encodedAccessToken,
                encodedUserData));
    }
}
