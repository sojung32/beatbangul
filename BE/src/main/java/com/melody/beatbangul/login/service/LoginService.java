package com.melody.beatbangul.login.service;

import com.melody.beatbangul.login.mapper.LoginMapper;
import com.melody.beatbangul.login.model.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public abstract class LoginService {

    @Autowired
    private LoginMapper loginMapper;

    public abstract String getRedirectUrl() throws Exception;
    public abstract UserDTO socialLogin(String code, String state) throws Exception;
    protected abstract ResponseEntity<String> getAccessToken(String code, String state) throws Exception;
    protected abstract ResponseEntity<String> getUserInfo(String accessToken);
    protected abstract UserDTO mergeUserInfo(ResponseEntity<String> userInfo, String refreshToken);

    public Optional<UserDTO> getUserByProvideId(String provideId) {
        return loginMapper.selectUserInfoByProvideId(provideId);
    }

}
