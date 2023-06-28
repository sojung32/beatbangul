package com.melody.beatbangul.schedule.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "스케줄 DTO")
public class ScheduleDTO {
    @Schema(description = "스케줄 ID")
    private int scheduleId;
    @Schema(description = "고정 스케줄 ID")
    private int fixedId;
    @Schema(description = "스케줄 날짜")
    private String scheduleDate;
    @Schema(description = "고정 스케줄 기간 시작일")
    private String scheduleStartDate;
    @Schema(description = "고정 스케줄 기간 종료일")
    private String scheduleEndDate;
    @Schema(description = "스케줄 시간")
    private String scheduleTime;
    @Schema(description = "고정 스케줄 요일")
    private String scheduleDay;
    @Schema(description = "고정 스케줄 반복주")
    private String scheduleWeek;
    @Schema(description = "스케줄 카테고리")
    private String scheduleCategory;
    @Schema(description = "스케줄 제목")
    private String scheduleTitle;
    @Schema(description = "스케줄 LINK")
    private String scheduleLink;
    @Schema(description = "스케줄 참고")
    private String scheduleNote;
    @Schema(description = "스케줄 은광 참여")
    private String scheduleEk;
    @Schema(description = "스케줄 민혁 참여")
    private String scheduleMh;
    @Schema(description = "스케줄 창섭 참여")
    private String scheduleCs;
    @Schema(description = "스케줄 현식 참여")
    private String scheduleHs;
    @Schema(description = "스케줄 프니 참여")
    private String scheduleDg;
    @Schema(description = "스케줄 성재 참여")
    private String scheduleSj;
    @Schema(description = "스케줄 수정자")
    private int updateBy;
    @Schema(description = "스케줄 수정일시")
    private String updateDt;

    @Schema(description = "스케줄 타입", allowableValues = {"S", "F", "A"})
    private String scheduleType;
}
