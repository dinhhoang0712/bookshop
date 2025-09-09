package vn.vuhoang.backend_springboot.service;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import vn.vuhoang.backend_springboot.constant.RoleEnum;
import vn.vuhoang.backend_springboot.domain.entity.User;
import vn.vuhoang.backend_springboot.repository.UserRepository;

import java.time.Instant;
import java.util.Optional;

@Service
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {
    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = new DefaultOAuth2UserService().loadUser(userRequest);

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String picture = oAuth2User.getAttribute("picture");
        String sub = oAuth2User.getAttribute("sub");

        // Kiểm tra xem user đã tồn tại chưa
        Optional<User> existingUser = userRepository.findByEmail(email);
        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
            // Có thể update tên/ảnh ở đây nếu muốn
        } else {
            // Nếu chưa có thì lưu
            user = new User();
            user.setEmail(email);
            user.setFullName(name);
            user.setAvatar(picture);
            user.setProviderId(sub);
            user.setRole(RoleEnum.USER);
            user.setCreatedAt(Instant.now());
            user.setActive(true);
            userRepository.save(user);
        }

        return oAuth2User;
    }
}
