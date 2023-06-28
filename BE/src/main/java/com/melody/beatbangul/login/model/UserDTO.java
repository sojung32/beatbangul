package com.melody.beatbangul.login.model;

import lombok.Data;

@Data
public class UserDTO {
    private int userId;
    private String serviceType;
    private String provideId;
    private String connectDt;
    private String provideRefreshToken;

}
