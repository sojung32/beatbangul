package com.melody.beatbangul.login.model;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class TokenInfo {
    private String grantType;
    private String accessToken;
    private String refreshToken;
    private Long refreshTokenExpirationTime;
}
