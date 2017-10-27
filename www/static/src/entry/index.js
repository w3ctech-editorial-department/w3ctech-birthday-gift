/**
 * @file 通用 container
 * @author liuliang<liuliang@w3ctech.com>
 */

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import createSagaMiddleware from 'redux-saga';
import Redbox from 'redbox-react';
import DevTools from '../component/DevTools';

import {AppContainer} from 'react-hot-loader';

const saga = createSagaMiddleware();

const CustomErrorReporter = ({error}) => <Redbox error={error}/>;
CustomErrorReporter.propTypes = {
    error: PropTypes.instanceOf(Error).isRequired
};

export default (reducer, App, id = 'app') => {
    let enhancer = applyMiddleware(...[thunk, saga, promise]);

    if (process.env.NODE_ENV !== 'production') {
        enhancer = compose(
            enhancer,
            DevTools.instrument()
        );
    }

    const store = createStore(
        reducer,
        enhancer
    );

    const render = Component => {

        ReactDOM.render(
            <Provider store={store}>
                <AppContainer errorReporter={CustomErrorReporter} warnings={true}>
                    <Component />
                </AppContainer>
            </Provider>,
            document.getElementById(id)
        );

        return render;
    };

    render.replaceReducer = reducer => store.replaceReducer(reducer);

    return render(App);
};
