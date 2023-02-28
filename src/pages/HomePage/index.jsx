import React, { useEffect, useState } from "react";
import './index.less';
import DataView from "./DataView";
import AddCase from "./AddCase";
import TeamView from "./TeamView";
import AutoReport from "./AutoReport";
import StressReport from "./StressReport";

import { fetchGetIndex } from '@services/dashboard';
import { useSelector } from 'react-redux';

const HomePage = () => {

    const [teamName, setTeamName] = useState("");
    const [apiManage, setApiManage] = useState({});
    const [sceneManage, setSceneManage] = useState({});
    const [caseManage, setCaseManage] = useState({});

    const [teamList, setTeamList] = useState([]);

    const [autoPlanData, setAutoPlanData] = useState({});
    const [stressPlanData, setStressPlanData] = useState({});

    const refresh = useSelector((store) => store.dashboard.refresh);

    let index_t = null;

    useEffect(() => {
        getIndex();

        index_t = setInterval(getIndex, 1000);

        return () => {
            clearInterval(index_t);
        }
    }, []);

    useEffect(() => {
        getIndex();
    }, [refresh]);

    const getIndex = () => {
        const params = {
            team_id: localStorage.getItem('team_id')
        };
        fetchGetIndex(params).subscribe({
            next: (res) => {
                console.log(res);
                const { data: { team_name, api_manage_data, scene_manage_data, case_add_seven_data, team_overview, auto_plan_data, stress_plan_data
                } } = res;
                setTeamName(team_name);
                setApiManage(api_manage_data);
                setSceneManage(scene_manage_data);
                setCaseManage(case_add_seven_data);

                setTeamList(team_overview);

                setAutoPlanData(auto_plan_data);
                setStressPlanData(stress_plan_data);
            }
        })
    };

    return (
        <>
            <div className="home-page">
                <div className="home-page-top">
                    <DataView team_name={teamName} api_manage={apiManage} scene_manage={sceneManage} />
                    <AddCase case_manage={caseManage} />
                    <TeamView team_list={teamList} />
                </div>
                <div className="home-page-bottom">
                    <AutoReport data={autoPlanData} />
                    <StressReport data={stressPlanData} />
                </div>
            </div>
        </>

    )
};

export default HomePage;