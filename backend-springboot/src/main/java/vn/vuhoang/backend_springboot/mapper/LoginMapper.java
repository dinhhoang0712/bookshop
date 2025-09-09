package vn.vuhoang.backend_springboot.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import vn.vuhoang.backend_springboot.domain.dto.response.ResLoginDTO;
import vn.vuhoang.backend_springboot.domain.entity.User;

@Mapper(componentModel = "spring", uses = {})
public interface LoginMapper {

    ResLoginDTO.UserDTO toUserDTO(User user);

    @Mapping(target = "user", source = "user")
    @Mapping(target = "accessToken", source = "accessToken")
    ResLoginDTO toResLoginDTO(User user, String accessToken);
}