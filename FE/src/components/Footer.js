import React from 'react';

import { Button } from 'antd';
import { MailOutlined, TwitterOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div className="footer-wrap">
            <div className="contact">
                <Button shape="circle" size="small" icon={<MailOutlined/>}/>
                <Button shape="circle" size="small" icon={<TwitterOutlined/>}/>
            </div>
            <div>
                <Link to="/"><span>빗방울</span></Link>
                <span> ©2023. All rights reserved.</span>
            </div>
        </div>
    )
}

export default Footer;