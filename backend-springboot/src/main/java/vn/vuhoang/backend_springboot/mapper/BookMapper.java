package vn.vuhoang.backend_springboot.mapper;

import org.mapstruct.IterableMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.BeanMapping;
import org.mapstruct.NullValuePropertyMappingStrategy;
import vn.vuhoang.backend_springboot.domain.dto.request.ReqBookDTO;
import vn.vuhoang.backend_springboot.domain.dto.response.ResBookDTO;
import vn.vuhoang.backend_springboot.domain.entity.Book;

import java.util.List;

@Mapper(componentModel = "spring", uses = {})
public interface BookMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "sold", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "orderDetails", ignore = true)
    Book toEntity(ReqBookDTO reqBookDTO);

    ResBookDTO toDto(Book book);

    @IterableMapping(elementTargetType = ResBookDTO.class)
    List<ResBookDTO> toDto(List<Book> books);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "sold", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "orderDetails", ignore = true)
    Book partialUpdate(ReqBookDTO dto, @MappingTarget Book book);
}
