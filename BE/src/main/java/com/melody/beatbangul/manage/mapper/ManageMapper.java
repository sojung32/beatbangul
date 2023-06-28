package com.melody.beatbangul.manage.mapper;

import com.melody.beatbangul.common.model.MyMap;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ManageMapper {

    List<MyMap> selectCodeListByGroupCode(String groupCode);
}
