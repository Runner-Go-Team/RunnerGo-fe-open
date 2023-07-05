import React, { useState, useEffect, useRef } from "react";
import './index.less';
import cn from 'classnames';
import { Modal, Button, Tooltip, Message } from 'adesign-react';
import './index.less';
import { getSyncProjectApi } from '@services/projects';
// import { SourceAutoImport } from '@indexedDB/project';
import { isLogin } from '@utils/common';
import Bus from '@utils/eventBus';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { isArray, isBoolean } from 'lodash';
import { ImportModal } from './style';
import AutoImport from './AutoImport';
import ManualImport from './ManualImport';

const ImportProject = (props) => {
    const { onCancel, teamId } = props;
    const { t }=useTranslation();
    const [loading, setLoading] = useState(false);
    const [tabType, setTabType] = useState('hand');
    const [importObj, setImportObj] = useState({});
    const { CURRENT_TEAM_ID, CURRENT_PROJECT_ID } = useSelector((d) => d.workspace);
    const { projectData } = useSelector((d) => d?.projects);

    useEffect(() => {
        if (tabType && tabType === 'auto' && !isLogin()) {
            Message('error', '请先登陆使用该功能。');
            Bus.$emit('openModal', 'LoginModal');
            onCancel();
        }
    }, [tabType])

    useEffect(() => {
        // getSyncProjectApi({ project_id: CURRENT_PROJECT_ID }).subscribe({
        //   next(resp) {
        //     if (isArray(resp?.data) && resp.data.length > 0) {
        //       const autoImports = resp.data.map((it) => ({
        //         ...it,
        //         uuid: localStorage.getItem('uuid'),
        //       }));
        //       SourceAutoImport.bulkPut(autoImports);
        //     }
        //   },
        //   error(err) {
        //   },
        // });
    }, []);

    const submit = () => {
        if (loading) {
            return;
        }
        setLoading(true);
        if (tabType === 'hand') {

            manualImportRef?.current?.manualImportSubmit();
        } else if (tabType === 'auto') {

            autoImportRef?.current?.nowImport();
        }
    };
    const custom = () => {
        if (tabType === 'hand') {
            // 取消 关闭弹窗
            onCancel();
        } else if (tabType === 'auto') {
            // 保存
            autoImportRef?.current?.autoImportSave();
        }
    };
    const manualImportRef = useRef(null);
    const autoImportRef = useRef(null);


    const getFooter = () => {
        // if (projectData === null) {
        //   return null;
        // }
        // if (projectData[CURRENT_PROJECT_ID]?.is_manager > 0 || tabType === 'hand') {
        //   return (
        //     <>
        //       <Button
        //         disabled={!(projectData[CURRENT_PROJECT_ID]?.is_manager > 0) && tabType !== 'hand'}
        //         onClick={custom}
        //       >
        //         {tabType === 'hand' ? '取消' : '保存'}
        //       </Button>
        //       {(importObj?.is_open > 0 || tabType === 'hand') && (
        //         <Button
        //           disabled={!(projectData[CURRENT_PROJECT_ID]?.is_manager > 0) && tabType !== 'hand'}
        //           onClick={submit}
        //         >
        //           {loading ? '导入中...' : '立即导入'}
        //         </Button>
        //       )}
        //     </>
        //   );
        // }
        return (
            <>
                <Button onClick={custom}>
                    {tabType === 'hand' ? '关闭' : '保存'}
                </Button>
                <Button onClick={submit} style={{ backgroundColor: 'var(--theme-color)' }}>
                    {loading ? '导入中...' : '导入'}
                </Button>
            </>
        );
    };

    return (
        <>
            <Modal
                className={ImportModal}
                title={t('import.import_file')}
                visible
                onCancel={onCancel}
                footer={getFooter()}
            >
                <ManualImport
                    ref={manualImportRef}
                    loading={loading}
                    setLoading={setLoading}
                    onCancel={onCancel}
                    CURRENT_TEAM_ID={CURRENT_TEAM_ID}
                    CURRENT_PROJECT_ID={CURRENT_PROJECT_ID}
                />
            </Modal>
        </>
    );
};

export default ImportProject;
