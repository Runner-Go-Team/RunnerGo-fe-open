import React, { useEffect, useState } from 'react'
import cn from 'classnames';
import BetaSvg from '@assets/img/beta.svg';
import { useLocation, useNavigate } from 'react-router-dom';

const Tabs = () => {
  const location = useLocation();
  const navigate=useNavigate();
  const [active,setActive]=useState('apiTest');
  useEffect(() => {
    try {
      const { pathname } = location;
      if(pathname.split('/')[1] == 'uiTestAuto'){
        setActive('uiTestAuto');
      }else{
        setActive('apiTest');
      }
    } catch (error) {}
}, [location]);
  const tabArr = [{path:'apiTest',name:'API测试'}, 
  {path:'uiTestAuto',name:<div className='runnergo-ui-test-tab-name'><div className='beta'><BetaSvg /></div>UI自动化</div>}];
  return (
    <div className='header-center-tabs'>
      {tabArr.map(item =>
        <div
          onClick={()=>navigate(item.path === 'uiTestAuto' ? item.path : 'index')} 
          key={item.path}
          className={cn('header-center-tabs-item', {
            active: item.path == active
          })}>
          {item.name}
        </div>)}
    </div>
  )
}

export default Tabs;