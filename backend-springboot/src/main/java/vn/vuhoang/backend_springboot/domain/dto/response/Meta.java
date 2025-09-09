package vn.vuhoang.backend_springboot.domain.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Meta {
    private int page; //trang hiện tại
    private int pageSize; //số bản ghi trên 1 trang
    private int pages; //tổng số trang
    private long total; //tổng số bản ghi
}
