package vn.vuhoang.backend_springboot.mapper;

import org.mapstruct.*;
import vn.vuhoang.backend_springboot.domain.dto.request.ReqOrderDTO;
import vn.vuhoang.backend_springboot.domain.entity.OrderDetail;

@Mapper(componentModel = "spring")
public interface OrderDetailMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "order", ignore = true)
    @Mapping(target = "book", ignore = true)
    @Mapping(target = "quantity", source = "quantity")
    @Mapping(target = "sumPrice", ignore = true)
    OrderDetail toEntity(ReqOrderDTO.OrderDetailDTO dto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "order", ignore = true)
    @Mapping(target = "book", ignore = true)
    @Mapping(target = "quantity", source = "quantity")
    @Mapping(target = "sumPrice", ignore = true)
    OrderDetail partialUpdate(ReqOrderDTO.OrderDetailDTO dto, @MappingTarget OrderDetail orderDetail);
}