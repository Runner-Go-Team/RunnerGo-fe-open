export const MODEL_LEVEL = {
    // 任务优先级【1-3 个等级】，值越大优先级越大
    TEAM: 3,
    PROJECT: 4,
    ENVS: 3,
    COLLECTION: 2,
    SHARE: 1,
    API: 2,
    DOC: 2,
    EXAMPLE: 1,
    FOLDER: 1,
    WEBSOCKET: 1,
    NOTE: 1,
    HISTORY_SEND: 1,
    HISTORY_SAVE: 1,
    RUNNER: 1,
    PARAMSDESC: 1,
    GLOBALPARAMS: 1,
    SINGLE_TEST: 1, // 测试用例
    COMBINED_TEST: 1, // 测试套件
    TEST_REPORT: 1, // 测试报告
    MARKLIST: 1,
};

// 动作优先级 值越大优先级越大
export const ACTION_LEVEL = {
    SAVE: 3,
    SORT: 2,
    DELETE: 3,
    FOREVER: 3, // 彻底删除
    PULL: 1,
    BATCHSAVE: 3, // 批量保存
};
