import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './index.less';
import HeaderLeft from './headerLeft';
import HeaderRight from './headerRight';
import Bus from '@utils/eventBus';
import { global$ } from '@hooks/useGlobal/global';
import SvgLogo1 from '@assets/logo/runner_dark';
import SvgLogo2 from '@assets/logo/runner_white';
import Tabs from './Tabs';

const Header = () => {
    // const team_id = useSelector((store) => store.user.team_id);
    const theme = useSelector((store) => store.user.theme);

    return (
        <div className='header-menus-panel'>
            {/* <div className='header-left'> */}

            <HeaderLeft />
            <div className="header-center">
                <Tabs />
            </div>
            {/* </div> */}
            {/* <div className='header-right'> */}
            <HeaderRight />
            {/* </div> */}
        </div>
    )
};

export default Header;