import React, { useCallback, useEffect, useState } from 'react';

import { Collapse, message } from 'antd';
import { useInView } from 'react-intersection-observer';
import { useOutletContext } from 'react-router-dom';

const { Panel } = Collapse;

const Notice = (props) => {
    const [spinner, setSpinnerShow] = useOutletContext();
    const [noticeList, setNoticeList] = useState([]);
    const [page, setPage] = useState(1);
    const [noticeEnd, setNoticeEnd] = useState(false);

    const { ref, inView } = useInView({threshold: 0, initialInView: true});

    const fetchNoticeList = useCallback(async() => {
        setSpinnerShow(true);
        
        try {
            const response = await fetch(process.env.REACT_APP_BACKEND_URL + `/notice/list?page=${page}`, {method: 'GET'});

            if(!response.ok) {
                throw new Error("response error");
            } else {
                const data = await response.json();
                if(page * 5 > data.total) {
                    setNoticeEnd(true);
                }
                if(data.list) {
                    setNoticeList(prev => [...prev, ...data.list]);
                }
            }
        } catch (error) {
            message.warning('오류가 발생했어요');
        }
        setSpinnerShow(false);
    }, [page]);

    
    useEffect(() => {
        fetchNoticeList();
    }, [fetchNoticeList]);

    useEffect(() => {
        if(inView && !noticeEnd && !spinner) {
            setPage(prev => prev + 1);
        }
    }, [inView, spinner]);

    return (
        <div className="notice-wrap">
            <h2>공지사항</h2>
            <div className="notice-items">
                <Collapse ghost>
                    {noticeList.map(item => (
                        <Panel 
                            header={
                                <div className="notice-header">
                                    <div className="notice-title">{item.title}</div>
                                    <div className="notice-date">{item.date}</div>
                                </div>
                            } 
                            key={item.id}>
                            <div className="notice-content" dangerouslySetInnerHTML={{__html:item.contents}}></div>
                        </Panel>
                    ))}
                </Collapse>
            </div>
            {!noticeEnd && <div ref={ref}></div>}
        </div>
    )
}

export default Notice;