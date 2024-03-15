/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { Text, Dimensions, Share, StyleSheet, View , TouchableOpacity} from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
// icons
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/icons/selection.json';
const Icon = createIconSetFromIcoMoon( icoMoonConfig, 'icomoon', 'icomoon.ttf' );

import { STYLES, VARS } from '../Styles';

const DIMENSIONS = Dimensions.get('screen');

/*******************************************************************************
 * DeveloperErrorLog Class
 ******************************************************************************/
class DeveloperErrorLog extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {

        };
    }

    _share = async () => {

        const error = {
            heading: this.props.log.heading || 'heading missing',
            date: this.props.log.date || 'date missing',
            error: typeof this.props.log.error === 'string' ? this.props.log.error : JSON.stringify( this.props.log.error ),
            location: this.props.log.location || 'no location'
        }

        const messageString = 'ERROR REPORT: ' + error.heading + ' DATE: ' + error.date + ' AT: ' + error.location + ' DETAILS: ' + error.error;

        const shared = await Share.share({
            message: messageString
        });
    }

    render() {

        const { navigate } = this.props.navigation;
        const log = this.props.log;
        
        return (
            <View style={{
                ...STYLES.panel.block,
                backgroundColor: '#f9d5e5',
                borderColor: '#c83349',
            }}> 
                <View style={{ ...STYLES.panel.inner }}> 
                    <Text style={{ ...STYLES.panel.text_bold, color: '#c83349' }}>{ log.date }</Text>
                    <Text style={{ ...STYLES.panel.text_bold, color: '#c83349' }}>{ log.heading }</Text>
                    <Text style={{ ...STYLES.panel.text_light, color: '#c83349' }}>{ `Location Code: ${log.location}` }</Text>
                    <Text style={{ ...STYLES.panel.text_light, color: '#c83349' }}>{ typeof log.error === 'string' ? log.error : JSON.stringify( log.error ) }</Text>
                </View>
                <TouchableOpacity
                    onPress={ () => this._share() }
                    style={{...STYLES.panel.button, borderTopColor: '#c83349' }}
                >
                    <Text style={{ ...STYLES.panel.button_text, color: '#c83349' }}>Send Error Report</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={ () => this.props.deleteErrorLog( log.id ) }
                    style={{...STYLES.panel.button, borderTopColor: '#c83349' }}
                >
                    <Text style={{ ...STYLES.panel.button_text, color: '#c83349' }}>Delete</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({

});

    // Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <DeveloperErrorLog {...props} navigation={navigation} />;
}