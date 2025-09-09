package vn.vuhoang.backend_springboot.domain.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResultPaginationDTO {
    private Meta meta;
    private Object result;
}
