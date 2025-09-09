package vn.vuhoang.backend_springboot.domain.dto.request;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.vuhoang.backend_springboot.constant.PaymentEnum;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReqOrderDTO {
    private String name;
    private String address;
    private String phone;
    private Double totalPrice;

    @Enumerated(EnumType.STRING)
    private PaymentEnum type;

    private List<OrderDetailDTO> detail;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderDetailDTO {
        private Long id;
        private String bookName;
        private Integer quantity;
    }
}
