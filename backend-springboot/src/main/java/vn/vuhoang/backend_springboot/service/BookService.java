package vn.vuhoang.backend_springboot.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import vn.vuhoang.backend_springboot.constant.Message;
import vn.vuhoang.backend_springboot.domain.dto.request.ReqBookDTO;
import vn.vuhoang.backend_springboot.domain.dto.response.Meta;
import vn.vuhoang.backend_springboot.domain.dto.response.ResBookDTO;
import vn.vuhoang.backend_springboot.domain.dto.response.ResultPaginationDTO;
import vn.vuhoang.backend_springboot.domain.entity.Book;
import vn.vuhoang.backend_springboot.exception.InvalidException;
import vn.vuhoang.backend_springboot.mapper.BookMapper;
import vn.vuhoang.backend_springboot.repository.BookRepository;
import vn.vuhoang.backend_springboot.utils.FilterUtils;

import java.time.Instant;
import java.util.Map;

@Service
public class BookService {
    private final BookRepository bookRepository;
    private final BookMapper bookMapper;

    public BookService(BookRepository bookRepository, BookMapper bookMapper) {
        this.bookRepository = bookRepository;
        this.bookMapper = bookMapper;
    }

    public ResultPaginationDTO getAllBook(Pageable pageable, Map<String, String> params) {
        Page<Book> books = bookRepository.findAll(FilterUtils.buildSpecificationFromParams(params), pageable);

        return ResultPaginationDTO.builder()
                .meta(Meta.builder()
                        .page(books.getNumber() + 1)
                        .pageSize(books.getSize())
                        .pages(books.getTotalPages())
                        .total(books.getTotalElements())
                        .build())
                .result(bookMapper.toDto(books.getContent())).build();
    }

    public ResBookDTO createBook(ReqBookDTO reqBookDTO) {

        Book book = bookMapper.toEntity(reqBookDTO);
        book.setCreatedAt(Instant.now());
        book.setSold(0);
        return bookMapper.toDto(bookRepository.save(book));
    }

    public ResBookDTO updateBook(Long id, ReqBookDTO reqBookDTO) throws InvalidException {
        Book book = bookRepository.findById(id).orElseThrow(() -> new InvalidException(Message.ID_NOT_EXIST));

        Book newBook = bookMapper.partialUpdate(reqBookDTO, book);
        newBook.setUpdatedAt(Instant.now());

        return bookMapper.toDto(bookRepository.save(newBook));
    }

    public void deleteBookById(Long id) throws InvalidException {
        bookRepository.findById(id).orElseThrow(() -> new InvalidException(Message.ID_NOT_EXIST));

        bookRepository.deleteById(id);
    }

    public ResBookDTO getBookId(Long id) throws InvalidException {
        Book book = bookRepository.findById(id).orElseThrow(() -> new InvalidException(Message.ID_NOT_EXIST));
        return bookMapper.toDto(book);
    }

}
