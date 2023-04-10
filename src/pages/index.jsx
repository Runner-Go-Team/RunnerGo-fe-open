import React from 'react';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';

import ReactDOM from 'react-dom';
import store from '../redux/store';
import 'adesign-react/libs/style.css';
import "@arco-design/web-react/dist/css/arco.css";
import './reset.less';
import './index.less';
import './public.less';
import './geetest.less';
import './apipost.less';
import './arco.less';
import '../locales';

import App from './App';

ReactDOM.render(
    <Provider store={store}>
        <HashRouter>
            <App />
        </HashRouter>
    </Provider>,
    document.getElementById('root'),
);