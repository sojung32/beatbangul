import { Skeleton } from 'antd';
import React from 'react';

const TimeLineLoading = () => {
    return (
        <div className="loading-wrap">
            <div className="loading-time">
                <Skeleton.Input active size='small'/>
            </div>
            <div className="loading-content">
                <div className="loading-type">
                    <Skeleton.Button active size='small'/>
                    <Skeleton.Avatar active size='small'/>
                    <Skeleton.Avatar active size='small'/>
                    <Skeleton.Avatar active size='small'/>
                </div>
                <div className="loading-title">
                    <Skeleton.Input active size='small'/>
                    <Skeleton.Input active/>
                </div>
            </div>
        </div>
    )
}

export { TimeLineLoading };