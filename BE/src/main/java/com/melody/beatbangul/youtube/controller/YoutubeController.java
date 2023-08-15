package com.melody.beatbangul.youtube.controller;

import com.melody.beatbangul.common.model.MyMap;
import com.melody.beatbangul.youtube.service.YoutubeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;
import java.util.List;

@RestController
@RequestMapping(value = "youtube")
public class YoutubeController {

    @Autowired
    private YoutubeService youtubeService;

    @Scheduled(cron = "0 5 0 * * *") // 초 분 시 일 월 요일
    public void saveYoutube() {
        List<MyMap> channelList = youtubeService.selectYoutubeLinkedChannelList();

        for(MyMap channel : channelList) {
            youtubeService.getTodayVideoListByChannel(channel.get("channelId").toString());
        }
    }
}
