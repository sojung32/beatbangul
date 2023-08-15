package com.melody.beatbangul.schedule.service;

import com.melody.beatbangul.common.model.MyMap;
import com.melody.beatbangul.schedule.mapper.ScheduleMapper;
import com.melody.beatbangul.schedule.model.ScheduleDTO;
import com.melody.beatbangul.youtube.mapper.YoutubeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ScheduleService {

    @Autowired
    ScheduleMapper scheduleMapper;

    @Autowired
    YoutubeMapper youtubeMapper;

    public MyMap getScheduleInfoById(int scheduleId) {
        return scheduleMapper.selectScheduleInfoById(scheduleId).orElse(null);
    }

    public MyMap getFixedInfoById(int scheduleId) {
        return scheduleMapper.selectFixedInfoById(scheduleId).orElse(null);
    }

    public List<MyMap> getFixedList() {
        return scheduleMapper.selectFixedList();
    }

    public MyMap getAnniversaryInfoById(int scheduleId) {
        return scheduleMapper.selectAnniversaryInfoById(scheduleId).orElse(null);
    }

    public Map<String, Object> getScheduleListByDate(String date) {
        Map<String, Object> map = new HashMap<>();
        map.put("birthday", scheduleMapper.selectBirthDayListByDate(date));
        map.put("schedule", scheduleMapper.selectScheduleListByDate(date));
        map.put("anniversary", scheduleMapper.selectAnniversaryListByDate(date));
        map.put("youtube", youtubeMapper.selectYoutubeListByDate(date));
        map.put("date", date);

        return map;
    }

    public List<MyMap> getScheduleListOfMonth(String month) {
        return scheduleMapper.selectScheduleCalendar(month);
    }

    public Map<String, Object> getScheduleListOfMonthByType(String month) {
        Map<String, Object> schedules = new HashMap<>();
        schedules.put("schedule", scheduleMapper.selectScheduleCalendarSchedule(month));
        schedules.put("all", scheduleMapper.selectScheduleCalendarAll(month));
        schedules.put("youtube", scheduleMapper.selectScheduleCalendarYoutube(month));
        return schedules;
    }

    public int saveSchedule(ScheduleDTO schedule) {
        return scheduleMapper.insertSchedule(schedule);
    }

    public int saveFixedSchedule(ScheduleDTO schedule) {
        int result = scheduleMapper.insertFixedSchedule(schedule);
        Map<String, Object> param = new HashMap<>();
        param.put("id", schedule.getScheduleId());
        param.put("chooseDate", null);
        scheduleMapper.callProcedureCreateSchedule(param);
        return result;
    }

    public int saveAnniversary(ScheduleDTO schedule) {
        return scheduleMapper.insertAnniversary(schedule);
    }

    public int updateSchedule(ScheduleDTO schedule) {
        return scheduleMapper.updateSchedule(schedule);
    }

    public int updateFixedSchedule(ScheduleDTO schedule) {
        return scheduleMapper.updateFixedSchedule(schedule);
    }

    public int updateAnniversary(ScheduleDTO schedule) {
        return scheduleMapper.updateAnniversary(schedule);
    }

    public int deleteSchedule(MyMap param) {
        return scheduleMapper.deleteSchedule(Integer.parseInt(param.get("id").toString()));
    }

    public int deleteFixedSchedule(MyMap param) {
        return scheduleMapper.deleteFixedSchedule(Integer.parseInt(param.get("id").toString()));
    }

    public int deleteAnniversary(MyMap param) {
        return scheduleMapper.deleteAnniversary(Integer.parseInt(param.get("id").toString()));
    }

}