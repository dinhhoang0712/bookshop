package vn.vuhoang.backend_springboot.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import vn.vuhoang.backend_springboot.domain.dto.request.ReqOrderDTO;
import vn.vuhoang.backend_springboot.domain.dto.response.ResOrderDTO;
import vn.vuhoang.backend_springboot.domain.dto.response.ResOrderDetailDTO;
import vn.vuhoang.backend_springboot.domain.entity.Book;
import vn.vuhoang.backend_springboot.domain.entity.Order;
import vn.vuhoang.backend_springboot.domain.entity.OrderDetail;
import vn.vuhoang.backend_springboot.domain.entity.User;
import vn.vuhoang.backend_springboot.exception.InvalidException;
import vn.vuhoang.backend_springboot.mapper.OrderMapper;
import vn.vuhoang.backend_springboot.repository.BookRepository;
import vn.vuhoang.backend_springboot.repository.OrderDetailRepository;
import vn.vuhoang.backend_springboot.repository.OrderRepository;
import vn.vuhoang.backend_springboot.repository.UserRepository;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final OrderMapper orderMapper;
    private final OrderDetailRepository orderDetailRepository;

    public ResOrderDTO createOrder(ReqOrderDTO orderDTO) throws InvalidException {
        User user = getCurrentUser();
        Order order = orderMapper.toEntity(orderDTO);
        order.setUser(user);
        order.setCreateAt(Instant.now());

        order = orderRepository.save(order);
        List<OrderDetail> orderDetails = new ArrayList<>();
        for (ReqOrderDTO.OrderDetailDTO detail : orderDTO.getDetail()) {
            orderDetails.add(createOrderDetail(detail, order));
        }

        order.setOrderDetails(orderDetails);
        return orderMapper.toDto(orderRepository.save(order));
    }

    public List<ResOrderDTO> getOrderHistory(Pageable pageable) throws InvalidException {
        User user = getCurrentUser();
        Page<Order> orders = orderRepository.findByUser(user, pageable);
        List<ResOrderDTO> list = new ArrayList<>();
        for (Order order : orders) {
            ResOrderDTO dto = orderMapper.toDto(order);
            dto.setOrderDetails(order.getOrderDetails().stream().map(
                    o -> new ResOrderDetailDTO(o.getId(), o.getBook().getMainTest(),
                            o.getQuantity(), o.getBook().getThumbnail()))
                    .toList());
            list.add(dto);
        }

        return list;
    }

    private User getCurrentUser() throws InvalidException {
        String email = JwtService.getCurrentUserLogin()
                .orElseThrow(() -> new InvalidException("Người dùng không tồn tại"));
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidException("Người dùng không tồn tại"));
    }

    private OrderDetail createOrderDetail(ReqOrderDTO.OrderDetailDTO detail, Order order) throws InvalidException {
        Book book = bookRepository.findById(detail.getId())
                .orElseThrow(() -> new InvalidException("Không tồn tại sách: " + detail.getBookName()));

        if (book.getQuantity() < detail.getQuantity()) {
            throw new InvalidException("Số lượng không đủ cho cuốn sách: " + detail.getBookName());
        }

        book.setQuantity(book.getQuantity() - detail.getQuantity());
        book.setSold(book.getSold() + detail.getQuantity());
        bookRepository.save(book);

        OrderDetail orderDetail = new OrderDetail();
        orderDetail.setOrder(order);
        orderDetail.setBook(book);
        orderDetail.setQuantity(detail.getQuantity());
        orderDetail.setSumPrice(book.getPrice() * detail.getQuantity());
        return orderDetailRepository.save(orderDetail);
    }
}
