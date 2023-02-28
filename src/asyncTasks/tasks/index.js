import team from './team';
import project from './project';
import projectList from './project_list';
import collection from './collection';
import share from './share';
import api from './api';
import envs from './envs';
import doc from './doc';
import folder from './folder';
import websocket from './websocket';
import historySend from './history_send';
import paramsDesc from './paramsDesc';
import markList from './markList';
import note from './note';
import globalParams from './global_params';
import config from './config';
import singleTest from './single_test';
import combinedTtest from './combined_test';
import testReport from './test_report';

export default {
    TEAM: team,
    PROJECT: project,
    PROJECT_LIST: projectList,
    COLLECTION: collection,
    API: api,
    DOC: doc,
    FOLDER: folder,
    WEBSOCKET: websocket,
    SHARE: share,
    ENVS: envs,
    HISTORY_SEND: historySend,
    PARAMSDESC: paramsDesc,
    MARKLIST: markList,
    NOTE: note,
    GLOBALPARAMS: globalParams,
    CONFIG: config,
    SINGLE_TEST: singleTest,
    COMBINED_TEST: combinedTtest,
    TEST_REPORT: testReport,
};
