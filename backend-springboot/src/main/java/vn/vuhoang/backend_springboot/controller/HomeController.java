package vn.vuhoang.backend_springboot.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.vuhoang.backend_springboot.domain.dto.request.ReqChangePasswordDTO;
import vn.vuhoang.backend_springboot.domain.dto.request.ReqUpdateImgDTO;
import vn.vuhoang.backend_springboot.domain.dto.response.ResDashBoardDTO;
import vn.vuhoang.backend_springboot.exception.InvalidException;
import vn.vuhoang.backend_springboot.service.HomeService;
import vn.vuhoang.backend_springboot.service.UserService;
import vn.vuhoang.backend_springboot.utils.AppMessage;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class HomeController {

    private final HomeService homeService;
    private final UserService userService;

    public HomeController(HomeService homeService, UserService userService) {
        this.homeService = homeService;
        this.userService = userService;
    }

    @GetMapping("")
    public ResponseEntity<String> home() {
        return ResponseEntity.ok("VŨ ĐÌNH HOÀNG-BACKEND-APIBOOK");
    }

    @GetMapping("/database/category")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(homeService.getCategories());
    }

    @AppMessage("Thay đổi mật khẩu thành công")
    @PutMapping("/user/change-password")
    public ResponseEntity<String> changePassword(@Valid @RequestBody ReqChangePasswordDTO resChangePassword) throws InvalidException {
        userService.changePassword(resChangePassword);
        return ResponseEntity.ok("OK");
    }

    @PutMapping("/user")
    public ResponseEntity<String> updateUser(@Valid @RequestBody ReqUpdateImgDTO user) throws InvalidException {
        userService.updateImg(user);
        return ResponseEntity.ok("OK");
    }

    @GetMapping("/database/dashboard")
    public ResponseEntity<ResDashBoardDTO> getDashboard() {
        return ResponseEntity.ok(homeService.getDashBoard());
    }
}
