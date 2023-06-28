package com.melody.beatbangul.security.jwt;

import com.melody.beatbangul.login.model.UserDTO;
import com.melody.beatbangul.login.service.LoginService;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.io.Encoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SecurityException;
import io.jsonwebtoken.security.SignatureException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.stream.Collectors;

@Component
public class TokenProvider implements InitializingBean {

    private static final Logger logger = LoggerFactory.getLogger(TokenProvider.class);

    @Autowired
    private LoginService loginService;

    private String AUTHORITY = "melody";
    private long ACCESS_TOKEN_EXPIRE_TIME = 60 * 60 * 24 * 1000;

    private Key key;
    private String secretKey;

    public TokenProvider(@Value("${jwt.secret.key}") String secretKey) {
        this.secretKey = secretKey;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(Authentication authentication) {
        UserDTO user = loginService.getUserByProvideId(authentication.getPrincipal().toString()).get();
        String loginId = user.getProvideId() + user.getServiceType().charAt(0);
        Date now = new Date();

        Claims claims = Jwts.claims();
        claims.put("auth", AUTHORITY);
        claims.put("user", loginId);
        claims.put("expire", new Date(now.getTime() + ACCESS_TOKEN_EXPIRE_TIME));

        return Jwts.builder()
                .setSubject(loginId)
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + ACCESS_TOKEN_EXPIRE_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Authentication getAuthentication(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        String provideId = claims.get("user").toString();
        provideId = provideId.substring(0, provideId.length()-1);
        UserDTO userInfo = loginService.getUserByProvideId(provideId).get();

        User principal = new User(provideId, Integer.toString(userInfo.getUserId()), AuthorityUtils.createAuthorityList());

        return new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
    }

    public String getLoginIdFromToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (SecurityException | MalformedJwtException e) {
            logger.error("Invalid JWT Token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("Expired JWT Token: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("Unsupported Jwt Token: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }

        return false;
    }

}
