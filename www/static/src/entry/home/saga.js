/**
 * @file saga
 * @author liuliang<liuliang@w3ctech.com>
 */

import {all, call, fork, put, select, take} from 'redux-saga/effects';
import {takeEvery, takeLatest} from 'redux-saga';


export default function* rootSaga() {
    yield all([
        // fork()
    ])
};
