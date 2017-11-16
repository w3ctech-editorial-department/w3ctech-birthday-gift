/**
 * @file Fade transition
 * @author liuliang<liuliang@w3ctech.com>
 */

import React from 'react'
import PropTypes from 'prop-types'
import CSSTransition from 'react-transition-group/CSSTransition';

const propTypes = {
    ...CSSTransition.propTypes
};
const defaultProps = {
    timeout: 200,
    classNames: 'fade'
};

const Fade = ({children, ...props}) => (
    <CSSTransition
        mountOnEnter
        unmountOnExit
        {...props}
    >
        {children}
    </CSSTransition>
);

Fade.propTypes = propTypes;
Fade.defaultProps = defaultProps;

export default Fade;
