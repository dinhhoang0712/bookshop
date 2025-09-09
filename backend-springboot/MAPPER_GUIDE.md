# Hướng dẫn sử dụng Mapper trong dự án

## Giới thiệu

Dự án sử dụng thư viện [MapStruct](https://mapstruct.org/) để ánh xạ giữa các đối tượng DTO (Data Transfer Object) và Entity, giúp giảm thiểu mã boilerplate và tăng tính bảo trì của code.

## Cấu trúc

Mapper trong dự án được tổ chức như sau:
- `EntityMapper<D, E>`: Interface chung định nghĩa các phương thức cơ bản cho tất cả mapper
- Các mapper cụ thể (VD: `UserMapper`, `LoginMapper`): Triển khai cho từng đối tượng cụ thể

## Cách sử dụng

### 1. Inject mapper vào service

```java
@Service
@AllArgsConstructor
public class UserService {
    private final UserMapper userMapper;
    
    // ...
}
```

### 2. Chuyển đổi từ Entity sang DTO

```java
// Chuyển đổi một entity thành DTO
ResUserDTO userDto = userMapper.toDto(user);

// Chuyển đổi danh sách entities thành danh sách DTO
List<ResUserDTO> userDtos = userMapper.toDto(users);
```

### 3. Chuyển đổi từ DTO sang Entity 

```java
// Tạo entity mới từ DTO
User user = userMapper.toEntity(userDto);

// Chuyển đổi danh sách DTO thành danh sách entities
List<User> users = userMapper.toEntity(userDtos);
```

### 4. Cập nhật Entity từ DTO

```java
// Áp dụng thông tin từ DTO vào entity đã tồn tại
User existingUser = userRepository.findById(id).orElseThrow();
userMapper.partialUpdate(userDto, existingUser);
userRepository.save(existingUser);
```

### 5. Chuyển đổi với tham số bổ sung

```java
// Ví dụ: LoginMapper sử dụng đa tham số 
ResLoginDTO loginResponse = loginMapper.toResLoginDTO(user, jwtToken);
```

## Tạo mapper mới

1. Tạo interface mapper mới trong package `vn.vuhoang.backend_springboot.mapper`
2. Sử dụng annotation `@Mapper(componentModel = "spring", uses = {})`
3. Định nghĩa các phương thức mapping cần thiết
4. Sử dụng `@Mapping` để tùy chỉnh việc ánh xạ các trường không tương đồng tên

Ví dụ:

```java
@Mapper(componentModel = "spring", uses = {})
public interface NewEntityMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "targetField", source = "sourceField")
    NewEntity toEntity(NewEntityDTO dto);
    
    NewEntityDTO toDto(NewEntity entity);
}
```

## Xử lý các trường hợp phức tạp

### Mapping trường có kiểu dữ liệu khác nhau

```java
@Mapper(componentModel = "spring", uses = {})
public interface ProductMapper {
    
    @Mapping(target = "price", source = "priceInCents")
    ProductDTO toDto(Product product);
    
    default BigDecimal centsToDollars(Long cents) {
        return cents == null ? null : new BigDecimal(cents).divide(new BigDecimal(100));
    }
}
```

### Mapping các đối tượng lồng nhau

```java
@Mapper(componentModel = "spring", uses = {CategoryMapper.class})
public interface ProductMapper {
    
    @Mapping(target = "category", source = "category")
    ProductDTO toDto(Product product);
} 