import React from 'react';

import 'boxicons';
import { Timeline } from 'antd';
import ScheduleItem from './ScheduleItem';
import { HeartFilled, StarFilled, CalendarOutlined, YoutubeFilled } from '@ant-design/icons';

const TimeLineItemSet = (props) => {
    const fixed = props.fixed && props.fixed != null ? props.fixed : false;
    const schedules = props.schedules ? props.schedules : null;
    const fixedSchedule = schedules && schedules.fixed ? schedules.fixed : null;
    const schedule = schedules && schedules.schedule ? schedules.schedule : null;
    const anniversary = schedules && schedules.anniversary ? schedules.anniversary : null;
    const youtube = schedules && schedules.youtube ? schedules.youtube : null;
    const birthday = schedules && schedules.birthday ? schedules.birthday : null;
    const deleteFunction = props.delete ? props.delete : null;
    const reloadFunction = props.reloadFunction ? props.reloadFunction : null;
    const selectDate = props.selectDate ? props.selectDate : null;
    const dateTitle = props.dateTitle ? props.dateTitle : null;
    const weekly = props.weekly || false;
    
    const items = [];

    if(fixed) {
        for(const idx in fixedSchedule) {
            items.push({
                children: <ScheduleItem 
                            fixed={true}
                            sched={true}
                            type="F"
                            id={fixedSchedule[idx].id}
                            title={fixedSchedule[idx].title} 
                            category={fixedSchedule[idx].category}
                            categoryName={fixedSchedule[idx].categoryName}
                            categoryColor={fixedSchedule[idx].categoryColor}
                            categoryBack={fixedSchedule[idx].categoryBackcolor}
                            time={fixedSchedule[idx].time}
                            day={fixedSchedule[idx].day}
                            week={fixedSchedule[idx].week}
                            note={fixedSchedule[idx].note}
                            sek={fixedSchedule[idx].sek}
                            lmh={fixedSchedule[idx].lmh}
                            lcs={fixedSchedule[idx].lcs}
                            ihs={fixedSchedule[idx].ihs}
                            sdg={fixedSchedule[idx].sdg}
                            ysj={fixedSchedule[idx].ysj}
                        />
            });
        }

    } else {
        for(const idx in birthday) {
            items.push({
                color: 'red',
                dot: <HeartFilled/>,
                children: <ScheduleItem 
                            fixed={false}
                            sched={false}
                            title={birthday[idx].title} 
                            time={birthday[idx].time}
                            note={birthday[idx].note}
                        />
            });
        }
        for(const idx in schedule) {
            let style = null;
            if(weekly && idx == schedule.length - 1) {
                style = {paddingBottom: 20};
            }

            items.push({
                children: <ScheduleItem 
                            fixed={false}
                            sched={true}
                            type="S"
                            id={schedule[idx].id}
                            title={schedule[idx].title} 
                            date={schedule[idx].date}
                            category={schedule[idx].category}
                            categoryName={schedule[idx].categoryName}
                            categoryColor={schedule[idx].categoryColor}
                            categoryBack={schedule[idx].categoryBackcolor}
                            time={schedule[idx].time}
                            note={schedule[idx].note}
                            link={schedule[idx].link}
                            sek={schedule[idx].sek}
                            lmh={schedule[idx].lmh}
                            lcs={schedule[idx].lcs}
                            ihs={schedule[idx].ihs}
                            sdg={schedule[idx].sdg}
                            ysj={schedule[idx].ysj}
                            delete={deleteFunction}
                            reloadFunction={reloadFunction}
                            selectDate={selectDate}
                            dateTitle={dateTitle}
                            style={style}
                        />
            });
        }
        for(const idx in anniversary) {
            items.push({
                color: 'gold',
                dot: <StarFilled/>,
                children: <ScheduleItem 
                            fixed={false}
                            sched={false}
                            type="A"
                            id={anniversary[idx].id}
                            title={anniversary[idx].title} 
                            date={anniversary[idx].date}
                            time={anniversary[idx].time}
                            note={anniversary[idx].note}
                            delete={deleteFunction}
                        />
            });
        }
        for(const idx in youtube) {
            items.push({
                color: '#c4302b',
                dot: <YoutubeFilled />,
                children: <ScheduleItem 
                            fixed={false}
                            sched={false}
                            youtube={true}
                            title={youtube[idx].title}
                            link={youtube[idx].link}
                        />,
                className: 'youtube',
            });
        }
    }

    return items;
}

const TimeLineItem = (props) => {
    const items = TimeLineItemSet(props);
    
    return (
        <React.Fragment>
            {items.length > 0 ? 
                <Timeline items={items} /> 
                : 
                <div className="no-schedule-wrap">
                    <box-icon name='calendar-x' animation='tada' color={`${process.env.REACT_APP_MAIN_COLOR}`} size='lg'/>
                    <p>스케줄이 없어요</p>
                </div>
            }
        </React.Fragment>
    )
}

const TimeLineList = (props) => {
    const scheduleList = props.list ? props.list : null;
    const weeklyList = [];

    scheduleList.forEach(schedule => {
        const dailyList = [];
        dailyList.push({
            dot: <CalendarOutlined />,
            children: <h3 className="schedule-date-title" style={{margin: 0}}>{schedule.date}</h3>,
            className: 'date',
        });
        if(schedule.list.schedule.length > 0) {
            dailyList.push(...TimeLineItemSet({schedules:schedule.list, weekly:true}));
        } else {
            dailyList.push({
                children: <span>스케줄이 없어요</span>,
            });
        }
        weeklyList.push(dailyList);
    });
    
    return (
        <React.Fragment>
            {weeklyList.map(daily => (
                <Timeline items={daily} /> 
            ))}
        </React.Fragment>
    )
}

export { TimeLineItem, TimeLineList };