package vn.vuhoang.backend_springboot.utils;

import org.springframework.data.jpa.domain.Specification;
import vn.vuhoang.backend_springboot.service.filter.AppSpecification;

import java.util.HashMap;
import java.util.Map;


public class FilterUtils {

    private FilterUtils() {
        throw new IllegalStateException("Utility class");
    }
    private static final String[] PAGINATION_PARAMS = { "page", "size", "pageSize", "sort" };


    public static Map<String, String> removePaginationParams(Map<String, String> params) {
        if (params == null) {
            return new HashMap<>();
        }

        Map<String, String> filteredParams = new HashMap<>(params);
        for (String param : PAGINATION_PARAMS) {
            filteredParams.remove(param);
        }

        return filteredParams;
    }


    public static <T> Specification<T> buildSpecificationFromParams(Map<String, String> params) {
        return AppSpecification.buildSpecification(removePaginationParams(params));
    }


    public static <T> Specification<T> buildOrSpecificationFromParams(Map<String, String> params) {
        return AppSpecification.buildOrSpecification(removePaginationParams(params));
    }
}