package com.melody.beatbangul.login.controller;

import com.melody.beatbangul.login.model.UserDTO;
import com.melody.beatbangul.login.service.KakaoLoginService;
import com.melody.beatbangul.login.service.LoginService;
import com.melody.beatbangul.login.service.NaverLoginService;
import com.melody.beatbangul.security.jwt.TokenProvider;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(value = "login")
@RequiredArgsConstructor
public class LoginController {

    @Autowired
    private LoginService loginService;
    @Autowired
    private KakaoLoginService kakaoLoginService;
    @Autowired
    private NaverLoginService naverLoginService;

    private final TokenProvider tokenProvider;

    @GetMapping(value = "{platform}")
    public void socialLogin(@PathVariable(name = "platform") String platform, HttpServletResponse response) throws IOException {

        String openUrl = "";

        switch(platform) {
            case "kakao":
                openUrl = kakaoLoginService.getRedirectUrl();
                break;
            case "naver":
        	default:
            	openUrl = naverLoginService.getRedirectUrl();
            	break;
        }

        response.sendRedirect(openUrl);
    }

    @GetMapping(value = "auth/{platform}")
    public Map<String, Object> getAuth(@PathVariable(name = "platform") String platform,
                               @RequestParam(name = "code", required = false) String code,
                               @RequestParam(name = "state", required = false) String state,
                               @RequestParam(name = "error", required = false) String error,
                               @RequestParam(name = "error_description", required = false) String description) throws UnsupportedEncodingException {

        Map<String, Object> returnMap = new HashMap<>();
        UserDTO loginUser = new UserDTO();

        switch(platform) {
            case "kakao":
                if(code != null && !"".equals(code)) {
                    loginUser = kakaoLoginService.socialLogin(code, "");
                } else {
                    returnMap.put("status", HttpStatus.NO_CONTENT);
                    return returnMap;
                }
                break;
            case "naver":
        	default:
        		if(error == null || "".equals(error)) {
                    loginUser = naverLoginService.socialLogin(code, state);
        		} else {
                    returnMap.put("status", HttpStatus.NO_CONTENT);
                    return returnMap;
                }
        		break;
        }

        Authentication authentication = new UsernamePasswordAuthenticationToken(loginUser.getProvideId(), loginUser.getUserId());

        String token = tokenProvider.generateToken(authentication);
        returnMap.put("token", token);
        returnMap.put("status", HttpStatus.OK);

        return returnMap;
    }

}
