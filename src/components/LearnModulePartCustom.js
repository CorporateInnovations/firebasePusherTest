/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/
// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, Dimensions, StyleSheet, Alert } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
// local components
import GeneralHTML from '../components/GeneralHTML';
// context
import { LearnContext } from '../context/LearnContext';
// config
import { STYLES, VARS } from '../Styles';
import {_i} from '../Translations';
import CONFIG from '../Config';

const DIMENSIONS = Dimensions.get('screen');

/*******************************************************************************
 * LearnModulePartCustom Class
 ******************************************************************************/
export default class LearnModulePartCustom extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {

        };
    }

    _isMounted = false;

    componentDidMount() {
        this._isMounted = true;
        this.props.enableNext();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {

        return (
            <View style={{marginBottom: VARS.spacer.small}}>
                <Text>custom</Text>
            </View>
        );
    }
}

LearnModulePartCustom.contextType = LearnContext;

const styles = StyleSheet.create({
   
});
