import store from '../../../../redux/store';

// 环境变量
export const environment = {
    has(variableName) {
        // console.log('environment has ', variableName);
    },
    get(variableName) {
        // console.log('environment get ', variableName);
    },
    set(variableName, variableValue) {
        // console.log('environment set ', variableName, variableValue);
    },
    replaceIn(variableName, variableValue) {
        // console.log('environment set ', variableName, variableValue);
    },
    toObject() {
        // console.log('environment set ', {});
    },
    unset(variableName) {
        // console.log('environment unset ', variableName);
    },
    clear() {
        // console.log('environment clear ');
    },
};

Object.defineProperty(environment, 'name', {
    get() {
        return store.getState().envs?.currentEnv?.name;
    },
});

export default environment;
