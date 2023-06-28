package com.melody.beatbangul.notice.controller;

import com.melody.beatbangul.common.model.MyMap;
import com.melody.beatbangul.notice.service.NoticeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@Tag(name = "notice", description = "공지사항 API")
@RestController
@RequestMapping(value = "notice")
public class NoticeController {

    @Autowired
    private NoticeService noticeService;

    @Operation(summary = "notice list", description = "공지사항 목록 조회")
    @Parameters({
            @Parameter(name = "page", description = "선택 페이지", example = "1")
    })
    @GetMapping("list")
    public Map<String, Object> getNoticeList(@RequestParam(name = "page") int page) {
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("list", noticeService.getNoticeList((page - 1) * 5));
        resultMap.put("total", noticeService.getNoticeTotal());

        return resultMap;
    }

}
