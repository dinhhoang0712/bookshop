package vn.vuhoang.backend_springboot.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.vuhoang.backend_springboot.domain.dto.request.ReqOrderDTO;
import vn.vuhoang.backend_springboot.domain.dto.response.ResOrderDTO;
import vn.vuhoang.backend_springboot.service.OrderService;
import vn.vuhoang.backend_springboot.exception.InvalidException;
import vn.vuhoang.backend_springboot.utils.WithDelay;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @WithDelay
    @PostMapping("/orders")
    public ResponseEntity<String> createOrder(@RequestBody ReqOrderDTO order) throws InvalidException {
        orderService.createOrder(order);
        return ResponseEntity.ok().body("success");
    }

    @GetMapping("/history")
    public ResponseEntity<List<ResOrderDTO>> getOrderHistory(Pageable pageable) throws InvalidException {
        return ResponseEntity.ok(orderService.getOrderHistory(pageable));
    }
}
