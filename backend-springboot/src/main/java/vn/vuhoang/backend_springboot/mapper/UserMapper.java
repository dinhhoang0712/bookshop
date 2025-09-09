package vn.vuhoang.backend_springboot.mapper;

import org.mapstruct.*;
import vn.vuhoang.backend_springboot.domain.dto.request.ReqUserDTO;
import vn.vuhoang.backend_springboot.domain.dto.request.ReqUserUpdateDTO;
import vn.vuhoang.backend_springboot.domain.dto.response.ResUserDTO;
import vn.vuhoang.backend_springboot.domain.entity.User;

import java.util.List;


@Mapper(componentModel = "spring", uses = {})
public interface UserMapper {

    ResUserDTO toDto(User user);

    @IterableMapping(elementTargetType = ResUserDTO.class)
    List<ResUserDTO> toDto(List<User> users);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "avatar", ignore = true)
    @Mapping(target = "orders", ignore = true)
    User toEntity(ReqUserDTO reqUserDTO);


    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "email", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "avatar", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "orders", ignore = true)
    User partialUpdate(ReqUserUpdateDTO dto, @MappingTarget User user);

    @IterableMapping(elementTargetType = User.class)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "email", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "avatar", ignore = true)
    List<User> toEntity(List<ReqUserDTO> reqUserDTOs);
}