// 全局变量
export const globals = {
    has(variableName) {
        // console.log('globals has ', variableName);
    },
    get(variableName) {
        // console.log('globals get ', variableName);
    },
    set(variableName, variableValue) {
        // console.log('globals set ', variableName, variableValue);
    },
    replaceIn(variableName, variableValue) {
        // console.log('globals set ', variableName, variableValue);
    },
    toObject() {
        // console.log('globals set ', {});
    },
    unset(variableName) {
        // console.log('globals unset ', variableName);
    },
    clear() {
        // console.log('globals clear ');
    },
};

export default globals;
