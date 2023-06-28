package com.melody.beatbangul.notice.mapper;

import com.melody.beatbangul.common.model.MyMap;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Optional;

@Mapper
public interface NoticeMapper {

    List<MyMap> selectNoticeList(int page);
    int selectNoticeTotal();
}
