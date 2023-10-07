import React from 'react'
import SettingsAndAsserts from '../SettingsAndAsserts';
import DataWithdrawItem from './dataWithdrawItem';

const DataWithdraw = (props) => {
  const { data, onChange } = props;
  console.log(data, "OpenPagepropsdata");
  const data_withdraw = data?.action_detail?.data_withdraw || {};
  return (
    <>
      <DataWithdrawItem data={data_withdraw} onChange={(val) => {
        onChange({ ...data, action_detail: { data_withdraw: val } })
      }} />
      <SettingsAndAsserts data={data} onChange={onChange} hiddenDataWithdraw={true} />
    </>
  )
}
export default DataWithdraw;