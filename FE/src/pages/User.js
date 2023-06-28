import React, { useContext } from 'react';

import 'boxicons';
import { AuthContext } from '../context/auth-context';
import { useNavigate } from 'react-router-dom';
import NeedLogin from './NeedLogin';
import { Modal, message } from 'antd';

const naverLogin = process.env.PUBLIC_URL + '/naver_logo.png';
const kakaoLogin = process.env.PUBLIC_URL + '/kakao_logo.png';

const User = (props) => {
    const fandom = process.env.REACT_APP_FANDOM;
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const logout = () => {
        auth.logout();
        navigate("/login");
    }

    async function requestWithdraw(){
        const response = await fetch(process.env.REACT_APP_BACKEND_URL + `/login/auth/${auth.platform}/disconnect`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth.token}`,
            },
        });

        if(!response.ok) {
            message.warning('오류가 발생했어요');
        } else {
            const result = await response.json();
            if(result && result.status === 'OK') {
                message.success('탈퇴가 완료되었어요');
                auth.logoutNoMessage();
                navigate('/');
            } else {
                message.warning('오류가 발생했어요');
            }
        }
    }

    const showDeleteModal = () => {
        Modal.confirm({
            title: '회원 탈퇴',
            content: 
                <div>
                    <p>정말로 탈퇴 하시겠어요?</p>
                    <p className="small-font">만들었던 스케줄은 사라지지 않으며 언제든지 다시 회원가입할 수 있어요</p>
                </div>,
            okText: "탈퇴",
            cancelText: "취소",
            closable: false,
            maskClosable: true,
            centered: true,
            onOk: requestWithdraw,
        });
    };

    if(auth.token) {
        return (
            <div className="login-wrap">
                <div className="login-title">
                    <h2>{fandom}<span>님</span></h2>
                </div>
                <div className="login-buttons">
                    {auth.platform === 'kakao' &&
                        <div className="login-button kakao" onClick={logout}>
                            <img src={kakaoLogin} alt="카카오 로고"/>
                            <span>로그아웃</span>
                        </div>
                    }
                    {auth.platform === 'naver' &&
                        <div className="login-button naver" onClick={auth.logout}>
                            <img src={naverLogin} alt="네이버 로고"/>
                            <span>로그아웃</span>
                        </div>
                    }
                    <div className="login-button" onClick={showDeleteModal}>
                        <box-icon name="user" />
                        <span>회원 탈퇴</span>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <NeedLogin/>
        )
    }
}

export default User;