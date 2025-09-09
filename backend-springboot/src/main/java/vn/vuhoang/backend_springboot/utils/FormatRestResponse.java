package vn.vuhoang.backend_springboot.utils;

import com.nimbusds.jose.util.Resource;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;
import vn.vuhoang.backend_springboot.domain.dto.response.RestResponse;

@RestControllerAdvice
public class FormatRestResponse implements ResponseBodyAdvice<Object> {
    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        return true;
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType,
                                  MediaType selectedContentType,
                                  Class<? extends HttpMessageConverter<?>> selectedConverterType,
                                  ServerHttpRequest request, ServerHttpResponse response) {
        //Lấy ra đối tượng HttpServletResponse
        HttpServletResponse servletResponse = ((ServletServerHttpResponse) response).getServletResponse();
        //Lấy ra mã trạng thái HTTP
        int status = servletResponse.getStatus();

        RestResponse<Object> res = new RestResponse<>();
        res.setStatusCode(status);

        if (body instanceof String || body instanceof Resource) {
            res.setMessage(body.toString());
        }
        if (status >= 400) {
            return body;
        } else {
            res.setData(body);
            AppMessage message = returnType.getMethodAnnotation(AppMessage.class);
            res.setMessage(message != null ? message.value() : "CALL API SUCCESS");
        }

        return res;
    }
}
