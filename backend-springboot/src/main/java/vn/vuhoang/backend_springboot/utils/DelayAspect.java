package vn.vuhoang.backend_springboot.utils;

import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import vn.vuhoang.backend_springboot.exception.RuntimeStorageException;

@Aspect
@Component
public class DelayAspect {

    @Around("@annotation(vn.vuhoang.backend_springboot.utils.WithDelay)")
    public Object applyDelay(ProceedingJoinPoint joinPoint) throws Throwable {
        ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

        if (attrs != null) {
            HttpServletRequest request = attrs.getRequest();
            String delayHeader = request.getHeader("delay");

            if (delayHeader != null) {
                try {
                    long delay = Long.parseLong(delayHeader);
                    delay = Math.min(delay, 10000); // Giới hạn 10s
                    Thread.sleep(delay);
                } catch (NumberFormatException e) {
                    throw new RuntimeStorageException("Invalid delay header", e);
                }
            }
        }

        return joinPoint.proceed();
    }
}
