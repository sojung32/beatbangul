package com.melody.beatbangul.login.mapper;

import com.melody.beatbangul.login.model.UserDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.Optional;

@Mapper
public interface LoginMapper {

    int insertUserInfo(UserDTO user);
    int updateUserInfo(UserDTO user);
    int updateUserDisconnect(int userId);

    Optional<UserDTO> selectUserInfoByProvideId(String provideId);

}
