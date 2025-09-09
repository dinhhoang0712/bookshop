package vn.vuhoang.backend_springboot.utils;

import com.nimbusds.jose.util.Base64;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Component;
import vn.vuhoang.backend_springboot.domain.dto.response.ResLoginDTO;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collections;

@Slf4j
@Component
public class SecurityUtil {
    public static final MacAlgorithm JWT_MAC = MacAlgorithm.HS512;

    @Value("${vuhoang.jwt.base64.secret}")
    private String jwtToken;

    @Value("${vuhoang.jwt.access-token-validity-in-seconds}")
    private long accessTokenExpiration;

    @Value("${vuhoang.jwt.refresh-token-validity-in-seconds}")
    private long refreshTokenExpiration;

    public SecretKey getSecretKey() {
        byte[] bytes = Base64.from(jwtToken).decode();
        return new SecretKeySpec(bytes, 0, bytes.length, SecurityUtil.JWT_MAC.getName());
    }

    public Jwt checkValidToken(String token) {
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withSecretKey(getSecretKey()).macAlgorithm(SecurityUtil.JWT_MAC)
                .build();
        try {
            return jwtDecoder.decode(token);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw e;
        }
    }

    public String createAccessToken(String email, ResLoginDTO.UserDTO userDTO, JwtEncoder jwtEncoder) {
        Instant now = Instant.now();
        Instant validity = now.plus(this.accessTokenExpiration, ChronoUnit.SECONDS);

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuedAt(now)
                .expiresAt(validity)
                .subject(email)
                .claim("user", userDTO)
                .claim("authorities", Collections.singletonList(userDTO.getRole().name()))
                .build();

        JwsHeader jwsHeader = JwsHeader.with(JWT_MAC).build();
        return jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();

    }

    public String createRefreshToken(String email, ResLoginDTO.UserDTO dto, JwtEncoder jwtEncoder) {
        Instant now = Instant.now();
        Instant validity = now.plus(this.refreshTokenExpiration, ChronoUnit.SECONDS);

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuedAt(now)
                .expiresAt(validity)
                .subject(email)
                .claim("user", dto)
                .claim("authorities", Collections.singletonList(dto.getRole().name()))
                .build();

        JwsHeader jwsHeader = JwsHeader.with(JWT_MAC).build();
        return jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();

    }
}
