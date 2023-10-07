import { Select } from '@arco-design/web-react';
import React from 'react'
import SettingsAndAsserts from '../SettingsAndAsserts';
import AssertItem from './assertItem';

const Assert = (props) => {
  const { data, onChange } = props;
  console.log(data, "OpenPagepropsdata");
  const assert = data?.action_detail?.assert || {};
  return (
    <>
      <AssertItem data={assert} onChange={(val) => {
        onChange({ ...data, action_detail: { assert: val } })
      }} />
      <SettingsAndAsserts data={data} onChange={onChange} hiddenAssert={true}/>
    </>
  )
}
export default Assert;