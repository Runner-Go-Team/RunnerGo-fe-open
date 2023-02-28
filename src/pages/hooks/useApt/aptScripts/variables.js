// 临时变量 取值优先级 自己/iterationData/env/global；

export const variables = {
    has(variableName) {
        // console.log('variables has ', variableName);
    },
    get(variableName) {
        // console.log('variables get ', variableName);
    },
    set(variableName, variableValue) {
        // console.log('variables set ', variableName, variableValue);
    },
    replaceIn(variableName, variableValue) {
        // console.log('variables set ', variableName, variableValue);
    },
    toObject() {
        // console.log('variables toObject ', {});
    },
};

export default variables;
