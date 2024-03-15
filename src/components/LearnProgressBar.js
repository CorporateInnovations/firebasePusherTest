/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/
// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, Dimensions, StyleSheet, Alert } from 'react-native';
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

const DIMENSIONS = Dimensions.get('screen');

/*******************************************************************************
 * LearnProgressBar Class
 ******************************************************************************/
export default class LearnProgressBar extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            total_parts: null,
        };
    }

    _isMounted = false;

    _getTotalPartCount = () => {
        return Array.isArray( this.context.currentModule?.parts ) ? this.context.currentModule?.parts.length : 0;
    }

    _getCurrentPartNumber = () => {
        return !isNaN( this.props.partIndex ) ? this.props.partIndex : 0;
    }

    _getCompletion = () => {
        const total = this._getTotalPartCount();

        if( isNaN(total) || isNaN(this.props.partIndex)) return '';

        return `${(this.props.partIndex + 1)}/${total}`;
    }

    _getBarWidth = () => {
        const total = this._getTotalPartCount();
        const fullWidth = DIMENSIONS.width - (VARS.spacer.large * 2);

        if(
            isNaN(total) ||
            total == 0 ||
            isNaN(this.props.partIndex) ||
            (this.props.partIndex + 1) > total
        ) return fullWidth;

        return (( this.props.partIndex + 1 ) / total ) * fullWidth;
    }

    componentDidMount() {
        this._isMounted = true;
        this._getTotalPartCount();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {

        return (
            <View style={styles.container}>
                <View style={styles.outerBar}>
                    <LinearGradient colors={STYLES.gradients.purple} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{...styles.innerBar, width: this._getBarWidth()}}>
                        <Text style={styles.barText}>{ this._getCompletion() }</Text>
                    </LinearGradient>
                </View>
            </View>
        );
    }
}

LearnProgressBar.contextType = LearnContext;

const styles = StyleSheet.create({
    container: {
        paddingVertical: VARS.spacer.small,
        paddingHorizontal: VARS.spacer.large
    },
    outerBar: {
        width: DIMENSIONS.width - (2 * VARS.spacer.large),
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
