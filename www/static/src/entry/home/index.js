/**
 * @file 页面入口
 * @author liuliang<liuliang@w3ctech.com>
 */
import reducer from './reducer';
import saga from './saga';
import App from './app';
import entry from '../';

const render = entry({reducer, saga}, App);

if (module.hot) {
    module.hot.accept('./app', () => render(App));
    module.hot.accept('./reducer', () => render.replaceReducer(reducer));
}
