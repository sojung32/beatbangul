package com.melody.beatbangul.schedule.mapper;

import com.melody.beatbangul.common.model.MyMap;
import com.melody.beatbangul.schedule.model.ScheduleDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Mapper
public interface ScheduleMapper {

    /* 조회 */
    Optional<MyMap> selectScheduleInfoById(int id);
    Optional<MyMap> selectFixedInfoById(int id);
    Optional<MyMap> selectAnniversaryInfoById(int id);
    List<MyMap> selectFixedList();
    List<MyMap> selectBirthDayListByDate(String date);
    List<MyMap> selectAnniversaryListByDate(String date);
    List<MyMap> selectScheduleListByDate(String date);
    List<MyMap> selectScheduleCalendar(String date);
    List<MyMap> selectScheduleCalendarSchedule(String date);
    List<MyMap> selectScheduleCalendarAll(String date);
    List<MyMap> selectScheduleCalendarYoutube(String date);

    /* 삽입 */
    int insertSchedule(ScheduleDTO schedule);
    int insertFixedSchedule(ScheduleDTO schedule);
    int insertAnniversary(ScheduleDTO schedule);
    void callProcedureCreateSchedule(Map<String, Object> param);

    /* 수정 */
    int updateSchedule(ScheduleDTO schedule);
    int updateFixedSchedule(ScheduleDTO schedule);
    int updateAnniversary(ScheduleDTO schedule);

    /* 삭제 */
    int deleteSchedule(int id);
    int deleteFixedSchedule(int id);
    int deleteAnniversary(int id);
}
