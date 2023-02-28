import React, { useState } from 'react';
import produce from 'immer';
import { Input } from 'adesign-react'

const NodeItem = (props) => {

  const {dataKey, value, onChange,onKeyChange } = props


  const handleChange=(key,newVal)=>{
    onChange(dataKey,{
      ...value,
      [key]:newVal
    })
  }

  const handleKeyChange=(val)=>{
    onKeyChange(dataKey,val);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Input value={dataKey} onChange={handleKeyChange} />
      <Input value={value.phone}  onChange={handleChange.bind(null,'phone')} />
      <Input value={value.birthdate}  onChange={handleChange.bind(null,'birthdate')} />
    </div>
  )
}

export default React.memo(NodeItem)
