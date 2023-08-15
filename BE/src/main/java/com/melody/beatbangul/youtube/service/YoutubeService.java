package com.melody.beatbangul.youtube.service;

import com.google.api.client.googleapis.json.GoogleJsonResponseException;
import com.google.api.client.http.HttpRequestInitializer;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.youtube.YouTube;
import com.google.api.services.youtube.model.*;
import com.melody.beatbangul.common.model.MyMap;
import com.melody.beatbangul.youtube.mapper.YoutubeMapper;
import com.melody.beatbangul.youtube.model.YoutubeDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.time.ZoneId;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;

@Service
public class YoutubeService {

    private static final HttpTransport HTTP_TRANSPORT = new NetHttpTransport();
    private static final JsonFactory JSON_FACTORY = new JacksonFactory();
    private static final long NUMBER_OF_VIDEOS_RETURNED = 50;
    private static YouTube youtube;

    @Value("${youtube.api.key}")
    private String apiKey;

    @Autowired
    private YoutubeMapper youtubeMapper;

    public List<MyMap> selectYoutubeLinkedChannelList() {
        return youtubeMapper.selectYoutubeLinkedChannelList();
    }

    public String getTodayVideoListByChannel(String channelId) {
        Date today = new Date();

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
        Calendar calendarStart = Calendar.getInstance(TimeZone.getTimeZone("Asia/Seoul"));
        calendarStart.setTime(today);
        calendarStart.add(Calendar.DATE, -1);
        calendarStart.setTimeZone(TimeZone.getTimeZone(ZoneId.of("UTC")));
        String startDate = dateFormat.format(calendarStart.getTime());

        Calendar calendarEnd = Calendar.getInstance(TimeZone.getTimeZone("Asia/Seoul"));
        calendarEnd.setTime(today);
        calendarEnd.setTimeZone(TimeZone.getTimeZone(ZoneId.of("UTC")));
        String endDate = dateFormat.format(calendarEnd.getTime());

        return getVideoListByChannel(channelId, startDate, endDate);
    }

    /* 날짜 기준으로 채널의 영상정보 가져오기 */
    public void getVideoListByChannel(String channelId, String startDate, String endDate) {
        try {
            youtube = new YouTube.Builder(HTTP_TRANSPORT, JSON_FACTORY, new HttpRequestInitializer() {
                @Override
                public void initialize(com.google.api.client.http.HttpRequest request) throws IOException {
                }
            }).setApplicationName("youtube-videoList-byChannel").build();

            YouTube.Search.List search = youtube.search().list("id");
            search.setKey(apiKey);
            search.setChannelId(channelId);
            search.setMaxResults(NUMBER_OF_VIDEOS_RETURNED);
            search.setOrder("date");
            search.setType("video");

            DateTime startDateTime = DateTime.parseRfc3339(startDate);
            DateTime endDateTime = DateTime.parseRfc3339(endDate);

            search.setPublishedBefore(endDateTime);
            search.setPublishedAfter(startDateTime);

            SearchListResponse searchResponse = search.execute();

            List<SearchResult> searchResultList = searchResponse.getItems();

            for(SearchResult searchResult : searchResultList) {
                getVideoInfoByVideoId(searchResult.getId().getVideoId());
            }

        } catch (GoogleJsonResponseException e) {
            System.err.println("There was a service error: " + e.getDetails().getCode() + " : "
                    + e.getDetails().getMessage());
        } catch (IOException e) {
            System.err.println("There was an IO error: " + e.getCause() + " : " + e.getMessage());
        } catch (Throwable t) {
            t.printStackTrace();
        }
    }

    public void getVideoInfoByVideoId(String videoId) {
        try {
            youtube = new YouTube.Builder(HTTP_TRANSPORT, JSON_FACTORY, new HttpRequestInitializer() {
                @Override
                public void initialize(com.google.api.client.http.HttpRequest request) throws IOException {
                }
            }).setApplicationName("youtube-video-api").build();

            YouTube.Videos.List videos = youtube.videos().list("snippet");
            videos.setKey(apiKey);
            videos.setId(videoId);

            VideoListResponse response = videos.execute();

            YoutubeDTO youtubeInfo = new YoutubeDTO();
            youtubeInfo.setYoutubeId(response.getItems().get(0).getId());
            youtubeInfo.setYoutubeChannelId(response.getItems().get(0).getSnippet().getChannelId());
            youtubeInfo.setYoutubeTitle(response.getItems().get(0).getSnippet().getTitle());
            youtubeInfo.setYoutubeLink("https://www.youtube.com/watch?v=" + youtubeInfo.getYoutubeId());

            DateTime dateTime = response.getItems().get(0).getSnippet().getPublishedAt();
            Date setDate = new Date(dateTime.getValue());
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone(ZoneId.of("UTC")));
            calendar.setTime(setDate);
            calendar.setTimeZone(TimeZone.getTimeZone("Asia/Seoul"));
            youtubeInfo.setYoutubeDt(dateFormat.format(calendar.getTime()));

            youtubeMapper.insertYoutube(youtubeInfo);
        } catch (GoogleJsonResponseException e) {
            System.err.println("There was a service error: " + e.getDetails().getCode() + " : "
                    + e.getDetails().getMessage());
        } catch (IOException e) {
            System.err.println("There was an IO error: " + e.getCause() + " : " + e.getMessage());
        } catch (Throwable t) {
            t.printStackTrace();
        }
    }
}
