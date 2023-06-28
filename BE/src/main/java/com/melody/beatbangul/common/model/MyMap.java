package com.melody.beatbangul.common.model;

import org.springframework.jdbc.support.JdbcUtils;

import java.util.HashMap;

public class MyMap extends HashMap<String, Object> {

    @Override
    public Object put(String key, Object value) {
        return super.put(JdbcUtils.convertUnderscoreNameToPropertyName(key), value);
    }
}
