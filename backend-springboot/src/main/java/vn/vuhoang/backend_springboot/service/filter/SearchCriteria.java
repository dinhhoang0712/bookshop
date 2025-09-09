package vn.vuhoang.backend_springboot.service.filter;

import lombok.*;



@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SearchCriteria {

    private String key; // tên thuộc tích
    private String operation; // toán tử
    private Object value;

    /**
     * Khởi tạo một SearchCriteria từ key và value
     * Format của value: "/:operation/value"
     * Ví dụ: "/:/john" -> tìm kiếm chứa "john"
     * "/=/john" -> tìm kiếm chính xác "john"
     */
    public SearchCriteria(String key, String value) {
        this.key = key;
        String text = "";
        if (value.contains("/")) {
            this.operation = value.substring(value.indexOf('/') + 1, value.lastIndexOf('/'));
            text = value.substring(value.lastIndexOf('/') + 1);
        } else {
            // Mặc định sử dụng toán tử like nếu không có định dạng đặc biệt
            this.operation = ":";
            text = value;
        }

        if ("in".equals(this.operation)) {
            this.value = text.contains(",") ? text.split(",") : new String[] { text };
        } else {
            this.value = text.contains(",") ? text.split(",") : text;
        }
    }
}
