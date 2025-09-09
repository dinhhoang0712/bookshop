package vn.vuhoang.backend_springboot.mapper;

import java.util.List;

/**
 * Contract for a generic dto to entity mapper.
 *
 * @param <D> - DTO type
 * @param <E> - Entity type
 */
public interface EntityMapper<D, E> {

    /**
     * Maps an entity to a DTO object
     *
     * @param entity entity to map from
     * @return mapped DTO
     */
    D toDto(E entity);

    /**
     * Maps a DTO to an entity object
     *
     * @param dto DTO to map from
     * @return mapped entity
     */
    E toEntity(D dto);

    /**
     * Maps a list of entities to a list of DTOs
     *
     * @param entities entities to map from
     * @return list of mapped DTOs
     */
    List<D> toDto(List<E> entities);

    /**
     * Maps a list of DTOs to a list of entities
     *
     * @param dtos DTOs to map from
     * @return list of mapped entities
     */
    List<E> toEntity(List<D> dtos);

    /**
     * Updates an entity from a DTO
     *
     * @param dto    DTO containing the data to update
     * @param entity entity to update
     * @return updated entity
     */
    E partialUpdate(D dto, E entity);
}