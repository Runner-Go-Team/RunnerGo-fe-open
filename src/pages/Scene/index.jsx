import React, { useState, useEffect } from 'react';
import { Scale, Button } from 'adesign-react';
import { useSelector, useDispatch } from 'react-redux';
import { isObject } from 'lodash';
import Bus from '@utils/eventBus';
import TreeMenu from '@components/TreeMenu';
import { ApisWrapper, ApiManageWrapper } from './style';
import { Routes, Route, Navigate } from 'react-router-dom';
import SceneHeader from './sceneHeader';
import SceneContainer from './sceneContainer';
import SvgEmpty from '@assets/img/empty';
import SvgScene from '@assets/icons/Scene1';
import { useTranslation } from 'react-i18next';
import CreateScene from '@modals/CreateScene';
import CaseMenu from '@components/CaseMenu';
import CreateCase from '@modals/CreateCase';
import { global$ } from '@hooks/useGlobal/global';


const { ScalePanel, ScaleItem } = Scale;

const Scene = () => {
    const { t } = useTranslation();
    const sceneDatas = useSelector((store) => store.scene.sceneDatas);
    const open_scene = useSelector((store) => store.scene.open_scene);
    const open_case = useSelector((store) => store.case.open_case);
    const show_case = useSelector((store) => store.case.show_case);
    const [showCreate, setShowCreate] = useState(false);
    const [createCase, setCreateCase] = useState(false);
    const dispatch = useDispatch();
    const [storageScene, setStorageScene] = useState(null);

    useEffect(() => {

        global$.next({
            action: 'RELOAD_LOCAL_SCENE'
        })

        dispatch({
            type: 'case/updateShowCase',
            payload: false
        })
        const open_scene = localStorage.getItem('open_scene');
        setStorageScene(open_scene);
        if (open_scene) {
            const val = JSON.parse(open_scene);
            setTimeout(() => {
                dispatch({
                    type: 'scene/updateOpenName',
                    payload: val.name,
                })
                dispatch({
                    type: 'scene/updateOpenDesc',
                    payload: val.description
                })
                dispatch({
                    type: 'scene/updateOpenInfo',
                    payload: val
                })
                Bus.$emit('addOpenScene', val);
            })
        } else {
            dispatch({
                type: 'scene/updateOpenScene',
                payload: null
            })
        }
    }, []);

    // useEffect(() => {
    //     setTimeout(() => {
    //          Bus.$emit('openRecordScene');
    //     })
    //  }, []);

    //  useEffect(() => {
    //      return () => {
    //          Bus.$emit('recordOpenScene');
    //      }
    //  }, []);

    const CaseEmpty = () => {
        return (
            <div className="welcome-page">
                <div className="newTarget">
                    <Button
                        type="primary"
                        onClick={() => {
                            setCreateCase(true)
                        }}
                    >
                        <SvgScene />
                        <h3>{t('case.createCase')}</h3>
                    </Button>
                </div>
            </div>
        )
    }

    const EmptyContent = () => {
        return <div className="welcome-page">
            <div className="newTarget">
                <Button
                    type="primary"
                    onClick={() => {
                        setShowCreate(true)
                    }}
                >
                    <SvgScene />
                    <h3>{t('btn.createScene')}</h3>
                </Button>
            </div>
        </div>
    };

    const [layouts, setLayouts] = useState({});

    useEffect(() => {
        if (show_case) {
            setLayouts({ 0: { width: 270 }, 1: { width: 208, marginRight: '2px' }, 2: { flex: 1, width: 0 } });
        } else {
            setLayouts({ 0: { width: 270 }, 1: { flex: 1, width: 0 } })
        }
    }, [show_case, open_case]);

    return (
        <>
            {
                show_case ? <ScalePanel
                    realTimeRender
                    className={ApisWrapper}
                    layouts={layouts}
                >
                    <ScaleItem className="left-menus" minWidth={250} maxWidth={350}>
                        <TreeMenu type='scene' />
                    </ScaleItem>
                    <ScaleItem>
                        <CaseMenu from='scene' />
                    </ScaleItem>
                    <ScaleItem className="right-apis" enableScale={false}>
                        {
                            show_case && Object.entries(open_case || {}).length > 0 ? <>
                                <SceneHeader from="case" />
                                <SceneContainer from="case" />
                            </> : <CaseEmpty />
                        }
                    </ScaleItem>
                </ScalePanel>
                    : <ScalePanel
                        realTimeRender
                        className={ApisWrapper}
                        layouts={layouts}
                    >
                        <ScaleItem className="left-menus" minWidth={250} maxWidth={350}>
                            <TreeMenu type='scene' />
                        </ScaleItem>
                        <ScaleItem className="right-apis" enableScale={false}>
                            {
                                Object.entries(open_scene || {}).length > 0 ? <>
                                    <SceneHeader from="scene" />
                                    <SceneContainer from="scene" />
                                </> : <EmptyContent />
                            }
                        </ScaleItem>
                    </ScalePanel>
            }

            {showCreate && <CreateScene from="scene" onCancel={() => setShowCreate(false)} />}
            { createCase && <CreateCase from="scene" onCancel={() => setCreateCase(false)} /> }
        </>
    )
};

export default Scene;