import React, { useContext, useEffect } from 'react';

import 'boxicons';
import { message } from 'antd';
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/auth-context';

const naverLogin = process.env.PUBLIC_URL + '/naver_logo.png';
const kakaoLogin = process.env.PUBLIC_URL + '/kakao_logo.png';

const Login = () => {
    const platform = useParams().platform;
    const [searchParams, setSearchParams] = useSearchParams();
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const navigate = useNavigate();

    const auth = useContext(AuthContext);

    useEffect(() => {
        const login = async () => {
            const response = await fetch(process.env.REACT_APP_BACKEND_URL + `/login/auth/${platform}?platform=${platform}&code=${code}&state=${state}`, {method: 'GET'});

            if(!response.ok) {
                message.warning('오류가 발생했어요');
            } else {
                const result = await response.json();
                if(result && result.status === 'OK') {
                    auth.login(result.token, platform);
                    navigate("/");
                } else {
                    message.warning('오류가 발생했어요');
                }
            }
        }
        if(platform === 'kakao' || platform === 'naver') {
            login();
        }
    }, [searchParams, platform]);


    if(auth.token) {
        return <Navigate to="/user" replace/>
    } else {
        return (
            <div className="login-wrap">
                <div className="login-title">
                    <h2>로그인</h2>
                </div>
                <div className="login-buttons">
                    <Link to={`${process.env.REACT_APP_BACKEND_URL}/login/naver`}>
                        <div className="login-button naver">
                            <img src={naverLogin} alt="네이버 로고"/>
                            <span>네이버 로그인</span>
                        </div>
                    </Link>
                    <Link to={`${process.env.REACT_APP_BACKEND_URL}/login/kakao`}>
                        <div className="login-button kakao">
                            <img src={kakaoLogin} alt="카카오 로고"/>
                            <span>카카오 로그인</span>
                        </div>
                    </Link>
                </div>
            </div>
        )
    }
}

export default Login;