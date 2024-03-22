/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { Text, Dimensions, Alert, StyleSheet, View, TouchableOpacity } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
// icons
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/icons/selection.json';
const Icon = createIconSetFromIcoMoon( icoMoonConfig, 'icomoon', 'icomoon.ttf' );

import { STYLES, VARS } from '../Styles';

const DIMENSIONS = Dimensions.get('screen');

/*******************************************************************************
 * DeveloperData Class
 ******************************************************************************/
class DeveloperData extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {

        };
    }

    render() {

        const { navigate } = this.props.navigation;
        const type = this.props.type;
        
        return (
            <View
                style={{
                    flex: 0,
                    flexDirection: 'row',
                    flexWrap: 'nowrap',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    backgroundColor: '#F0F0F0',
                    paddingTop: 5,
                    paddingBottom: 5,
                    paddingRight: 10,
                    paddingLeft: 10,
                    borderRadius: 4,
                    marginBottom: 8
                }}
            > 
                <View style={{width: '40%', paddingRight: 5, flexShrink: 1}}>
                    <Text style={{ ...STYLES.text.body_bold, fontSize: 10, lineHeight: 14 }}>{ this.props.label }</Text>
                </View>
                <View style={{width: '60%', paddingLeft: 5, flexShrink: 1}}>
                    <Text style={{ ...STYLES.text.body_light, fontSize: 10, lineHeight: 14 }}>{ this.props.value }</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({

});

    // Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <DeveloperData {...props} navigation={navigation} />;
}