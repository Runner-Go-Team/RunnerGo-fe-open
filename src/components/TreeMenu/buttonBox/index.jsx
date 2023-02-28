import React, { useState, useMemo, useEffect, useRef } from "react";
import { useSelector } from 'react-redux';
import './index.less';
import { Button, Tooltip, Dropdown } from 'adesign-react';
import {
    NewApis as SvgNewApis,
    NewFolder as SvgNewFolder,
    Download as SvgDownload,
    Unfold as SvgUnOpen,
    MenuFold as SvgOpen,
    NewWindow as SvgNewWindow,
} from 'adesign-react/icons';
import { isString, isObject, isEmpty } from 'lodash';
import Bus from '@utils/eventBus';
import { DropWrapper } from './style';
import FolderCreate from '@modals/folder/create';
import ImportApi from "@modals/ImportApi";
import ImportProject from "@modals/ImportProject";
import { useTranslation } from 'react-i18next';

const ButtonBox = (props) => {

    const { treeRef, showModal } = props;
    const { t } = useTranslation();

    const [isExpandAll, setIsExpandAll] = useState(false);
    const [showFolder, setShowFolder] = useState(false);
    const currentTeamId = localStorage.getItem('team_id');
    const [showApi, setImportApi] = useState(false);
    const [showProject, setImportProject] = useState(false);
    const userTeams = useSelector((store) => store.teams.teamData);
    const theme = useSelector((store) => store.user.theme);

    const currentTeamName = useMemo(() => {
        let currentTeamId = localStorage.getItem('team_id');
        let teamName = userTeams[currentTeamId] ? userTeams[currentTeamId].name : '默认团队';

        return teamName;
    }, [userTeams, currentTeamId]);

    const handleExpandAll = () => {
        const newExpandStatus = !isExpandAll;
        setIsExpandAll(newExpandStatus);
        treeRef.current?.handleExpandItem(newExpandStatus);
        // setWorkspaceCurrent(uuid, `${CURRENT_PROJECT_ID}.IS_EXPAND_ALL`, newExpandStatus ? 1 : -1);
    };

    return (
        <>
            <div className="buttons-box">
                <div className="button-list">
                    <div className="button-list-item">
                        <Tooltip bgColor={theme === 'dark' ? '#39393D' : '#E9E9E9'} content={t('apis.createApi')} placement="top">
                            <Button size="mini" onClick={() => {
                                Bus.$emit('addOpenItem', { type: 'api' })
                            }}>
                                <SvgNewApis width="18px" height="18px" />
                            </Button>
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
                        <Tooltip content={t('apis.import')} placement="top">
                            <Button size="mini" onClick={() => setImportProject(true)}>
                                <SvgDownload width="18px" height="18px" />
                            </Button>
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
            </div>
        </>
    )
};

export default ButtonBox;
