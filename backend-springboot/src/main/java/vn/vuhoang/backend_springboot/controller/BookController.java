package vn.vuhoang.backend_springboot.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.vuhoang.backend_springboot.domain.dto.request.ReqBookDTO;
import vn.vuhoang.backend_springboot.domain.dto.response.ResBookDTO;
import vn.vuhoang.backend_springboot.domain.dto.response.ResultPaginationDTO;
import vn.vuhoang.backend_springboot.exception.InvalidException;
import vn.vuhoang.backend_springboot.service.BookService;
import vn.vuhoang.backend_springboot.utils.AppMessage;
import vn.vuhoang.backend_springboot.utils.WithDelay;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @AppMessage("Tạo một cuốn sách thành công")
    @PostMapping("/books")
    public ResponseEntity<ResBookDTO> createBook(@RequestBody ReqBookDTO reqBookDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookService.createBook(reqBookDTO));
    }

    @GetMapping("books/{id}")
    public ResponseEntity<ResBookDTO> getBookById(@PathVariable Long id) throws InvalidException {
        return ResponseEntity.ok(bookService.getBookId(id));
    }

    @AppMessage("Cập nhật sách thành công")
    @PutMapping("books/{id}")
    public ResponseEntity<ResBookDTO> updateBook(@PathVariable Long id
            , @RequestBody ReqBookDTO reqBookDTO) throws InvalidException {

        return ResponseEntity.status(HttpStatus.CREATED).body(bookService.updateBook(id, reqBookDTO));
    }

    @AppMessage("Xóa sách thành công")
    @DeleteMapping("books/{id}")
    public ResponseEntity<Void> deleteBookById(@PathVariable Long id) throws InvalidException {
        bookService.deleteBookById(id);
        return ResponseEntity.ok(null);
    }

    @WithDelay
    @GetMapping("/books")
    public ResponseEntity<ResultPaginationDTO> getAllBook(Pageable pageable, @RequestParam Map<String, String> params) {

        return ResponseEntity.ok(bookService.getAllBook(pageable, params));
    }


}
