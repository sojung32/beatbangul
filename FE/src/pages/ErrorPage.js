import React from 'react';

import { Result } from 'antd';
import { FloatingLogo, FloatingMenu } from '../components/FloatingButton';
import { FrownOutlined } from '@ant-design/icons';
import Footer from '../components/Footer';

const ErrorPage = () => {
    return (
        <React.Fragment>
            <header>
                <FloatingLogo/>
                <FloatingMenu/>
            </header>
            <div className="main">
                <main>
                    <div className="error-wrap">
                        <Result
                            icon={<FrownOutlined/>}
                            title="서비스에 문제가 발생했어요"
                            extra={
                                <div className="error-message">
                                    <p>해당 페이지가 존재하지 않거나 오류가 발생했어요</p>
                                    <p>잠시 후 다시 시도해주세요</p>
                                    <p>오류가 지속될 경우 관리자에게 문의 부탁드려요</p>
                                </div>
                            }
                        />
                    </div>
                </main>
                <footer>
                    <Footer/>
                </footer>
            </div>
        </React.Fragment>
    );
}

export default ErrorPage;