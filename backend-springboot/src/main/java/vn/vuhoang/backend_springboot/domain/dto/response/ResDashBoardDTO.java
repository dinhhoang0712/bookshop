package vn.vuhoang.backend_springboot.domain.dto.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResDashBoardDTO {
    private Long countUser;
    private Long countOrder;
    private Long countBook;
}
