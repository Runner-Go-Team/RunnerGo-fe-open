import { Tabs } from '@arco-design/web-react';
import React from 'react'
import Settings from './settings';
import Asserts from './asserts';
import DataWithdraw from './dataWithdraw';
import './index.less'
import { isArray, isPlainObject } from 'lodash';

const TabPane = Tabs.TabPane;
const SettingsAndAsserts = (props) => {
  const { data, onChange, hiddenAssert = false,hiddenDataWithdraw = false } = props;

  return (
    <Tabs className={'settings-and-asserts'} defaultActiveTab='1'>
      <TabPane key='1' title='设置'>
        <Settings onChange={(newSettings) => {
          onChange({ ...data, settings: newSettings })
        }} data={isPlainObject(data?.settings) ? data.settings : {}} />
      </TabPane>
      {!hiddenAssert && (<TabPane key='2' title='断言'>
        <Asserts onChange={(newAsserts) => {
          onChange({ ...data, asserts: newAsserts })
        }} data={isArray(data?.asserts) ? data.asserts : []} />
      </TabPane>)}
      {!hiddenDataWithdraw && <TabPane key='3' title='关联提取'>
        <DataWithdraw onChange={(newDataWithdraw) => {
          onChange({ ...data, data_withdraws: newDataWithdraw })
        }} data={isArray(data?.data_withdraws) ? data.data_withdraws : []} />
      </TabPane>}
    </Tabs>
  )
}
export default SettingsAndAsserts;