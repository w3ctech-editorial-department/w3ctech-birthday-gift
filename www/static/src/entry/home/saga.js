/**
 * @file saga
 * @author liuliang<liuliang@w3ctech.com>
 */

import {all, call, fork, put, select, take, takeEvery, takeLatest} from 'redux-saga/effects';


export default function* rootSaga() {
    yield all([
        fork()
    ])
};
