package com.melody.beatbangul.login.service;

import com.melody.beatbangul.login.mapper.LoginMapper;
import com.melody.beatbangul.login.model.UserDTO;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
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
@Primary
public class NaverLoginService extends LoginService {

    @Value("${oauth.naver.authUrl}")
    private String NAVER_AUTH_URL;
    @Value("${oauth.naver.tokenUrl}")
    private String NAVER_TOKEN_URL;
    @Value("${oauth.naver.infoUrl}")
    private String NAVER_INFO_URL;
    @Value("${oauth.naver.clientId}")
    private String NAVER_CLIENT_ID;
    @Value("${oauth.naver.clientSecret}")
    private String NAVER_CLIENT_SECRET;
    @Value("${oauth.naver.state}")
    private String NAVER_STATE;
    @Value("${oauth.naver.redirectUrl}")
    private String NAVER_REDIRECT_URI;
    private final RestTemplate restTemplate;
    @Autowired
    LoginMapper loginMapper;


    public NaverLoginService() {
        restTemplate = new RestTemplate();
        restTemplate.setRequestFactory(new HttpComponentsClientHttpRequestFactory());
    }

    public String getRedirectUrl() throws UnsupportedEncodingException {
        String url = NAVER_AUTH_URL;
        url += "?client_id=" + NAVER_CLIENT_ID;
        url += "&redirect_uri=" + URLEncoder.encode(NAVER_REDIRECT_URI, Charset.defaultCharset().name());
        url += "&state=" + URLEncoder.encode(NAVER_STATE, Charset.defaultCharset().name());
        url += "&response_type=code";

        return url;
    }

    public UserDTO socialLogin(String code, String state) throws UnsupportedEncodingException {
        ResponseEntity<String> tokenResponse = getAccessToken(code, state);
        JSONObject tokenJson = new JSONObject(tokenResponse.getBody());

        ResponseEntity<String> userInfo = getUserInfo(tokenJson.get("access_token").toString());
        UserDTO user = mergeUserInfo(userInfo, tokenJson.get("refresh_token").toString());

        return user;
    }

    protected ResponseEntity<String> getAccessToken(String code, String state) throws UnsupportedEncodingException {

        MultiValueMap<String, Object> paramMap = new LinkedMultiValueMap<>();

        paramMap.add("grant_type", "authorization_code");
        paramMap.add("code", code);
        paramMap.add("client_id", NAVER_CLIENT_ID);
        paramMap.add("client_secret", NAVER_CLIENT_SECRET);
        paramMap.add("state", URLEncoder.encode(state, Charset.defaultCharset().name()));

        HttpHeaders header = new HttpHeaders();
        header.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        header.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        HttpEntity httpEntity = new HttpEntity(paramMap, header);

        ResponseEntity<String> response = restTemplate.postForEntity(NAVER_TOKEN_URL, httpEntity, String.class);

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

        ResponseEntity<String> response = restTemplate.postForEntity(NAVER_INFO_URL, httpEntity, String.class);

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

            JSONObject response = (JSONObject) info.get("response");
            user = loginMapper.selectUserInfoByProvideId(response.get("id").toString());
            loginUser.setProvideRefreshToken(refreshToken);
            loginUser.setServiceType("naver");
            loginUser.setProvideId(response.get("id").toString());

            if (user.isEmpty()) {
                loginMapper.insertUserInfo(loginUser);
            } else {
                loginMapper.updateUserInfo(loginUser);
            }
        }

        return loginUser;
    }
}
