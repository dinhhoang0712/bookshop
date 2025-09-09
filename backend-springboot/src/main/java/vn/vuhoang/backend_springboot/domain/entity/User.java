package vn.vuhoang.backend_springboot.domain.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.*;
import vn.vuhoang.backend_springboot.constant.RoleEnum;

import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String fullName;
    private String email;
    private String password;
    private String phone;

    @Enumerated(EnumType.STRING)
    private RoleEnum role;

    private String avatar;
    private String providerId;

    private boolean isActive;
    private Instant createdAt;
    private Instant updatedAt;

    @Column(name = "google_id")
    private String googleId;

    @Column(name = "auth_provider")
    private String authProvider;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    List<Order> orders;
}
