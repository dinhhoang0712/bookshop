package vn.vuhoang.backend_springboot.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import vn.vuhoang.backend_springboot.constant.RoleEnum;
import vn.vuhoang.backend_springboot.service.CustomOAuth2UserService;
import vn.vuhoang.backend_springboot.utils.SecurityUtil;

import java.util.Arrays;

@Configuration
@EnableMethodSecurity(securedEnabled = true)
public class SecurityConfiguration {

        private final CustomOAuth2UserService customOAuth2UserService;
        private final OAuth2SuccessHandler successHandler;
        private final JwtAuthenticationConverter jwtAuthenticationConverter;

        public SecurityConfiguration(
                        CustomOAuth2UserService customOAuth2UserService,
                        OAuth2SuccessHandler successHandler,
                        JwtAuthenticationConverter jwtAuthenticationConverter) {
                this.customOAuth2UserService = customOAuth2UserService;
                this.successHandler = successHandler;
                this.jwtAuthenticationConverter = jwtAuthenticationConverter;
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();

                configuration.setAllowedOrigins(
                                Arrays.asList("http://localhost:3000", "http://localhost:4173",
                                                "http://localhost:5173"));

                configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

                configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept", "x-no-retry",
                                "delay", "upload-type"));

                configuration.setAllowCredentials(true);

                configuration.setMaxAge(3600L);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http,
                        CustomAuthenticationEntryPoint customAuthenticationEntryPoint,
                        CustomAccessDeniedHandler customAccessDeniedHandler) throws Exception {
                String[] whiteList = {
                                "/api/v1",
                                "/api/v1/auth/login",
                                "/api/v1/auth/refresh",
                                "/api/v1/auth/register",
                                "/image/**",
                                "/file/upload",
                                "/api/v1/database/category",
                                "/api/v1/confirm-email/**",
                                "/auth2/**",
                                "/login/oauth2/code/google"

                };
                String[] urlAdmins = {
                                "/api/v1/users",
                                "/api/v1/books"
                };

                http
                                .csrf(c -> c.disable())
                                .cors(Customizer.withDefaults())
                                .authorizeHttpRequests(authz -> authz
                                                .requestMatchers(whiteList).permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/v1/books/**").permitAll()
                                                .requestMatchers(HttpMethod.PUT, "/api/v1/users").permitAll()
                                                .requestMatchers(urlAdmins).hasAuthority(RoleEnum.ADMIN.name())
                                                .anyRequest().authenticated())
                                .oauth2ResourceServer(oauth2 -> oauth2
                                                .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter))
                                                .authenticationEntryPoint(customAuthenticationEntryPoint)
                                                .accessDeniedHandler(customAccessDeniedHandler))
                                .exceptionHandling(ex -> ex
                                                .authenticationEntryPoint(customAuthenticationEntryPoint)
                                                .accessDeniedHandler(customAccessDeniedHandler))
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .oauth2Login(oauth2 -> oauth2
                                                .authorizationEndpoint(authorization -> authorization
                                                                .baseUri("/auth2/authorize"))
                                                .successHandler(successHandler)
                                                .userInfoEndpoint(userInfo -> userInfo
                                                                .userService(customOAuth2UserService)))
                                .formLogin(f -> f.disable());

                return http.build();
        }
}