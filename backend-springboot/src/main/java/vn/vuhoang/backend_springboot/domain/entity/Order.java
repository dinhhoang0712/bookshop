package vn.vuhoang.backend_springboot.domain.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.vuhoang.backend_springboot.constant.PaymentEnum;

import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String address;
    private String phone;
    private Double totalPrice;

    @Enumerated(EnumType.STRING)
    private PaymentEnum type;


    @ManyToOne(fetch =  FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private Instant createAt;


    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch =  FetchType.LAZY)
    private List<OrderDetail> orderDetails;
}
