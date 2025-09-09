package vn.vuhoang.backend_springboot.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.stereotype.Service;
import vn.vuhoang.backend_springboot.domain.dto.response.ResLoginDTO;
import vn.vuhoang.backend_springboot.utils.SecurityUtil;

import java.util.Optional;

@Service
public class JwtService {
    private final SecurityUtil securityUtil;
    private final JwtEncoder jwtEncoder;

    public JwtService(SecurityUtil securityUtil, JwtEncoder jwtEncoder) {
        this.securityUtil = securityUtil;
        this.jwtEncoder = jwtEncoder;
    }

    public String createAccessToken(String email, ResLoginDTO.UserDTO userDTO) {
        return securityUtil.createAccessToken(email, userDTO, jwtEncoder);
    }

    public String createRefreshToken(String email, ResLoginDTO.UserDTO dto) {
        return securityUtil.createRefreshToken(email, dto, jwtEncoder);
    }

    public static Optional<String> getCurrentUserLogin() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        return Optional.ofNullable(extractPrincipal(securityContext.getAuthentication()));
    }

    private static String extractPrincipal(Authentication authentication) {
        if (authentication == null) {
            return null;
        } else if (authentication.getPrincipal() instanceof UserDetails springSecurityUser) {
            return springSecurityUser.getUsername();
        } else if (authentication.getPrincipal() instanceof Jwt jwt) {
            return jwt.getSubject();
        } else if (authentication.getPrincipal() instanceof String s) {
            return s;
        }
        return null;
    }
}
