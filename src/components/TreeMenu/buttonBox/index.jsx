import React, { useState, useMemo, useEffect, useRef } from "react";
import { useSelector } from 'react-redux';
import './index.less';
import { Button, Message, Tooltip } from 'adesign-react';
import {
    NewApis as SvgNewApis,
    NewFolder as SvgNewFolder,
    Download as SvgDownload,
    Unfold as SvgUnOpen,
    MenuFold as SvgOpen,
    NewWindow as SvgNewWindow,
} from 'adesign-react/icons';
import { isString, isObject, isEmpty, debounce } from 'lodash';
import Bus from '@utils/eventBus';
import { fetchSaveMockToTarget } from '@services/mock';
import { global$ } from '@hooks/useGlobal/global';
import { DropWrapper } from './style';
import ApiPicker from '@components/ApiPicker';
import FolderCreate from '@modals/folder/create';
import ImportApi from "@modals/ImportApi";
import ImportProject from "@modals/ImportProject";
import { useTranslation } from 'react-i18next';
import { Dropdown, Menu } from '@arco-design/web-react';
import { async, lastValueFrom } from "rxjs";

const ButtonBox = (props) => {

    const { treeRef, showModal } = props;
    const { t } = useTranslation();

    const [importMockApi, setImportMockApi] = useState(false);
    const [isExpandAll, setIsExpandAll] = useState(false);
    const [showFolder, setShowFolder] = useState(false);
    const currentTeamId = sessionStorage.getItem('team_id');
    const [showApi, setImportApi] = useState(false);
    const [showProject, setImportProject] = useState(false);
    const userTeams = useSelector((store) => store.teams.teamData);
    const theme = useSelector((store) => store.user.theme);
    const mockApis = useSelector((store) => store?.mock?.mock_apis);

    const currentTeamName = useMemo(() => {
        let currentTeamId = sessionStorage.getItem('team_id');
        let teamName = userTeams[currentTeamId] ? userTeams[currentTeamId].name : '默认团队';

        return teamName;
    }, [userTeams, currentTeamId]);

    const handleExpandAll = () => {
        const newExpandStatus = !isExpandAll;
        setIsExpandAll(newExpandStatus);
        treeRef.current?.handleExpandItem(newExpandStatus);
        // setWorkspaceCurrent(uuid, `${CURRENT_PROJECT_ID}.IS_EXPAND_ALL`, newExpandStatus ? 1 : -1);
    };

    const createDropList = (
        <Menu className='create-api-dropdown'>
            <Menu.Item key='1' onClick={() => {
                Bus.$emit('addOpenItem', { type: 'api' })
            }}>{t('apis.createHttp')}</Menu.Item>
            <Menu.Item key='2' onClick={() => {
                Bus.$emit('addOpenItem', { type: 'sql' })
            }}>{t('apis.createSql')}</Menu.Item>
            {/* <Menu.Item key='3' onClick={() => {
                Bus.$emit('addOpenItem', { type: 'oracle' })
            }}>{t('apis.createOracle')}</Menu.Item> */}
            <Menu.Item key='4' onClick={() => {
                Bus.$emit('addOpenItem', { type: 'tcp' })
            }}>{t('apis.createTcp')}</Menu.Item>
            <Menu.Item key='5' onClick={() => {
                Bus.$emit('addOpenItem', { type: 'websocket' })
            }}>{t('apis.createWs')}</Menu.Item>
            {/* <Menu.Item key='6' onClick={() => {
                Bus.$emit('addOpenItem', { type: 'mqtt' })
            }}>{t('apis.createMqtt')}</Menu.Item> */}
            <Menu.Item key='7' onClick={() => {
                Bus.$emit('addOpenItem', { type: 'dubbo' })
            }}>{t('apis.createDubbo')}</Menu.Item>
        </Menu>
    );

    const importDropList = (<Menu className='create-api-dropdown'>
        <Menu.Item key='1' onClick={() => {
            setImportProject(true)
        }}>{t('import.import_file')}</Menu.Item>
        <Menu.Item key='2' onClick={() => {
            // 刷新mock api数据
            Bus.$emit('mock/getMockList')
            setImportMockApi(true);
        }}>{t('import.import_mock_api')}</Menu.Item>
    </Menu>);

    const onApiPickerSubmit = debounce(async (ids) => {
        try {
            const res = await lastValueFrom(fetchSaveMockToTarget({targetIDs:ids,team_id:sessionStorage.getItem('team_id')}))
            if(res?.code == 0){
                Message('success', '添加成功');
                // 添加成功 刷新测试对象目录列表
                global$.next({
                  action: 'GET_APILIST',
                });
            }
        } catch (error) {
            
        }
        
    },200);
    return (
        <>
            <div className="buttons-box">
                <div className="button-list">
                    <div className="button-list-item">
                        <Tooltip bgColor={theme === 'dark' ? '#39393D' : '#E9E9E9'} content={t('apis.createObject')} placement="top">
                            <div>
                                <Dropdown trigger='click' droplist={createDropList}>
                                    <Button size="mini">
                                        <SvgNewApis width="18px" height="18px" />
                                    </Button>
                                </Dropdown>
                            </div>
                        </Tooltip>
                        <span className="line"></span>
                    </div>

                    <div className="button-list-item">
                        <Tooltip bgColor={theme === 'dark' ? '#39393D' : '#E9E9E9'} content={t('apis.createFolder')} placement="top">
                            <Button size="mini" onClick={() => setShowFolder(true)}>
                                <SvgNewFolder width="18px" height="18px" />
                            </Button>
                        </Tooltip>
                        <span className="line"></span>
                    </div>

                    <div className="button-list-item">
                        <Tooltip bgColor={theme === 'dark' ? '#39393D' : '#E9E9E9'} content={t('apis.import')} placement="top">
                            <div>
                                <Dropdown trigger='click' droplist={importDropList}>
                                    <Button size="mini">
                                        <SvgDownload width="18px" height="18px" />
                                    </Button>
                                </Dropdown>
                            </div>
                        </Tooltip>
                        <span className="line"></span>
                    </div>

                    <div className="button-list-item">
                        <Tooltip bgColor={theme === 'dark' ? '#39393D' : '#E9E9E9'} content={t('apis.expand')} placement="top">
                            <Button size="mini" onClick={handleExpandAll}>
                                {isExpandAll ? (
                                    <SvgOpen width="18px" height="18px" />
                                ) : (
                                    <SvgUnOpen width="18px" height="18px" />
                                )}
                            </Button>
                        </Tooltip>
                    </div>
                </div>
                {showFolder && <FolderCreate onCancel={() => setShowFolder(false)} />}
                {showApi && <ImportApi onCancel={() => setImportApi(false)} />}
                {showProject && <ImportProject onCancel={() => setImportProject(false)} />}
                {importMockApi && <ApiPicker title={t('import.mock_api')} data={mockApis} onSubmit={onApiPickerSubmit} onCancel={() => setImportMockApi(false)} />}
            </div>
        </>
    )
};

export default ButtonBox;
