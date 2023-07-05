import { createStore, compose } from 'redux';
import reducers from './reducers';
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store =
  NODE_ENV === 'development' || NODE_ENV === 'test'
    ? createStore(reducers, composeEnhancers())
    : createStore(reducers);
    
export default store;
