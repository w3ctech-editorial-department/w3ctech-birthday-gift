/**
 * @file reducer
 * @author liuliang<liuliang@w3ctech.com>
 */
import {handleActions} from 'redux-actions';

const defaultStore = {
    pending: false
};

export default handleActions({
    FETCHING(state) {
        return {
            ...state,
            pending: true
        };
    },

    FETCHED(state) {
        return {
            ...state,
            pending: false
        };
    }
}, defaultStore);
