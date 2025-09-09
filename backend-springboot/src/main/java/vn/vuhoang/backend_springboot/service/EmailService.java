package vn.vuhoang.backend_springboot.service;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import com.sendgrid.helpers.mail.objects.Personalization;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import vn.vuhoang.backend_springboot.exception.InvalidException;
import vn.vuhoang.backend_springboot.repository.UserRepository;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class EmailService {

    @Value("${spring.sendgrid.url}")
    private String sendgridUrl;

    @Value("${spring.sendgrid.from-email}")
    private String from;

    @Value("${spring.sendgrid.template-id}")
    private String templateId;

    private final SendGrid sendGrid;
    private final RedisService redisService;
    private final UserRepository userRepository;

    public EmailService(SendGrid sendGrid, RedisService redisService, UserRepository userRepository) {
        this.sendGrid = sendGrid;
        this.redisService = redisService;
        this.userRepository = userRepository;
    }

    public void emailVarification(String to, String name, String token) throws IOException {

        Email fromEmail = new Email(from, "Vũ Đình Hoàng");
        Email toEmail = new Email(to);

        String subject = "Xác thực tài khoản";
        String link = sendgridUrl + "?token=" + token;
        Map<String, String> map = new HashMap<>();
        map.put("name", name);
        map.put("link", link);

        Mail mail = new Mail();
        mail.setFrom(fromEmail);
        mail.setSubject(subject);

        Personalization personalization = new Personalization();
        personalization.addTo(toEmail);

        map.forEach(personalization::addDynamicTemplateData);

        mail.addPersonalization(personalization);
        mail.setTemplateId(templateId);

        Request request = new Request();

        request.setMethod(Method.POST);
        request.setEndpoint("mail/send");
        request.setBody(mail.build());

        Response response = sendGrid.api(request);
        if (response.getStatusCode() == 202) {
            log.info("Gửi mail xác thực thành công");
        } else {
            log.error("Gửi mail thất bại");
        }
    }

    public void confirmEmail(String token) throws InvalidException {
        String verificationToken = (String) redisService.getValue(token);

        if (verificationToken == null) {
            throw new InvalidException("Xác thực không thành công");
        }

        redisService.deleteValue(token);
    }

    public void sendOtpEmail(String to, String name, Integer otp) throws IOException {
        Email fromEmail = new Email(from, "Vũ Đình Hoàng");
        Email toEmail = new Email(to);
        String subject = "Mã OTP xác thực của bạn";

        // Nội dung HTML
        String htmlContent = """
                <html>
                  <body>
                    <h2>Xin chào %s,</h2>
                    <p>Mã OTP của bạn là:</p>
                    <h1 style='color: #2e6da4;'>%s</h1>
                    <p>OTP này có hiệu lực trong 5 phút.</p>
                  </body>
                </html>
                """.formatted(name, otp);

        Content content = new Content("text/html", htmlContent);
        Mail mail = new Mail(fromEmail, subject, toEmail, content);

        Request request = new Request();

        request.setMethod(Method.POST);
        request.setEndpoint("mail/send");
        request.setBody(mail.build());

        Response response = sendGrid.api(request);
        if (response.getStatusCode() == 202) {
            log.info("Gửi mail thành công");
        } else {
            log.error("Gửi mail thất bại");
        }
    }
}
