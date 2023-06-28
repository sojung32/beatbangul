import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Tabs } from 'antd';
import Notice from './Notice';

const Introduce = (props) => {
    const navigate = useNavigate();

    const group = process.env.REACT_APP_GROUP;
    const fandom = process.env.REACT_APP_FANDOM;

    const subPage = props.subPage ? props.subPage : 'introduce';

    const tabItems = [
        {
            label: '빗방울 소개',
            key: 'introduce',
            children: 
                <div className="introduce-wrap">
                    <h2>빗방울 소개</h2>
                    <div className="introduce-explain">
                        <h1>{group} 스케줄 저장소, 빗방울</h1>
                        <p>빗방울에서는 누구나 <strong>{group}</strong>의 스케줄을 확인하고 관리할 수 있어요</p>
                        <p>스케줄 추가와 수정, 삭제는 로그인 후에 가능하고 만들어진 스케줄은 다른 <strong>{fandom}</strong>나 관리자에 의해 수정이나 삭제될 수 있어요</p>
                        <p>무분별한 데이터 생성과 삭제를 예방하기 위해 회원가입이 필요해요</p>
                        <p>회원가입과 로그인은 네이버와 카카오를 통해 간편하게 이용할 수 있어요</p>
                        <p>회원 식별을 목적으로만 회원 정보를 사용하기 때문에 네이버와 카카오에서 제공하는 회원 식별 번호 외 별도의 개인정보는 저장하지 않아요</p>
                    </div>
                </div>
        },
        {
            label: '공지사항',
            key: 'notice',
            children: <Notice/>
        },
        {
            label: '사이트맵',
            key: 'sitemap',
            children: 
                <div className="introduce-wrap">
                    <h2>사이트맵</h2>
                    <span className="dark wide">
                        <Link to="/"><h3>메인</h3></Link>
                        <Link to="/calendar"><h3>스케줄 달력</h3></Link>
                        <Link to="/introduce"><h3>빗방울 소개</h3></Link>
                        <Link to="/notice"><h3>공지사항</h3></Link>
                    </span>
                </div>
        },
    ];

    const tabClick = (key, event) => {
        navigate('/' + key);
    }

    return (
        <Tabs 
            defaultActiveKey={subPage}
            activeKey={subPage}
            centered
            items={tabItems}
            onTabClick={tabClick}
        />
    )
}

export default Introduce;