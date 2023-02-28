import React from "react";
import SvgInvitate1 from '@assets/logo/invitateExpire_white';
import SvgInvitate2 from '@assets/logo/invitateExpire_dark';
import './index.less';
import { useSelector } from 'react-redux';

const InvitateExpire = () => {
    const theme = useSelector((store) => store.user.theme);
    return (
        <div className="invitate-expire">
            { theme === 'dark' ? <SvgInvitate2 /> : <SvgInvitate1 /> }
        </div>
    )
}

export default InvitateExpire;