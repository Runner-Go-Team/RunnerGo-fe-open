import React, { useEffect, useState } from "react";
import './index.less';
import { Button, Drawer, Input, Modal, Message } from 'adesign-react';
import {
    Right as SvgRight,
    Left as SvgLeft,
    Add as SvgAdd,
    Edit as SvgEdit,
    Copy as SvgCopy,
    Delete as SvgDelete,
    Search as SvgSearch,
    Save as SvgSave,
    CaretRight as SvgCaretRight
} from 'adesign-react/icons';
import { useTranslation } from 'react-i18next';
import { getPathExpressionObj } from '@constants/pathExpression';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import Bus from '@utils/eventBus';


const CaseList = (props) => {
    const { from, style, lineStyle } = props;
    const [open, setOpen] = useState(false);
    const [showDrawer, setDrawer] = useState(false);
    const [showApiPicker, setApiPicker] = useState(false);
    const [showApiDrawer, setApiDrawer] = useState(false);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const apiConfig = useSelector((store) => store.case.showApiConfig);
    const api_now = useSelector((store) => store.case.api_now);
    const [apiName, setApiName] = useState(api_now ? api_now.name : '新建接口');
    const [caseName, setCaseName] = useState('');

    const { id } = useParams();
    useEffect(() => {
        setApiDrawer(apiConfig);
    }, [apiConfig]);

    useEffect(() => {
        setApiName(api_now.name)
    }, [api_now]);


    const closeApiConfig = () => {
        Bus.$emit('saveCaseApi', () => {
            // setDrawer(false)
            dispatch({
                type: 'case/updateApiConfig',
                payload: false
            })
        });
    };

    const onTargetChange = (type, value) => {
        Bus.$emit('updateCaseApi', {
            id: api_now.id,
            pathExpression: getPathExpressionObj(type),
            value,
        });
    };

    const is_changed = useSelector((store) => store.case.is_changed);
    const open_info_scene = useSelector((store) => store.scene.open_info);
    const open_info_auto_plan = useSelector((store) => store.auto_plan.open_info);
    const id_apis_auto_plan = useSelector((store) => store.auto_plan.id_apis);
    const node_config_auto_plan = useSelector((store) => store.auto_plan.node_config);

    const open_info_list = {
        'scene': open_info_scene,
        'auto_plan': open_info_auto_plan
    };
    // const open_info = open_info_list[from];
    const open_info = open_info_scene ? open_info_scene : open_info_auto_plan;


    const closeCase = () => {
        dispatch({
            type: 'case/updateRunRes',
            payload: null,
        })
        dispatch({
            type: 'case/updateRunningScene',
            payload: '',
        })
        dispatch({
            type: 'case/updateNodes',
            payload: [],
        });
        dispatch({
            type: 'case/updateEdges',
            payload: [],
        })
        dispatch({
            type: 'case/updateCloneNode',
            payload: [],
        })
        dispatch({
            type: 'case/updateSuccessEdge',
            payload: [],
        });
        dispatch({
            type: 'case/updateFailedEdge',
            payload: [],
        });
        dispatch({
            type: 'case/updateApiConfig',
            payload: false,
        })
        dispatch({
            type: 'case/updateBeautify',
            payload: false
        })
        if (open_info_scene) {
            Bus.$emit('addOpenScene', open_info);
        } else if (open_info_auto_plan) {
            Bus.$emit('addOpenAutoPlanScene', open_info);
        }
        dispatch({
            type: 'case/updateShowCase',
            payload: false
        })
    };

    const showCase = () => {

        dispatch({
            type: 'auto_plan/updateApiConfig',
            payload: {}
        })

        dispatch({
            type: 'plan/updateApiConfig',
            payload: {}
        })

        dispatch({
            type: 'scene/updateApiConfig',
            payload: {}
        })

        dispatch({
            type: 'case/updateApiConfig',
            payload: {}
        })

        if (style) {
            closeCase();
        } else {
            dispatch({
                type: 'case/updateShowCase',
                payload: true
            })
        }
    }

    return (
        <>
            <div className="case-list" style={style}>
                <div className="default-case" style={lineStyle} onClick={() => showCase()}>
                    <p>{t('case.caseSet')}</p>
                    {
                        style ? <SvgLeft /> : <SvgRight />
                    }
                </div>
            </div>
        </>
    )
};

export default CaseList;