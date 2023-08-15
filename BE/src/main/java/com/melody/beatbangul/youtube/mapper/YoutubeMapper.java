package com.melody.beatbangul.youtube.mapper;

import com.melody.beatbangul.common.model.MyMap;
import com.melody.beatbangul.youtube.model.YoutubeDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface YoutubeMapper {

    List<MyMap> selectYoutubeLinkedChannelList();

    int insertYoutube(YoutubeDTO youtube);
}
