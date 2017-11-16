/**
 * @file DevTools组件
 * @author liuliang<liuliang@w3ctech.com>
 */

import {createDevTools} from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';

export default createDevTools(
    <DockMonitor
        toggleVisibilityKey="ctrl-h"
        changePositionKey="ctrl-w"
    >
        <LogMonitor />
    </DockMonitor>
);
