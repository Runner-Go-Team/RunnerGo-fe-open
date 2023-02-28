export const taskState = {
    taskRunSwitch: 'on', // 任务开启状态
    dormant_try_counter: 0, // 总体失败（err级别）计数器，变量
    dormant_to_time: 0, //   休眠至几点，变量
    dormant_try_limit: 100, // 总体连续失败（err级别）多少次后，进入休眠, 常量
    dormant_long_second: 120, // 休眠时长（Second秒）, 常量
    throuteSeconds: 200, // 节流时间（豪秒）
    a_tark_try_limit: 1, // 尝试执行任务总次数，失败后挂起, 常量
};
