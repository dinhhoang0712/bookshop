package vn.vuhoang.backend_springboot.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.vuhoang.backend_springboot.constant.PaymentEnum;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResOrderDTO {
    private Long id;
    private String name;
    private String address;
    private String phone;
    private Double totalPrice;
    private PaymentEnum type;
    private Instant createAt;
    private List<ResOrderDetailDTO> orderDetails;
}
