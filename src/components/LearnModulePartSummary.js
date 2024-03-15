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
 * LearnModulePartSummary Class
 ******************************************************************************/
class LearnModulePartSummary extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {

        };
    }

    _isMounted = false;

    _enableTimeout = null;

    componentDidMount() {
        this._isMounted = true;

        if(this._enableTimeout) clearTimeout(this._enableTimeout);

        this._enableTimeout = setTimeout(() => {
            this.props.enableNext();
        }, 1000);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {

        return (
            <View style={{marginBottom: VARS.spacer.small}}>
                <GeneralHTML html={this.props.part.structure.content} />
            </View>
        );
    }
}

LearnModulePartSummary.contextType = LearnContext;

const styles = StyleSheet.create({

});

export default function( props ) {

    const navigation = useNavigation();

    return <LearnModulePartSummary {...props} navigation={navigation} />;
}
