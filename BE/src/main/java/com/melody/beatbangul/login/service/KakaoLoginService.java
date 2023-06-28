package com.melody.beatbangul.login.service;

import com.melody.beatbangul.login.mapper.LoginMapper;
import com.melody.beatbangul.login.model.UserDTO;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.util.Collections;
import java.util.Optional;

@Service
public class KakaoLoginService extends LoginService {

    @Value("${oauth.kakao.authUrl}")
    private String KAKAO_AUTH_URL;
    @Value("${oauth.kakao.tokenUrl}")
    private String KAKAO_TOKEN_URL;
    @Value("${oauth.kakao.infoUrl}")
    private String KAKAO_INFO_URL;
    @Value("${oauth.kakao.clientId}")
    private String KAKAO_CLIENT_ID;
    @Value("${oauth.kakao.clientSecret}")
    private String KAKAO_CLIENT_SECRET;
    @Value("${oauth.kakao.redirectUrl}")
    private String KAKAO_REDIRECT_URI;
    private final RestTemplate restTemplate;
    @Autowired
    LoginMapper loginMapper;


    public KakaoLoginService() {
        restTemplate = new RestTemplate();
        restTemplate.setRequestFactory(new HttpComponentsClientHttpRequestFactory());
    }

    public String getRedirectUrl() {
        String url = KAKAO_AUTH_URL;
        url += "?client_id=" + KAKAO_CLIENT_ID;
        url += "&redirect_uri=" + KAKAO_REDIRECT_URI;
        url += "&response_type=code";

        return url;
    }

    public UserDTO socialLogin(String code, String state) throws UnsupportedEncodingException {
        ResponseEntity<String> tokenResponse = getAccessToken(code, "");
        JSONObject tokenJson = new JSONObject(tokenResponse.getBody());

        ResponseEntity<String> userInfo = getUserInfo(tokenJson.get("access_token").toString());
        UserDTO user = mergeUserInfo(userInfo, tokenJson.get("refresh_token").toString());

        return user;
    }

    protected ResponseEntity<String> getAccessToken(String code, String state) throws UnsupportedEncodingException {

        MultiValueMap<String, Object> paramMap = new LinkedMultiValueMap<>();

        paramMap.add("grant_type", "authorization_code");
        paramMap.add("code", code);
        paramMap.add("client_id", KAKAO_CLIENT_ID);
        paramMap.add("client_secret", KAKAO_CLIENT_SECRET);
        paramMap.add("redirect_uri", KAKAO_REDIRECT_URI);

        HttpHeaders header = new HttpHeaders();
        header.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        header.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        HttpEntity httpEntity = new HttpEntity(paramMap, header);

        ResponseEntity<String> response = restTemplate.postForEntity(KAKAO_TOKEN_URL, httpEntity, String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            return response;
        }
        return null;
    }

    protected ResponseEntity<String> getUserInfo(String accessToken) {
        MultiValueMap<String, Object> paramMap = new LinkedMultiValueMap<>();
        paramMap.add("secure_resource", "");
        paramMap.add("property_keys", "");

        HttpHeaders header = new HttpHeaders();
        header.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        header.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        header.add("Authorization", "Bearer " + accessToken);

        HttpEntity httpEntity = new HttpEntity(paramMap, header);

        ResponseEntity<String> response = restTemplate.postForEntity(KAKAO_INFO_URL, httpEntity, String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            return response;
        }
        return null;
    }

    protected UserDTO mergeUserInfo(ResponseEntity<String> userInfo, String refreshToken) {

        UserDTO loginUser = new UserDTO();

        if (userInfo != null && !"".equals(userInfo)) {
            JSONObject info = new JSONObject(userInfo.getBody());
            Optional<UserDTO> user;

            user = loginMapper.selectUserInfoByProvideId(info.get("id").toString());
            loginUser.setProvideRefreshToken(refreshToken);
            loginUser.setServiceType("kakao");
            loginUser.setProvideId(info.get("id").toString());

            if (user.isEmpty()) {
                loginUser.setConnectDt(info.get("connected_at").toString());

                loginMapper.insertUserInfo(loginUser);
            } else {
                loginMapper.updateUserInfo(loginUser);
            }
        }

        return loginUser;
    }
}
