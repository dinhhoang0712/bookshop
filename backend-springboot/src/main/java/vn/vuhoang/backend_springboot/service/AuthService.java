package vn.vuhoang.backend_springboot.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import vn.vuhoang.backend_springboot.domain.dto.response.ResLoginDTO;
import vn.vuhoang.backend_springboot.domain.dto.response.ResUserDTO;
import vn.vuhoang.backend_springboot.domain.entity.User;
import vn.vuhoang.backend_springboot.exception.InvalidException;
import vn.vuhoang.backend_springboot.mapper.LoginMapper;
import vn.vuhoang.backend_springboot.mapper.UserMapper;
import vn.vuhoang.backend_springboot.utils.SecurityUtil;

import java.util.Optional;

@Service
public class AuthService {
        @Value("${vuhoang.jwt.refresh-token-validity-in-seconds}")
        private long refreshTokenValidityInSeconds;
        private static final String REFRESHTOKEN = "refreshToken";

        private final AuthenticationManagerBuilder authenticationManagerBuilder;
        private final UserService userService;
        private final JwtService jwtService;
        private final SecurityUtil securityUtil;
        private final LoginMapper loginMapper;
        private final UserMapper userMapper;

        public AuthService(AuthenticationManagerBuilder authenticationManagerBuilder, UserService userService,
                        JwtService jwtService, SecurityUtil securityUtil, LoginMapper loginMapper,
                        UserMapper userMapper) {
                this.authenticationManagerBuilder = authenticationManagerBuilder;
                this.userService = userService;
                this.jwtService = jwtService;
                this.securityUtil = securityUtil;
                this.loginMapper = loginMapper;
                this.userMapper = userMapper;
        }

        public record LoginResult(ResLoginDTO dtoLogin, ResponseCookie cookie) {
        }

        public LoginResult login(String email, String password) {

                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                                email, password);

                Authentication authentication = authenticationManagerBuilder.getObject()
                                .authenticate(authenticationToken);
                SecurityContextHolder.getContext().setAuthentication(authentication);

                User user = userService.getUserByEmail(email);

                ResLoginDTO.UserDTO userDTO = loginMapper.toUserDTO(user);

                String accessToken = jwtService.createAccessToken(email, userDTO);

                String refreshToken = jwtService.createRefreshToken(email, userDTO);

                ResponseCookie cookie = ResponseCookie
                                .from(REFRESHTOKEN, refreshToken)
                                .httpOnly(false)
                                .secure(false)
                                .path("/")
                                .maxAge(refreshTokenValidityInSeconds)
                                .sameSite("Lax")
                                .build();

                return new LoginResult(
                                ResLoginDTO.builder().accessToken(accessToken).user(userDTO).build(),
                                cookie);
        }

        public ResponseCookie logout() {

                return ResponseCookie
                                .from(REFRESHTOKEN, "")
                                .httpOnly(false)
                                .secure(false)
                                .path("/")
                                .maxAge(0)
                                .sameSite("Lax")
                                .build();
        }

        public LoginResult refreshToken(String refreshToken) throws InvalidException {
                Jwt jwt = securityUtil.checkValidToken(refreshToken);
                String email = jwt.getSubject();
                User user = userService.getUserByEmail(email);
                if (user == null) {
                        throw new InvalidException("Token không hợp lệ");
                }

                ResLoginDTO.UserDTO userDTO = loginMapper.toUserDTO(user);

                String accessToken = jwtService.createAccessToken(email, userDTO);

                String newRefreshToken = jwtService.createRefreshToken(email, userDTO);

                ResponseCookie cookie = ResponseCookie
                                .from(REFRESHTOKEN, newRefreshToken)
                                .httpOnly(false)
                                .secure(false)
                                .path("/")
                                .maxAge(refreshTokenValidityInSeconds)
                                .sameSite("Lax")
                                .build();

                return new LoginResult(
                                ResLoginDTO.builder().accessToken(accessToken).user(userDTO).build(),
                                cookie);
        }

        public ResUserDTO getAccount() {
                Optional<String> value = JwtService.getCurrentUserLogin();
                String email = value.orElse("");
                User user = userService.getUserByEmail(email);

                return userMapper.toDto(user);
        }


}
