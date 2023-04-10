import React, { useState, useEffect } from 'react';
import './index.less';
import { useSelector, useDispatch } from 'react-redux';
import cn from 'classnames';
import { fetchRunningPlan } from '@services/dashboard';
import { isArray } from 'lodash';
import { tap } from 'rxjs';
import { useTranslation } from 'react-i18next';

const RunningShow = () => {
    // const planData = useSelector((store) => store.plan.planData);
    const runningPlan = useSelector((store) => store.dashboard.runningPlan);
    const [planLength, setPlanLength] = useState(0);
    const dispatch = useDispatch();
    let { t } = useTranslation();
    const renderColor = () => {
        const arr = new Array(10).fill(0);
        // if (!isArray(planData)) return;
        return arr.map((item, index) => <p className={cn({ 'running': index < planLength })} key={index}></p>)
    };

    useEffect(() => {
        if (runningPlan) {
            const { run_plan_num } = runningPlan;
            setPlanLength(run_plan_num);
        }
    }, [runningPlan]);

    useEffect(() => {
        const params = {
            team_id: localStorage.getItem('team_id'),
        };
        fetchRunningPlan(params)
            .pipe(
                tap((res) => {
                    const { code, data } = res;
                    if (code === 0) {
                        const { plans, total, run_plan_num } = data;
                        dispatch({
                            type: 'plan/updatePlanData',
                            payload: plans
                        })
                        setPlanLength(run_plan_num);
                    }
                })
            ).subscribe();
    }, []);
    return (
        <div className='running-show'>
            <div className='color-show'>
                {renderColor()}
            </div>
            <div className='number-show'>{t("header.running")} （{planLength}）</div>
        </div>
    );
};

export default RunningShow;