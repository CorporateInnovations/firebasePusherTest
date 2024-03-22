/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/
// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, Dimensions, StyleSheet, ImageBackground } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
import { TouchableHighlight } from 'react-native-gesture-handler';
// local components
import GeneralIcon from '../components/GeneralIcon';
// context
import { LearnContext } from '../context/LearnContext';
// config
import { STYLES, VARS } from '../Styles';

const DIMENSIONS = Dimensions.get('screen');

/*******************************************************************************
 * LearnModule Class
 ******************************************************************************/
class LearnModule extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
        };
    }

    _isMounted = false;

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {

        return (
            <View><Text>learn module component</Text></View>
        );
    }
}

LearnModule.contextType = LearnContext;

const styles = StyleSheet.create({
   
});

export default function( props ) {

    const navigation = useNavigation();

    return <LearnModule {...props} navigation={navigation} />;
}
