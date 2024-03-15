/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { STYLES, VARS } from '../Styles';

const DIMENSIONS = Dimensions.get('screen');

/*******************************************************************************
 * ProgressStepper Class
 ******************************************************************************/
export default class ProgressStepper extends React.Component {

    constructor( props ) {

        super( props );

        let steps = [];

        for( let i = 0; i < this.props.total; i++ ) {
            steps.push({
                key: ( i + 1 ),
            })
        }

        this.state = {
            steps: steps
        };
    }

    _renderSteps = () => {
        return this.state.steps.map((item) => {
            return (
                <View key={item.key} style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', flexGrow: item.key === 1 ? 1 : 2 }}>
                    {
                        item.key > 1 &&
                        <View style={styles.spacer}></View>
                    }
                    <View style={{...styles.step, borderColor: this.props.step === item.key ? VARS.colors.yellow.default : VARS.colors.purple.xxlight, backgroundColor: this.props.step === item.key ? VARS.colors.yellow.default : 'transparent' }}>
                        <Text style={{...styles.step_text, color: this.props.step === item.key ? VARS.colors.navy.default : VARS.colors.purple.xxlight }}>{ item.key }</Text>
                    </View>
                </View>
            );
        });
    }

    render() {

        return (
            <View style={styles.stepper}>
                { this._renderSteps() }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    stepper: {
        flex: 0,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'center',
        width: DIMENSIONS.width,
        paddingLeft: 36,
        paddingRight: 36,
        marginTop: 40,
        marginBottom: 40
    },
    step: {
        //flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        width: 39,
        height: 39,
        borderRadius: 4,
        borderColor: STYLES.colors.white,
        borderWidth: 2,
        backgroundColor: 'transparent',
    },
    step_text: {
        fontFamily: VARS.fonts.family.darwin_bold,
        fontSize: 14,
        textAlign: 'center',
        color: VARS.colors.white
    },
    spacer: {
        flex: 1,
        height: 2,
        backgroundColor: VARS.colors.purple.xxlight
    }
});
