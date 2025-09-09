package vn.vuhoang.backend_springboot.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vn.vuhoang.backend_springboot.exception.InvalidException;
import vn.vuhoang.backend_springboot.service.EmailService;
import vn.vuhoang.backend_springboot.service.OtpService;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1")
public class EmailController {

    private final EmailService emailService;
    private final OtpService otpService;

    public EmailController(EmailService emailService, OtpService optService) {
        this.emailService = emailService;
        this.otpService = optService;
    }

    @GetMapping("/confirm-email")
    public ResponseEntity<String> verifyEmail(@RequestParam String token) throws InvalidException {
        emailService.confirmEmail(token);
        return ResponseEntity.ok("Ok");
    }

    @GetMapping("/resetPasswordOTPEmail")
    public ResponseEntity<String> resetPasswordOTPEmail(@RequestParam("email") String email) throws InvalidException, IOException {
        boolean isGenerated = otpService.generateOTPForResetPassword(email);
        if (!isGenerated) {
            return new ResponseEntity<>("Không thể khởi tạo OTP.", HttpStatus.BAD_REQUEST);
        }

        return ResponseEntity.ok("Đã gửi mã OTP, xin vui lòng kiểm tra email.");
    }

    @GetMapping(value = "/emailOTPVerification")
    public ResponseEntity<Object> emailOTPVerification(@RequestParam("email") String email,
                                                       @RequestParam("otp") String otp) throws InvalidException, IOException {

        Boolean result = otpService.verifyOTP(email, otp);
        if (result) {
            return ResponseEntity.badRequest().body("Xác thực OTP không thành công");
        }

        return ResponseEntity.ok().body("Xác thực thành công");
    }
}
