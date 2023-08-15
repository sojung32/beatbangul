import React, { useContext, useEffect, useState } from 'react';

import 'boxicons';
import dayjs from 'dayjs';
import { ConfigProvider, Calendar as CalendarItem, Button, message, DatePicker, Modal } from 'antd';
import locale from "antd/locale/ko_KR";
import 'dayjs/locale/ko';
import { TimeLineItem } from '../components/TimeLineItem';
import { TimeLineLoading } from '../components/LoadingItem';
import { useOutletContext, useParams } from 'react-router-dom';
import { AuthContext } from '../context/auth-context';
import FormItem from '../components/FormItem';

const Calendar = () => {
    const [spinner, setSpinnerShow] = useOutletContext();
    const auth = useContext(AuthContext);
    const params = useParams();

    const paramYear = params.year;
    const paramMonth = params.month ? params.month : 1;
    const paramDate = params.date ? params.date : 1;

    const today = paramYear ? new Date(Number(paramYear), Number(paramMonth)-1, Number(paramDate)) : new Date();
    const initMonth = today.getFullYear() + '년 ' + (today.getMonth() + 1) + '월';
    const initDate = today.getFullYear() + (today.getMonth() < 9 ? '-0' : '-') + (today.getMonth() + 1) + (today.getDate() < 10 ? '-0' : '-') + today.getDate();
    const defaultDate = dayjs(initDate, 'YYYY-MM-DD');
    const [dateTitle, setDateTitle] = useState(initMonth);
    const [datePicker, setDatePicker] = useState();
    const [schedDateList, setSchedDate] = useState([]);
    const [youtubeDateList, setYoutubeDate] = useState([]);
    const [allDateList, setAllDate] = useState([]);

    const [events, setEventArea] = useState(null);
    const [selectDate, setSelectDate] = useState(today.getFullYear() + '년 ' + (today.getMonth() < 9 ? '0' : '') + (today.getMonth() + 1) + '월 ' + today.getDate() + '일');

    const [isLoading, setIsLoading] = useState(false);

    const [addModalOpen, setAddModalOpen] = useState(false);
    
    // 스케줄 추가 팝업
    const showAddModal = async () => {
        setAddModalOpen(true);
    }
    const clickAddModal = () => {
        setAddModalOpen(false);
    };

    // 달력 제목
    function changeDateTitle(dayjs) {
        setDateTitle(dayjs.year() + '년 ' + (dayjs.month()+1) + '월');
        setDatePicker(dayjs);
    }

    // 달력 변경 시 스케줄 여부 확인
    function updateEvents(dayjs) {
        let calDate = dayjs.year() + '-' + (dayjs.month() < 9 ? '0' : '') + (dayjs.month()+1) + '-' + (dayjs.date() < 10 ? '0' : '') + dayjs.date();
        let sched;

        if(schedDateList.includes(calDate)) {
            sched = <box-icon type="solid" name="droplet" animation="fade-down-hover" color={`${process.env.REACT_APP_MAIN_COLOR}`} size="18px"/>;
        }
        if(allDateList.includes(calDate)) {
            sched = <box-icon type="solid" name="droplet" animation="fade-down-hover" color="#9575CD" size="18px"/>;
        }
        if(youtubeDateList.includes(calDate)) {
            sched = <box-icon type="solid" name="droplet" animation="fade-down-hover" color="#F06292" size="18px"/>;
        }

        return (
            <React.Fragment>
                {sched ? sched : null}
            </React.Fragment>
        );
    }

    // 날짜 선택
    function showEvents(dayjs){
        setSelectDate(dayjs.year() + '년 ' + (dayjs.month() < 9 ? '0' : '') + (dayjs.month()+1) + '월 ' + (dayjs.date() < 10 ? '0' : '') + dayjs.date() + '일');
    }
    
    useEffect(() => {
        const fetchMonthSchedules = async (dateTitle) => {
            setSpinnerShow(true);
            const yearNum = dateTitle.split(" ")[0].replaceAll(/[^0-9]/gi, '');
            const monthNum = dateTitle.split(" ")[1].replaceAll(/[^0-9]/gi, '');
            const fullMonth = yearNum + (monthNum < 10 ? '0' : '') + monthNum;

            try {
                const response = await fetch(process.env.REACT_APP_BACKEND_URL + `/schedule/calendar?month=${fullMonth}`, {method: 'GET'});
    
                if(!response.ok) {
                    throw new Error("response error");
                } else {
                    const data = await response.json();
                    const schedList = data.schedule.schedule.map(item => {
                        return item.date;
                    });
                    const youtubeList = data.schedule.youtube.map(item => {
                        return item.date;
                    });
                    const allList = data.schedule.all.map(item => {
                        return item.date;
                    });
                    setSchedDate(schedList);
                    setYoutubeDate(youtubeList);
                    setAllDate(allList);
                }
            } catch(error) {
                message.warning('오류가 발생했어요');
            }
            setSpinnerShow(false);
        }

        fetchMonthSchedules(dateTitle);
    }, [dateTitle]);

    useEffect(() => {
        const fetchScheduleList = async (selectDate) => {
            setIsLoading(true);

            if(selectDate === null) {
                const todayDate = today.getFullYear() + '년 '+ (today.getMonth() < 9 ? '0' : '') + (today.getMonth() + 1) + '월 ' + (today.getDate() < 10 ? '0' : '') + today.getDate() + '일';
                setSelectDate(todayDate);
            }
            const selectedDate = String(selectDate).replaceAll(/[^0-9]/gi, '');

            try {
                const response = await fetch(process.env.REACT_APP_BACKEND_URL + `/schedule/list?date=${selectedDate}`, {method: 'GET'});
    
                if(!response.ok) {
                    throw new Error("response error");
                } else {
                    const data = await response.json();
                    setEventArea(data);
                }
            } catch(error) {
                message.warning('오류가 발생했어요');
            }
            setIsLoading(false);
        }

        fetchScheduleList(selectDate);
    }, [selectDate]);

    async function deleteSchedule(id, type) {
        const response = await fetch(process.env.REACT_APP_BACKEND_URL + `/schedule/delete?id=${id}&type=${type}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${auth.token}`,
            },
        });
    
        if(!response.ok) {
            message.warning('오류가 발생했어요');
        } else {
            const result = await response.json();
            if(result && result.status === 'OK'){
                message.success('삭제되었어요');
                setSelectDate(selectDate + ' ');
                setDateTitle(dateTitle + ' ');
            } else {
                message.warning('오류가 발생했어요');
            }
        }
    }

    const reloadFunction = (selectDate, dateTitle) => {
        setSelectDate(selectDate + ' ');
        setDateTitle(dateTitle + ' ');
    }

    return (
        <div className="event-calendar">
            <ConfigProvider locale={locale}
                theme={{token:{lineHeightSM: 0, lineHeightLG: 1}}}>
                <CalendarItem 
                    mode='month' 
                    defaultValue={defaultDate}
                    onPanelChange={changeDateTitle}
                    onSelect={showEvents}
                    cellRender={(current) => updateEvents(current)}
                    headerRender={({ value, type, onChange, onTypeChange }) => {
                    let change = value.clone();
                    const date = change.$d;

                    return (
                        <div className="calendar-title">
                            <Button type="text" shape="circle" icon={<box-icon name='chevrons-left' ></box-icon>}
                                onClick={() => {
                                    const changeDate = new Date(date.setFullYear(date.getFullYear() - 1));
                                    change = change.year(changeDate.getFullYear());
                                    change = change.month(changeDate.getMonth())
                                    onChange(change);
                                    changeDateTitle(change);
                                }}
                            />
                            <Button type="text" shape="circle" icon={<box-icon name='chevron-left' ></box-icon>}
                                onClick={() => {
                                    const changeDate = new Date(date.setMonth(date.getMonth() - 1));
                                    change = change.year(changeDate.getFullYear());
                                    change = change.month(changeDate.getMonth())
                                    onChange(change);
                                    changeDateTitle(change);
                                }}
                            />
                            <DatePicker 
                                picker="month" 
                                bordered={false} 
                                format="YYYY년 M월" 
                                inputReadOnly 
                                allowClear={false}
                                suffixIcon={null}
                                className="calendar-date-title"
                                defaultValue={dayjs(dateTitle, 'YYYY년 M월')}
                                onChange={(date) => {
                                    onChange(date);
                                    changeDateTitle(date);
                                }}
                                value={datePicker}
                            />
                            <Button type="text" shape="circle" icon={<box-icon name='chevron-right' ></box-icon>}
                                onClick={() => {
                                    const changeDate = new Date(date.setMonth(date.getMonth() + 1));
                                    change = change.year(changeDate.getFullYear());
                                    change = change.month(changeDate.getMonth())
                                    onChange(change);
                                    changeDateTitle(change);
                                }}
                            />
                            <Button type="text" shape="circle" icon={<box-icon name='chevrons-right' ></box-icon>}
                                onClick={() => {
                                    const changeDate = new Date(date.setFullYear(date.getFullYear() + 1));
                                    change = change.year(changeDate.getFullYear());
                                    change = change.month(changeDate.getMonth())
                                    onChange(change);
                                    changeDateTitle(change);
                                }}
                            />
                        </div>
                    )
                }}/>
                <div className="time-list">
                    {selectDate ?
                        <React.Fragment>
                            <div className="time-list-title">
                                <h3>{selectDate} 스케줄</h3>
                                {auth.isLoggedIn &&
                                    <React.Fragment>
                                        <Button type="text" size="large" shape="circle" onClick={showAddModal} icon={<box-icon name='calendar-plus'/>}/>
                                        <Modal 
                                            title="스케줄 추가" 
                                            open={addModalOpen} 
                                            bodyStyle={{maxHeight: 500, overflow: 'auto'}}
                                            maskClosable={false}
                                            closable={false}
                                            centered={true}
                                            footer={null}
                                            destroyOnClose={true}
                                        >
                                            <FormItem 
                                                create={true}
                                                cancel={clickAddModal} 
                                                reloadFunction={reloadFunction} 
                                                selectDate={selectDate}
                                                dateTitle={dateTitle}/>
                                        </Modal>
                                    </React.Fragment>
                                }
                            </div>
                            {isLoading ? 
                                <React.Fragment>
                                    <TimeLineLoading/>
                                    <TimeLineLoading/>
                                </React.Fragment>
                                : <TimeLineItem 
                                    schedules={events} 
                                    delete={deleteSchedule} 
                                    reloadFunction={reloadFunction} 
                                    selectDate={selectDate}
                                    dateTitle={dateTitle}/>
                            }
                        </React.Fragment>
                        : null
                    }
                </div>
            </ConfigProvider>
        </div>
    );
};

export default Calendar;