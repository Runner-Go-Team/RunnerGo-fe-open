import React, { useEffect, useState } from 'react';
import LeftBar from './LeftBar';
import { LoginWrapper } from './style';


const Login = (props) => {
    const { children } = props;
    const [leftShow, setLeftShow] = useState(true);

    const onWindowResize = ({ currentTarget }) => {
        if (currentTarget.innerWidth < 1200) {
            setLeftShow(false);
        } else {
            setLeftShow(true);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', onWindowResize);
        const firstSize = window.innerWidth;
        if (firstSize < 1200) {
            setLeftShow(false);
        } else {
            setLeftShow(true);
        };

        return () => {
            window.removeEventListener('resize', onWindowResize);
        }
    }, []);

    useEffect(() => {
        const url = '/skins/white.css';
        document.querySelector(`link[name="apt-template-link"]`).setAttribute('href', url);
        document.body.removeAttribute('arco-theme');
      }, []);

    return (
        <LoginWrapper>
            {
                leftShow && <LeftBar />
            }
            <div className='right'>
                { children }
            </div>
        </LoginWrapper>
    )
};

export default Login;