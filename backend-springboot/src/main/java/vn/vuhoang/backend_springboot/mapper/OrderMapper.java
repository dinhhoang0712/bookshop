package vn.vuhoang.backend_springboot.mapper;

import org.mapstruct.*;
import vn.vuhoang.backend_springboot.domain.dto.request.ReqOrderDTO;
import vn.vuhoang.backend_springboot.domain.dto.response.ResOrderDTO;
import vn.vuhoang.backend_springboot.domain.entity.Order;

@Mapper(componentModel = "spring", uses = { OrderDetailMapper.class })
public interface OrderMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "orderDetails", ignore = true)
    @Mapping(target = "createAt", ignore = true)
    Order toEntity(ReqOrderDTO dto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "orderDetails", ignore = true)
    @Mapping(target = "createAt", ignore = true)
    Order partialUpdate(ReqOrderDTO dto, @MappingTarget Order order);

    @Mapping(target = "orderDetails", ignore = true)
    ResOrderDTO toDto(Order order);

}