package vn.vuhoang.backend_springboot.service;

import org.springframework.stereotype.Service;
import vn.vuhoang.backend_springboot.domain.dto.response.ResDashBoardDTO;
import vn.vuhoang.backend_springboot.repository.BookRepository;
import vn.vuhoang.backend_springboot.repository.OrderRepository;
import vn.vuhoang.backend_springboot.repository.UserRepository;

import java.util.List;

@Service
public class HomeService {
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final BookRepository bookRepository;

    public HomeService(UserRepository userRepository, OrderRepository orderRepository, BookRepository bookRepository) {
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
        this.orderRepository = orderRepository;
    }

    public List<String> getCategories() {
        return List.of(
                "Arts",
                "Business",
                "Comics",
                "Cooking",
                "Entertainment",
                "History",
                "Music",
                "Sports",
                "Teen",
                "Travel",
                "Mentality",
                "Health"
        );
    }

    public ResDashBoardDTO getDashBoard() {
        return ResDashBoardDTO.builder()
                .countUser(userRepository.count())
                .countOrder(orderRepository.count())
                .countBook(bookRepository.count())
                .build();
    }
}
