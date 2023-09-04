import React, { useState, useEffect } from "react";
import './index.less';
import { Button } from 'adesign-react';
import SqlResult from "./SqlResult";
import SqlAssertResult from "./SqlAssertResult";
import SqlRegularResult from "./SqlRegularResult";
import { useSelector, useDispatch } from 'react-redux';
import NotResponse from "@components/response/responsePanel/notResponse";
import { useTranslation } from 'react-i18next';
import { ResponseSendWrapper } from "@components/response/responsePanel/style";
import { Tabs } from '@arco-design/web-react';

const { TabPane } = Tabs;
const SqlResponse = (props) => {
    const { from, data: { id: id_now } } = props;
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [resData, setResData] = useState(null);
    const sql_res = useSelector((store) => store.opens.sql_res);
    const open_api_now = useSelector((store) => store.opens.open_api_now);

    const run_res_scene = useSelector((store) => store.scene.run_api_res);
    const run_res_plan = useSelector((store) => store.plan.run_api_res);
    const run_res_auto_plan = useSelector((store) => store.auto_plan.run_api_res);
    const run_res_case = useSelector((store) => store.case.run_api_res);


    const run_res_list = {
        'scene': run_res_scene,
        'plan': run_res_plan,
        'auto_plan': run_res_auto_plan,
        'case': run_res_case
    }
    const run_res = run_res_list[from];

    // const scene_id_now= useSelector((store) => store.scene.id_now);
    // const plan_id_now = useSelector((store) => store.plan.id_now);
    // const auto_id_now = useSelector((store) => store.auto_plan.id_now);
    // const case_id_now = useSelector((store) => store.case.id_now);

    // const id_now_list = {
    //     'scene': scene_id_now,
    //     'plan': plan_id_now,
    //     'auto_plan': auto_id_now,
    //     'case': case_id_now
    // };

    // const id_now = id_now_list[from];


    const scene_res_scene = useSelector((store) => store.scene.run_res);
    const scene_res_plan = useSelector((store) => store.plan.run_res);
    const scene_res_auto_plan = useSelector((store) => store.auto_plan.run_res);
    const scene_res_case = useSelector((store) => store.case.run_res);

    const scene_res_list = {
        'scene': scene_res_scene,
        'plan': scene_res_plan,
        'auto_plan': scene_res_auto_plan,
        'case': scene_res_case
    }
    const scene_res = scene_res_list[from];


    useEffect(() => {
        if (from === 'apis') {
            if (sql_res) {
                setResData(sql_res[open_api_now]);
            }
        } else {
            if (run_res) {
                setResData(run_res[id_now]);
            } else if (scene_res) {
                setResData(scene_res.find(item => item.event_id === id_now))
            }
        }
    }, [from, sql_res, open_api_now, run_res, id_now, scene_res]);



    const requestList = [
        {
            id: '0',
            title: '执行结果',
            content: <SqlResult data={resData} />
        },
        {
            id: '1',
            title: <div className="sql-response-assert-title">
                <p className="title">断言结果</p>
                {
                    resData && resData.assert && resData.assert.assertion_msgs && resData.assert.assertion_msgs.length > 0 ?
                        resData.assert.assertion_msgs.filter(item => !item.is_succeed).length > 0
                            ? <p className="fail"></p>
                            : <p className="success"></p>
                        : <></>
                }
            </div>,
            content: <SqlAssertResult data={resData} />
        },
        {
            id: '2',
            title: '提取结果',
            content: <SqlRegularResult data={resData} />
        }
    ]


    return (
        <div className="sql-manage-detail-response">
            {
                resData && resData.status === 'running' &&
                (
                    <div className={ResponseSendWrapper}>
                        <div className="loading_bar_tram"></div>
                        <div className="apt_sendLoading_con">
                            <div className="apt_sendLoading_con_text">{t('btn.sending')}</div>
                            <Button
                                type="primary"
                                className="cancel-send-btn"
                                onClick={() => {

                                }}
                            >
                                {t('btn.cancelSend')}
                            </Button>
                        </div>
                    </div>
                )
            }
            <Tabs defaultActiveTab='0' itemWidth={80}>
                {
                    requestList.map((item, index) => (
                        <TabPane
                            style={{ padding: '0 15px', width: 'auto !impoertant' }}
                            key={item.id}
                            title={item.title}
                        >
                            { resData && resData.response_body && resData.response_body.length > 0 ? item.content : <NotResponse text={t('apis.resSqlEmpty')} />}
                        </TabPane>
                    ))
                }
            </Tabs>
        </div>
    )
};

export default SqlResponse;