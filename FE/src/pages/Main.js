import React, { Suspense } from 'react';

import { TimeLineItem } from '../components/TimeLineItem';
import { Await, defer, useLoaderData } from 'react-router-dom';
import { TimeLineLoading } from '../components/LoadingItem';
import { message } from 'antd';

const Main = () => {
    const {mainSchedule, fixedSchedule} = useLoaderData();
    
    return (
        <div className="main">
            <div className="main-items">
                <div className="main-item">
                    <h3>오늘의 스케줄</h3>
                    <div id="today-schedule">
                        <Suspense fallback={<TimeLineLoading/>}>
                            <Await resolve={mainSchedule}>
                                {(loadMain) => <TimeLineItem schedules={loadMain}/>}
                            </Await>
                        </Suspense>
                    </div>
                </div>
                <div className="main-item">
                    <h3>고정 스케줄</h3>
                    <div id="fix-schedule">
                        <Suspense fallback={<TimeLineLoading/>}>
                            <Await resolve={fixedSchedule}>
                                {(loadFixed) => <TimeLineItem fixed={true} schedules={loadFixed}/>}
                            </Await>
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Main;

async function loadMainSchedules() {
    const today = new Date();
    const todayDate = today.getFullYear() + (today.getMonth() < 9 ? '0' : '') + (today.getMonth() + 1) + (today.getDate() < 10 ? '0' : '') + today.getDate();
    
    try {
        const response = await fetch(process.env.REACT_APP_BACKEND_URL + `/schedule/list?date=${todayDate}`, {method: 'GET'});

        if(!response.ok) {
            throw new Error("response error");
        } else {
            const data = await response.json();
            return data;
        }
    } catch(error) {
        message.warning('오류가 발생했어요');
    }
}

async function loadFixedSchedules() {
    try {
        const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/schedule/fixed', {method: 'GET'});

        if(!response.ok) {
            throw new Error("response error");
        } else {
            const data = await response.json();
            return data;
        }
    } catch(error) {
        message.warning('오류가 발생했어요');
    }
}

export function loader() {
    return defer({
        mainSchedule: loadMainSchedules(),
        fixedSchedule: loadFixedSchedules(),
    });
}