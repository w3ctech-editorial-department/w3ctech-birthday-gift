/**
 * @file 根容器
 * @author liuliang<liuliang@w3ctech.com>
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {post} from '../../util/http';

import * as actions from './action';

import GotoTop from '../../component/Back2Top';

// import 'style/home.styl';

const noop = function () {};
const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({

});


@connect(mapStateToProps, mapDispatchToProps)
export default class App extends Component {

    static propTypes = {
    }

    static defaultProps = {

    }

    render() {
        // const {

        // } = this.props;

        return (
            <div>
                <GotoTop visibilityHeight={30} onClick={noop} target={noop}/>
            </div>
        );
    }
}
