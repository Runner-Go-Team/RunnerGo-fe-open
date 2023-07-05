import React, { useState, useEffect, useRef } from "react";
import './index.less';
import TcpHeader from "./TcpHeader";
import TcpRequest from "./TcpRequest";
import TcpResponse from "./TcpResponse";
import ScalePanelTwoItem from "@components/ScalePanelTwoItem";


const TcpManage = (props) => {
    const { data, onChange } = props;
    const scaleRef = useRef(null);
    const wrapperRef = useRef(null);

    return (
        <div className="tcp-manage">
            <TcpHeader data={data} onChange={onChange} />
            <div style={{ flex: 1, overflow: 'overlay' }} ref={wrapperRef}>
                <ScalePanelTwoItem
                    ref={scaleRef}
                    direction={-1}
                    refWrapper={wrapperRef}
                    leftMin={<></>}
                    left={
                        <TcpRequest data={data} onChange={onChange} />
                    }
                    rightMin={<></>}
                    right={
                        <TcpResponse />
                    }
                />
            </div>

        </div>
    )
};

export default TcpManage;