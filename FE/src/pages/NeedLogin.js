import React from 'react';

import { Button, Result } from 'antd';

const NeedLogin = (props) => {
    return (
        <div className="error-wrap">
            <Result
                status="warning"
                title="로그인이 필요해요"
                extra={
                    <div className="error-button">
                        <Button type="default" href="/login">로그인 하러가기</Button>
                    </div>
                }
            />
        </div>
    )
}

export default NeedLogin;