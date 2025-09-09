package vn.vuhoang.backend_springboot.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.vuhoang.backend_springboot.domain.dto.request.ReqLoginDTO;
import vn.vuhoang.backend_springboot.domain.dto.request.ReqUserDTO;
import vn.vuhoang.backend_springboot.domain.dto.response.ResLoginDTO;
import vn.vuhoang.backend_springboot.domain.dto.response.ResUserDTO;
import vn.vuhoang.backend_springboot.exception.InvalidException;
import vn.vuhoang.backend_springboot.service.AuthService;
import vn.vuhoang.backend_springboot.service.UserService;
import vn.vuhoang.backend_springboot.utils.AppMessage;
import vn.vuhoang.backend_springboot.utils.WithDelay;

@RestController
@RequestMapping("api/v1")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @WithDelay
    @AppMessage("Đăng nhập tài khoản thành công")
    @PostMapping("/auth/login")
    public ResponseEntity<ResLoginDTO> login(@Valid @RequestBody ReqLoginDTO reqLoginDTO) {


        AuthService.LoginResult result = authService.login(reqLoginDTO.getEmail(), reqLoginDTO.getPassword());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, result.cookie().toString())
                .body(result.dtoLogin());
    }

    @AppMessage("Đăng xuất thành công")
    @PostMapping("/auth/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, authService.logout().toString())
                .body(null);
    }

    @GetMapping("/auth/refresh")
    public ResponseEntity<ResLoginDTO> refresh(@CookieValue("refreshToken") String token) throws InvalidException {
        AuthService.LoginResult result = authService.refreshToken(token);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, result.cookie().toString())
                .body(result.dtoLogin());
    }

    @AppMessage("Đăng kí tài khoản thành công dùng thành công")
    @PostMapping("/auth/register")
    public ResponseEntity<ResUserDTO> register(@Valid @RequestBody ReqUserDTO reqUserDTO) throws InvalidException {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(reqUserDTO));
    }


    @WithDelay
    @AppMessage("Lấy người dùng thành công")
    @GetMapping("/auth/account")
    public ResponseEntity<ResUserDTO> getAccount() {
        return ResponseEntity.ok(authService.getAccount());
    }


}
