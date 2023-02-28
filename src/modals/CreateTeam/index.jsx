import React, { useState } from "react";
import { Modal, Input, Message } from 'adesign-react';
import { fetchCreateTeam, fetchUpdateConfig } from '@services/user';
import './index.less';
import { useTranslation } from 'react-i18next';
import { global$ } from '@hooks/useGlobal/global';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CreateTeam = (props) => {
    const { onCancel } = props;
    const [teamName, setTeamName] = useState('');
    const [nameError, setNameError] = useState(false);

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const createTeam = () => {
        if (teamName.trim().length > 25) {
            Message('error', t('message.teamNameLong'));
            return;
        }
        if (teamName.trim().length < 1) {
            Message('error', t('message.noTeamName'));
            return;
        }
        const params = {
            name: teamName,
        };
        fetchCreateTeam(params).subscribe({
            next: (res) => {
                const { code, data } = res;

                if (code === 0) {
                    const { team_id } = data;
                    const settings = JSON.parse(localStorage.getItem('settings'));
                    settings.settings.current_team_id = team_id;
                    localStorage.setItem('settings', settings);
                    localStorage.setItem('team_id', team_id);
                    localStorage.removeItem('open_scene');
                    dispatch({
                        type: 'opens/coverOpenApis',
                        payload: {},
                    })
                    dispatch({
                        type: 'scene/updateOpenScene',
                        payload: null,
                    })
                    global$.next({
                        action: 'INIT_APPLICATION',
                    });
                    navigate('/index');
                    Message('success', t('message.createSuccess'));
                    onCancel(true);
                }
            }
        })
    }
    return (
        <>
            <Modal
                title={t('modal.createTeam')}
                cancelText={t('btn.cancel')}
                okText={t('btn.ok')}
                visible={true}
                onCancel={onCancel} c
                className='create-team-modal'
                onOk={() => createTeam()}
            >
                <Input
                    className={nameError ? 'input-error' : ''}
                    value={teamName}
                    placeholder={t('placeholder.teamName')}
                    onChange={(e) => {
                        setTeamName(e);
                        if (e.trim().length === 0 || e.trim().length > 25) {
                            setNameError(true);
                        } else {
                            setNameError(false);
                        }
                    }}
                    onBlur={(e) => {
                        if (teamName.trim().length === 0 || teamName.trim().length > 25) {
                            setNameError(true);
                        } else {
                            setNameError(false);
                        }
                    }}
                />
                {nameError && <p className='input-error-text' style={{ color: 'var(--run-red)', marginRight: 'auto', marginLeft: '4px' }}>{t('sign.teamNameError')}</p>}
            </Modal>
        </>
    )
};

export default CreateTeam;