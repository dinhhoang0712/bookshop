package vn.vuhoang.backend_springboot.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.vuhoang.backend_springboot.domain.dto.request.ReqVnpayDTO;
import vn.vuhoang.backend_springboot.service.VNPayService;

@RestController
@RequestMapping("/api/v1/vnpay")
public class VNPayController {

    private final VNPayService vNPayService;

    public VNPayController(VNPayService vNPayService) {
        this.vNPayService = vNPayService;
    }

    @PostMapping
    public ResponseEntity<String> createPayment(@RequestBody ReqVnpayDTO reqVnpayDTO) {
        try {
            String paymentUrl = vNPayService.createPayment(reqVnpayDTO);
            return ResponseEntity.ok(paymentUrl);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi khi tạo thanh toán!");
        }
    }

    @GetMapping("/return")
    public ResponseEntity<String> returnPayment(@RequestParam("vnp_ResponseCode") String responseCode) {
        return vNPayService.handlePaymentReturn(responseCode);
    }

}
