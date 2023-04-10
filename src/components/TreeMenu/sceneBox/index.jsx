import React, { useState, useEffect } from 'react';
import './index.less';
import { Apis as SvgApis, NewFolder as SvgNewFolder, Download as SvgDownload } from 'adesign-react/icons';
import SvgScene from '@assets/icons/Scene1';
import CreateGroup from '@modals/CreateGroup';
import CreateScene from '@modals/CreateScene';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Message, Modal } from 'adesign-react';
import Bus from '@utils/eventBus';

const SceneBox = (props) => {
    const { from, onChange, taskType } = props;
    const { t, i18n } = useTranslation();
    const { id } = useParams();
    const dispatch = useDispatch();

    const [showCreateGroup, setCreateGroup] = useState(false);
    const [showCreateScene, setCreateScene] = useState(false);
    const [canCreate, setCanCreate] = useState(true);
    const planMenu = useSelector((store) => store.plan.planMenu);

    useEffect(() => {
        if (Object.values(planMenu).filter(item => item.target_type === 'scene').length === 1 && taskType === 2) {
            setCanCreate(false);
        } else {
            setCanCreate(true);
        }
    }, [planMenu, taskType]);


    const nodes_plan = useSelector((store) => store.plan.nodes);
    const edges_plan = useSelector((store) => store.plan.edges);
    const id_apis_plan = useSelector((d) => d.plan.id_apis);
    const node_config_plan = useSelector((d) => d.plan.node_config);

    const open_scene_scene = useSelector((d) => d.scene.open_scene);
    const open_plan_scene = useSelector((d) => d.plan.open_plan_scene);
    const auto_plan_scene = useSelector((d) => d.auto_plan.open_plan_scene);

    const open_list = {
        'scene': open_scene_scene,
        'plan': open_plan_scene,
        'auto_plan': auto_plan_scene
    }

    const open_scene = open_list[from];

    return (
        <div className='scene-box' style={{ justifyContent: from === 'plan' ? 'space-between' : 'flex-start' }}>
            <div className='scene-box-item' onClick={() => setCreateGroup(true)}>
                <SvgNewFolder width="18" height="18" />
                <p>{from !== 'plan' ? t('scene.new') : ''}{i18n.language === 'cn' ? '' : ' '}{t('scene.group')}</p>
                <div className='line' style={{ margin: from === 'plan' ? (i18n.language === 'cn' ? '0 25px' : '0 8px') : '0 24px' }}></div>
            </div>
            <div className='scene-box-item' onClick={() => {
                if (canCreate) {
                    setCreateScene(true);
                } else {
                    Message('error', t('message.cantCreateScene'));
                }
            }}>
                <SvgScene width="18" height="18" />
                <p>{t('scene.createScene')}</p>
            </div>
            {
                (from === 'plan' || from === 'auto_plan') &&
                <>

                    <div className='scene-box-item' onClick={() => {
                        onChange(true);
                    }}>
                        <div className='line' style={{ margin: from === 'plan' ? (i18n.language === 'cn' ? '0 25px' : '0 8px') : '0 14px' }}></div>
                        <SvgDownload width="18" height="18" />
                        <p>{t('plan.importScene')}</p>
                    </div>
                </>
            }

            {showCreateGroup && <CreateGroup from={from} onCancel={() => setCreateGroup(false)} />}
            {showCreateScene && <CreateScene from={from} onCancel={() => setCreateScene(false)} />}
        </div>
    )
};

export default SceneBox;