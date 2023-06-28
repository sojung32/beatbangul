package com.melody.beatbangul.schedule.controller;

import com.melody.beatbangul.common.model.MyMap;
import com.melody.beatbangul.login.model.UserDTO;
import com.melody.beatbangul.login.service.LoginService;
import com.melody.beatbangul.schedule.model.ScheduleDTO;
import com.melody.beatbangul.schedule.service.ScheduleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Tag(name = "schedule", description = "스케줄 API")
@RestController
@RequestMapping(value = "schedule")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    @Autowired
    private LoginService loginService;

    Logger logger = LoggerFactory.getLogger(ScheduleController.class);

    @Operation(summary = "schedule info by id", description = "ID로 스케줄 상세 조회")
    @Parameters({
            @Parameter(name = "id", description = "스케줄 ID", example = "1"),
            @Parameter(name = "type", description = "스케줄 타입(스케줄 S / 기념일 A / 고정 스케줄 F)", example = "S")
    })
    @GetMapping(value = "info")
    public Map<String, Object> getScheduleInfo(@RequestParam(name = "id") int id, @RequestParam(name = "type") String type) {
        Map<String, Object> resultMap = new HashMap<>();

        switch (type) {
            case "F":
                resultMap.put("fixed", scheduleService.getFixedInfoById(id));
                break;
            case "A":
                resultMap.put("anniversary", scheduleService.getAnniversaryInfoById(id));
                break;
            case "S":
            default:
                resultMap.put("schedule", scheduleService.getScheduleInfoById(id));
                break;
        }

        return resultMap;
    }

    @Operation(summary = "schedule list by date", description = "날짜별 스케줄 목록 조회")
    @Parameters({
            @Parameter(name = "date", description = "날짜", example = "20230502")
    })
    @GetMapping(value = "list")
    public Map<String, Object> getScheduleListByDate(@RequestParam(name = "date") String date) {

        return scheduleService.getScheduleListByDate(date);
    }

    @Operation(summary = "schedule list of month", description = "월별 스케줄 목록 조회")
    @Parameters({
            @Parameter(name = "month", description = "선택한 달", example = "202305")
    })
    @GetMapping(value = "calendar")
    public Map<String, Object> getScheduleListOfMonth(@RequestParam(name = "month") String month) {
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("month", month);
        resultMap.put("calendar", scheduleService.getScheduleListOfMonth(month + "01"));

        return resultMap;
    }

    @Operation(summary = "weekly schedule list by date", description = "이번주 스케줄 목록 조회")
    @Parameters({
            @Parameter(name = "date", description = "날짜", example = "20230502")
    })
    @GetMapping(value = "week")
    public List<Map<String, Object>> getWeeklyScheduleListByDate(@RequestParam(name = "date") String date) throws ParseException {

        List<Map<String, Object>> resultMap = new ArrayList<>();

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
        SimpleDateFormat titleFormat = new SimpleDateFormat("yyyy년 MM월 dd일 E요일", Locale.KOREA);
        Date requestDate = dateFormat.parse(date);

        Calendar calendar = Calendar.getInstance();
        calendar.setTime(requestDate);
        calendar.set(Calendar.DAY_OF_WEEK, Calendar.SUNDAY);

        for(int i=0;i<7;i++) {
            calendar.add(Calendar.DATE, 1);

            Map<String, Object> scheduleMap = new HashMap<>();
            scheduleMap.put("date", titleFormat.format(calendar.getTime()));
            scheduleMap.put("list", scheduleService.getScheduleListByDate(dateFormat.format(calendar.getTime())));
            resultMap.add(scheduleMap);
        }

        return resultMap;
    }

    @Operation(summary = "fixed schedule list", description = "고정 스케줄 목록 조회")
    @GetMapping(value = "fixed")
    public Map<String, Object> getFixedScheduleList() {
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("fixed", scheduleService.getFixedList());

        return resultMap;
    }

    @Operation(summary = "save schedule", description = "스케줄 저장")
    @PostMapping(value = "save")
    public Map<String, Object> saveSchedule(@RequestBody ScheduleDTO schedule,
                                            Authentication authentication) {

        User tokenUser = (User) authentication.getPrincipal();
        UserDTO userInfo = loginService.getUserByProvideId(tokenUser.getUsername()).orElse(null);
        schedule.setUpdateBy(userInfo.getUserId());

        Map<String, Object> resultMap = new HashMap<>();
        int result = 0;

        switch (schedule.getScheduleType()) {
            case "F":
                result += scheduleService.saveFixedSchedule(schedule);
                break;
            case "A":
                result += scheduleService.saveAnniversary(schedule);
                break;
            case "S":
            default:
                result += scheduleService.saveSchedule(schedule);
                break;
        }

        if(result > 0) {
            resultMap.put("status", HttpStatus.OK);
        } else {
            resultMap.put("status", HttpStatus.NO_CONTENT);
        }

        return resultMap;
    }

    @Operation(summary = "update schedule", description = "스케줄 수정")
    @PutMapping(value = "update")
    public Map<String, Object> updateSchedule(@RequestBody ScheduleDTO schedule,
                                              Authentication authentication) {
        Map<String, Object> resultMap = new HashMap<>();
        int result = 0;

        User tokenUser = (User) authentication.getPrincipal();
        UserDTO userInfo = loginService.getUserByProvideId(tokenUser.getUsername()).orElse(null);
        schedule.setUpdateBy(userInfo.getUserId());

        switch (schedule.getScheduleType()) {
            case "F":
                result += scheduleService.updateFixedSchedule(schedule);
                break;
            case "A":
                result += scheduleService.updateAnniversary(schedule);
                break;
            case "S":
            default:
                result += scheduleService.updateSchedule(schedule);
                break;
        }

        if(result > 0) {
            resultMap.put("status", HttpStatus.OK);
        } else {
            resultMap.put("status", HttpStatus.NO_CONTENT);
        }

        return resultMap;
    }

    @Operation(summary = "delete schedule", description = "스케줄 삭제")
    @Parameters({
            @Parameter(name = "id", description = "스케줄 ID", example = "1"),
            @Parameter(name = "type", description = "스케줄 타입(스케줄 S / 기념일 A / 고정 스케줄 F)", example = "S")
    })
    @DeleteMapping(value = "delete")
    public Map<String, Object> deleteSchedule(@RequestParam(name = "id") int id, @RequestParam(name = "type") String type,
                                              Authentication authentication) {
        Map<String, Object> resultMap = new HashMap<>();
        int result = 0;

        User tokenUser = (User) authentication.getPrincipal();
        UserDTO userInfo = loginService.getUserByProvideId(tokenUser.getUsername()).orElse(null);

        MyMap param = new MyMap();
        param.put("id", id);
        param.put("updateBy", userInfo.getUserId());

        switch (type) {
            case "F":
                result += scheduleService.deleteFixedSchedule(param);
                break;
            case "A":
                result += scheduleService.deleteAnniversary(param);
                break;
            case "S":
            default:
                result += scheduleService.deleteSchedule(param);
                break;
        }

        if(result > 0) {
            resultMap.put("status", HttpStatus.OK);
        } else {
            resultMap.put("status", HttpStatus.NO_CONTENT);
        }

        return resultMap;
    }

}
