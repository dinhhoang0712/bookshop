package vn.vuhoang.backend_springboot.config;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import vn.vuhoang.backend_springboot.exception.UserNotActivatedException;
import vn.vuhoang.backend_springboot.service.UserService;

import java.util.Collections;

@Component("userDetailsService")
public class UserDetailsCustom implements UserDetailsService {
    private final UserService userService;

    public UserDetailsCustom(UserService userService) {
        this.userService = userService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        vn.vuhoang.backend_springboot.domain.entity.User user = userService.getUserByEmail(username);
        if (user == null) {
            throw new UsernameNotFoundException("Tài khoản hoặc mật khẩu không đúng");
        }
        if (!user.isActive()) {
            throw new UserNotActivatedException("Tài khoản chưa được xác thực");
        }

        SimpleGrantedAuthority authorities = new SimpleGrantedAuthority(user.getRole().name());

        return new User(user.getEmail(), user.getPassword(), Collections.singletonList(authorities));
    }
}
