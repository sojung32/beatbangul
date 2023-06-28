package com.melody.beatbangul.manage.service;

import com.melody.beatbangul.common.model.MyMap;
import com.melody.beatbangul.manage.mapper.ManageMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ManageService {

    @Autowired
    ManageMapper manageMapper;

    public List<MyMap> getCodeListByGroupCode(String groupCode) {
        return manageMapper.selectCodeListByGroupCode(groupCode);
    }
}
