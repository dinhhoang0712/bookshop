package vn.vuhoang.backend_springboot.domain.dto.response;

import lombok.*;



@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResListUserDTO {
    private Long countSuccess;
    private Long countError;
    private Object detail;
}
