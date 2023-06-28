package com.melody.beatbangul.manage.controller;

import com.melody.beatbangul.manage.service.ManageService;
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

@Tag(name = "manage", description = "관리용 API")
@RestController
@RequestMapping(value = "manage")
public class ManageController {

    @Autowired
    private ManageService manageService;

    @Operation(summary = "code list by group code", description = "그룹 코드로 코드 목록 조회")
    @Parameters({
            @Parameter(name = "code", description = "그룹 코드", example = "CATE")
    })
    @GetMapping(value = "code/list")
    public Map<String, Object> getCodeListByGroupCode(@RequestParam(name = "code") String groupCode) {
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("list", manageService.getCodeListByGroupCode(groupCode));
        return resultMap;
    }
}
