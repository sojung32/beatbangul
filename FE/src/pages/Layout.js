import React, { useState } from 'react';

import { Outlet } from 'react-router-dom';
import { FloatingLogo, FloatingMenu } from '../components/FloatingButton';
import Footer from '../components/Footer';

const spinnerImg = process.env.PUBLIC_URL + '/spinner.svg';

const Layout = (props) => {
    const [spinner, setSpinnerShow] = useState(false);

    return (
        <React.Fragment>
            <header>
                <FloatingLogo/>
                <FloatingMenu/>
            </header>
            {spinner ? 
                <div className="spinner-wrap">
                    <div className="spinner-component">
                        <img src={spinnerImg} alt="spinner loading"/>
                    </div>
                </div>
                : null
            }
            <div className="main">
                <main>
                    <Outlet context={[spinner, setSpinnerShow]}/>
                </main>
                <footer>
                    <Footer/>
                </footer>
            </div>
        </React.Fragment>
    )
}

export default Layout;