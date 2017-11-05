/**
 * @file 返回顶部
 * @author liuliang<liuliang@w3ctech.com>
 */

import PropTypes from 'prop-types';
import {BackTop} from 'antd';
import Fade from 'ui/Fade';

const GotoTop = ({visibilityHeight, onClick, target, show = true}) => (
    <Fade in={show}>
        <BackTop>
            <i className="fa fa-rocket" aria-hidden="true"></i>
        </BackTop>
    </Fade>
);

GotoTop.propTypes = {
    visibilityHeight: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
    target: PropTypes.func.isRequired
};

export default GotoTop;
