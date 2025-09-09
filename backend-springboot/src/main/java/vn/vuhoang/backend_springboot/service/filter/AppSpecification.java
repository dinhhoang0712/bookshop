package vn.vuhoang.backend_springboot.service.filter;

import jakarta.persistence.criteria.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.jpa.domain.Specification;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AppSpecification<T> implements Specification<T> {
    private transient SearchCriteria searchCriteria;

    @Override
    public Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        return switch (searchCriteria.getOperation()) {
            case ":" -> criteriaBuilder.like(
                    root.get(searchCriteria.getKey()), "%" + searchCriteria.getValue() + "%");
            case "=" -> criteriaBuilder.equal(
                    root.get(searchCriteria.getKey()), searchCriteria.getValue());
            case ">" -> criteriaBuilder.greaterThan(
                    root.get(searchCriteria.getKey()), (Comparable) searchCriteria.getValue());
            case ">=" -> criteriaBuilder.greaterThanOrEqualTo(
                    root.get(searchCriteria.getKey()), (Comparable) searchCriteria.getValue());
            case "<" -> criteriaBuilder.lessThan(
                    root.get(searchCriteria.getKey()), (Comparable) searchCriteria.getValue());
            case "<=" -> criteriaBuilder.lessThanOrEqualTo(
                    root.get(searchCriteria.getKey()), (Comparable) searchCriteria.getValue());
            case "!=" -> criteriaBuilder.notEqual(
                    root.get(searchCriteria.getKey()), searchCriteria.getValue());
            case "in" -> {
                if (searchCriteria.getValue() instanceof Object[] array) {
                    yield root.get(searchCriteria.getKey()).in(array);
                } else {
                    throw new IllegalArgumentException("Bạn sử dụng sai cú pháp");
                }
            }
            case "<>" -> {
                if (searchCriteria.getValue() instanceof Object[] array) {
                    Object min = array[0];
                    Object max = array[1];
                    Path<?> path = root.get(searchCriteria.getKey());
                    Class<?> type = path.getJavaType();

                    if (type == Instant.class) {
                        Instant minInstant = (min instanceof String s) ? Instant.parse(s) : (Instant) min;
                        Instant maxInstant = (max instanceof String s) ? Instant.parse(s) : (Instant) max;
                        yield criteriaBuilder.between(path.as(Instant.class), minInstant, maxInstant);
                    }

                    if (min instanceof Comparable<?> minComp && max instanceof Comparable<?> maxComp) {
                        @SuppressWarnings("unchecked")
                        Path<Comparable<Object>> cmpPath = (Path<Comparable<Object>>) path;
                        yield criteriaBuilder.between(cmpPath, (Comparable<Object>) minComp, (Comparable<Object>) maxComp);
                    }

                    throw new IllegalArgumentException("Trường không hỗ trợ between: " + searchCriteria.getKey());
                }
                throw new IllegalArgumentException("Bạn sử dụng sai cú pháp");
            }
            default -> null;
        };
    }

    public static <T> Specification<T> buildSpecification(Map<String, String> params) {
        if (params == null || params.isEmpty()) {
            return null;
        }

        List<Specification<T>> specifications = new ArrayList<>();

        params.forEach((key, value) -> {
            SearchCriteria criteria = new SearchCriteria(key, value);
            specifications.add(new AppSpecification<>(criteria));
        });

        return combineSpecificationsWithAnd(specifications);
    }

    public static <T> Specification<T> combineSpecificationsWithAnd(List<Specification<T>> specifications) {
        if (specifications == null || specifications.isEmpty()) {
            return null;
        }

        Specification<T> result = specifications.get(0);

        for (int i = 1; i < specifications.size(); i++) {
            result = Specification.where(result).and(specifications.get(i));
        }

        return result;
    }

    public static <T> Specification<T> combineSpecificationsWithOr(List<Specification<T>> specifications) {
        if (specifications == null || specifications.isEmpty()) {
            return null;
        }

        Specification<T> result = specifications.get(0);

        for (int i = 1; i < specifications.size(); i++) {
            result = Specification.where(result).or(specifications.get(i));
        }

        return result;
    }

    public static <T> Specification<T> buildOrSpecification(Map<String, String> params) {
        if (params == null || params.isEmpty()) {
            return null;
        }

        List<Specification<T>> specifications = new ArrayList<>();

        params.forEach((key, value) -> {
            SearchCriteria criteria = new SearchCriteria(key, value);
            specifications.add(new AppSpecification<>(criteria));
        });

        return combineSpecificationsWithOr(specifications);
    }
}
