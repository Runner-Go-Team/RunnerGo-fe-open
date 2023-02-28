import React from "react";
import './index.less';
import { useTranslation } from 'react-i18next';
import { Tabs as TabComponent } from 'adesign-react';
import ContrastContent from './contrastContent';
import ContrastMonitor from './contrastMonitor';
import { TabStyle } from './style';

const { Tabs, TabPan } = TabComponent;

const ContrastDetail = (props) => {
    const { list1, list2, list3, list4 } = props;

    const { t } = useTranslation();

    const defaultList = [
        { id: '1', title: t('report.tabList.0'), content: <ContrastContent list1={list1} list2={list2} list3={list3} /> },
        // { id: '2', title: t('report.tabList.2'), content: <ContrastMonitor list4={list4} /> },
    ];

    return (
        <div className="contrast-detail">
            <Tabs className={TabStyle} defaultActiveId="1">
                {defaultList.map((d) => (
                    <TabPan key={d.id} id={d.id} title={d.title}>
                        {d.content}
                    </TabPan>
                ))}
            </Tabs>
        </div>
    )
};

export default ContrastDetail;