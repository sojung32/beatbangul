package com.melody.beatbangul.notice.service;

import com.melody.beatbangul.common.model.MyMap;
import com.melody.beatbangul.notice.mapper.NoticeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoticeService {

    @Autowired
    NoticeMapper noticeMapper;

    public List<MyMap> getNoticeList(int page) {
        return noticeMapper.selectNoticeList(page);
    }

    public int getNoticeTotal() {
        return noticeMapper.selectNoticeTotal();
    }

}
