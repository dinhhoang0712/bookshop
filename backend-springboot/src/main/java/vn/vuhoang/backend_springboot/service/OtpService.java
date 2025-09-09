package vn.vuhoang.backend_springboot.service;

import org.springframework.stereotype.Service;
import vn.vuhoang.backend_springboot.domain.entity.User;

import java.io.IOException;
import java.util.Random;

@Service
public class OtpService {

    private final UserService userService;
    private final EmailService emailService;
    private final RedisService redisService;

    public OtpService(UserService userService, EmailService emailService, RedisService redisService) {

        this.userService = userService;
        this.emailService = emailService;
        this.redisService = redisService;
    }

    public Boolean generateOTPForResetPassword(String email) throws IOException {
        // generate otp
        Integer otpValue = generateOTP(email);
        if (otpValue == -1) {
            return false;
        }
        User user = userService.getUserByEmail(email);
        if (user == null) {
            throw new IOException("Email không tồn tại");
        }
        emailService.sendOtpEmail(email, user.getFullName(), otpValue);
        // send generated e-mail
        return true;
    }

    public Boolean verifyOTP(String email, String opt) throws IOException {
        String otpValue = (String) redisService.getValue(email);
        if (otpValue == null) {
            throw new IOException("Quá thời hạn");
        }

        if (otpValue.equals(opt)) {
            redisService.deleteValue(email);
            return true;
        } else {
            throw new IOException("Mã OTP không hợp lệ");
        }
    }

    private Integer generateOTP(String email) {
        Random random = new Random();
        Integer OTP = 100000 + random.nextInt(900000);
        redisService.setValue(email, OTP, 5L);
        return OTP;
    }
}
