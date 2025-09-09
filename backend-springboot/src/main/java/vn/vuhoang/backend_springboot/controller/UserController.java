package vn.vuhoang.backend_springboot.controller;

import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.vuhoang.backend_springboot.domain.dto.request.ReqUserDTO;
import vn.vuhoang.backend_springboot.domain.dto.request.ReqUserUpdateDTO;
import vn.vuhoang.backend_springboot.domain.dto.request.ResetPasswordDTO;
import vn.vuhoang.backend_springboot.domain.dto.response.ResListUserDTO;
import vn.vuhoang.backend_springboot.domain.dto.response.ResUserDTO;
import vn.vuhoang.backend_springboot.domain.dto.response.ResultPaginationDTO;
import vn.vuhoang.backend_springboot.exception.InvalidException;
import vn.vuhoang.backend_springboot.service.UserService;
import vn.vuhoang.backend_springboot.utils.AppMessage;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/v1")

public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public ResponseEntity<ResultPaginationDTO> getAllUsers(Pageable pageable,
            @RequestParam Map<String, String> params) {

        return ResponseEntity.ok(userService.getAllUsers(pageable, params));
    }

    @AppMessage("Tạo người dùng thành công")
    @PostMapping("/users")
    public ResponseEntity<ResUserDTO> createUser(@Valid @RequestBody ReqUserDTO reqUserDTO) throws InvalidException {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(reqUserDTO));
    }

    @AppMessage("Cập nhật người dùng thành công")
    @PutMapping("/users/{id}")
    public ResponseEntity<ResUserDTO> updateUser(@PathVariable("id") Long id, @Valid @RequestBody ReqUserUpdateDTO dto)
            throws InvalidException {

        return ResponseEntity.ok(userService.updateUser(id, dto));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<ResUserDTO> getUser(@PathVariable("id") Long id) throws InvalidException {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @AppMessage("Xóa người dùng thành công")
    @DeleteMapping("users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable("id") Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(null);
    }

    @PostMapping("/users/bulk-create")
    public ResponseEntity<ResListUserDTO> bulkCreateUser(@RequestBody List<ReqUserDTO> dtoList) {

        return ResponseEntity.status(HttpStatus.CREATED).body(userService.bulkCreateUser(dtoList));
    }

    @GetMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordDTO resetPasswordDTO)
            throws InvalidException {
        return ResponseEntity.ok(userService.resetPassword(resetPasswordDTO));
    }
}
