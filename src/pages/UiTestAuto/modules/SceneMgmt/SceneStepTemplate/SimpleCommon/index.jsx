import React from 'react'
import SettingsAndAsserts from '../SettingsAndAsserts';

const SimpleCommon = (props) => {
  const { data, onChange } = props;
  return (
    <>
      <div className='runnerGo-card-special'>
       
      </div>
      <SettingsAndAsserts data={data} onChange={onChange} />
    </>
  )
}
export default SimpleCommon;