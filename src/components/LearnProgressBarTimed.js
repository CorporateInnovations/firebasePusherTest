/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/
// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, Dimensions, StyleSheet, Alert, Button } from 'react-native';
// external imports
import LinearGradient from 'react-native-linear-gradient';
// local components
//import GeneralIcon from '../components/GeneralIcon';
// context
import { LearnContext } from '../context/LearnContext';
// config
import { STYLES, VARS } from '../Styles';
import {_i} from '../Translations';
import CONFIG from '../Config';
// icon
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/icons/selection.json';
const Icon = createIconSetFromIcoMoon(icoMoonConfig, 'icomoon', 'icomoon.ttf' );

const DIMENSIONS = Dimensions.get('screen');

/*******************************************************************************
 * LearnProgressBar Class
 ******************************************************************************/
export default class LearnProgressBarTimed extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            total_parts: null,
            timerController: null,
            time: 5
        };
    }

    _isMounted = false;


    _getTotalPartCount = () => {
        return Array.isArray( this.context.currentModule?.parts[0]?.questions ) ? this.context.currentModule?.parts[0]?.questions.length : 0;
    }

    _getCompletion = () => {
        const total = this._getTotalPartCount();

        if( isNaN(total) || isNaN(this.context.questionIndex)) return '';

        return `${(this.context.questionIndex + 1)}/${total}`;
    }

    _getBarWidth = () => {
        const total = this._getTotalPartCount();
        const fullWidth = DIMENSIONS.width - (VARS.spacer.large * 2)  - (25 + VARS.spacer.large)

        if(
            isNaN(total) ||
            total == 0 ||
            isNaN(this.context.questionIndex) ||
            (this.context.questionIndex + 1) > total
        ) return fullWidth;

        return (( this.context.questionIndex + 1 ) / total ) * fullWidth;
    }

    componentDidMount() {
        this._isMounted = true;
        this._getTotalPartCount();
        this.setState({time: this.context.currentModule.duration})
        this._startTimer();
    }

    componentWillUnmount() {
        this._isMounted = false;
        this._stopTimer();
    }

    _stopTimer = () => {
        clearInterval(this.state.timerController);
    }

    _endAccreditation = () => {
        this._stopTimer();
        this.props.timeUp();
    }

    _startTimer = () => {
        let that = this;
        this.state.timerController = setInterval(() => {
            that.setState((prevState)=> ({ time: prevState.time -1 }));
            if (that.state.time === 0) {
                that._endAccreditation();
            }
        }, 1000);
    }

    _formatMSS(s) {
        return (s-(s%=60))/60+(9<s?':':':0')+s
    }

    render() {
        return (
            <LearnContext.Consumer>{( learnContext) => {
                const {
                    isAccreditation,
                    questionIndex
                } = learnContext;
                return (
                    <View style={styles.container}>
                        <View style={styles.outerBar}>
                            <LinearGradient colors={STYLES.gradients.purple} start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                                            style={{...styles.innerBar, width: this._getBarWidth(questionIndex)}}>
                                <Text style={styles.barText}>{this._getCompletion()}</Text>
                            </LinearGradient>
                        </View>
                        <Icon
                            name={`rp-icon-locked`}
                            size={15}
                            color={'black'}
                            style={{paddingTop: 5, paddingLeft: 10, textAlign: 'center'}}
                        />
                        <Text style={{
                            paddingLeft: 5,
                            paddingRight: VARS.spacer.large,
                            paddingTop: 5, ...STYLES.text.small_bold,
                            color: (this.state.time < 300 ? 'red' : 'black')
                        }}>
                            {this._formatMSS(this.state.time)}
                        </Text>
                    </View>
                );
            }}</LearnContext.Consumer>
        );
    }
}

LearnProgressBarTimed.contextType = LearnContext;

const styles = StyleSheet.create({
    container: {
        paddingVertical: VARS.spacer.small,
        paddingHorizontal: VARS.spacer.large,
        flexDirection: 'row'
    },
    outerBar: {
        width: DIMENSIONS.width - (2 * VARS.spacer.large) - (25 + VARS.spacer.large),
        height: 30,
        borderRadius: 15,
        backgroundColor: '#F0F0F0'
    },
    innerBar: {
        width: '100%',
        height: 30,
        borderRadius: 15,
        flex: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    barText: {
        ...STYLES.text.small_bold,
        paddingRight: 12,
        color: VARS.colors.white
    }
});
