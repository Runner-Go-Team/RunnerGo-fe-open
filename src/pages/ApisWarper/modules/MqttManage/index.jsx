import React, { useState, useEffect, useRef } from "react";
import './index.less';
import MqttHeader from "./MqttHeader";
import MqttRequest from "./MqttRequest";
import MqttResponse from "./MqttResponse";
import ScalePanelTwoItem from "@components/ScalePanelTwoItem";

const MqttManage = (props) => {
    const { data = {}, onChange } = props;
    const scaleRef = useRef(null);
    const wrapperRef = useRef(null);

    return (
        <div className="mqtt-manage">
            <MqttHeader data={data} onChange={onChange} />
            <div style={{ flex: 1 }} ref={wrapperRef}>
                <ScalePanelTwoItem
                    ref={scaleRef}
                    direction={-1}
                    refWrapper={wrapperRef}
                    leftMin={<></>}
                    left={
                        <MqttRequest data={data} onChange={onChange} />
                    }
                    rightMin={<></>}
                    right={
                        <MqttResponse />
                    }
                />
            </div>
        </div>
    )
};

export default MqttManage;