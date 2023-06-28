import React, { useContext } from 'react';

import 'boxicons';
import { FloatButton } from 'antd';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/auth-context';

const logo = process.env.PUBLIC_URL + '/beatbangul.png';

const scrollToTop = () => {
    document.getElementsByClassName("main")[0].scrollTo({top: 0, behavior: 'smooth'});
}

const FloatingMenu = (props) => {
    const auth = useContext(AuthContext);

    return (
        <nav>
            <FloatButton.Group
                trigger="click"
                type='primary'
                style={{
                    right: 20,
                    bottom: 20,
                    position: 'absolute',
                }}
                icon={<box-icon name="dots-vertical-rounded" animation="tada-hover" color="white"/>}
            >
                <FloatButton icon={<box-icon name="arrow-to-top" />} onClick={scrollToTop} />
                {auth.isLoggedIn ?
                    <FloatButton icon={<Link to="/user"><box-icon name="user" /></Link>} />
                    : <FloatButton icon={<Link to="/login"><box-icon name="user" /></Link>} />
                }
                <FloatButton icon={<Link to="/calendar"><box-icon name="calendar-check" /></Link>} />
                {auth.isLoggedIn &&
                    <FloatButton icon={<Link to="/form"><box-icon name="calendar-plus" /></Link>} />
                }
                <FloatButton icon={<Link to="/introduce"><box-icon name="info-circle" /></Link>} />
            </FloatButton.Group>
        </nav>
    )
}

const FloatingLogo = () => {
    return (
        <Link to="/">
            <FloatButton className="logo-button" icon={<img className="logo" src={logo} alt="logo"/>}
                style={{
                    left: 10,
                    top: 10,
                    position: 'absolute',
                }} />
        </Link>
    )
}

export { FloatingMenu, FloatingLogo };