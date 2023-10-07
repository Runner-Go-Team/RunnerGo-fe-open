import { combineReducers } from 'redux';

import apisReducer from './apis';
import globalReducer from './global';
import projectsReducer from './projects';
import teamsReducer from './teams';
import userReducer from './user';
import envsReducer from './envs';
import opensReducer from './opens';
import consoleReducer from './console';
import workspaceReducer from './workspace';
import conflictReducer from './conflict';
import runnerReducer from './runner';
import plansReducer from './plan';
import dashBoardReducer from './dashboard';
import sceneReducer from './scene';
import tPlansReducer from './auto_plan';
import caseReducer from './case';
import reportReducer from './report';
import autoReportReducer from './auto_report';
import webSocketReducer from './websocket';
import machineReducer from './machine';
import envReducer from './env';
import permissionReducer from './permission';
import mockReducer from './mock';
import uiTestAutoReducer from './uitest_auto';


const reducers = combineReducers({
    apis: apisReducer,
    global: globalReducer,
    projects: projectsReducer,
    teams: teamsReducer,
    user: userReducer,
    envs: envsReducer,
    opens: opensReducer,
    workspace: workspaceReducer,
    conflict: conflictReducer,
    console: consoleReducer,
    runner: runnerReducer,
    plan: plansReducer,
    dashboard: dashBoardReducer,
    scene: sceneReducer,
    auto_plan: tPlansReducer,
    case: caseReducer,
    report: reportReducer,
    auto_report: autoReportReducer,
    websocket: webSocketReducer,
    machine: machineReducer,
    env: envReducer,
    permission: permissionReducer,
    mock: mockReducer,
    uitest_auto:uiTestAutoReducer,
});

export default reducers;