/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, StyleSheet, Text } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
import { STYLES, VARS } from '../Styles';
// local components
import FormSwitchInput from '../components/FormSwitchInput';
// icons
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/icons/selection.json';
const Icon = createIconSetFromIcoMoon( icoMoonConfig, 'icomoon', 'icomoon.ttf' );
// context
import { UserContext } from '../context/UserContext';
import { _i } from '../Translations';

/*******************************************************************************
 * UserSettingsMarketing Class
 ******************************************************************************/
class UserSettingsMarketing extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
           
        };
    }

    _save = () => {
        this.context.updateMarketing()
            .then( data => {
                Alert.alert('Thank you', 'Your updates have been saved');
            })
            .catch(error => {
                Alert.alert('Thank you', 'Your updates have been saved');
                //console.warn( 'updateProfile error', error );
            });
    }

    render() {

        const { navigate } = this.props.navigation;

        return (
            <UserContext.Consumer>{( userContext ) => {
                const { fields, updateMarketing } = userContext;

                return(
                    <View>
                        <FormSwitchInput
                            label={'Email'}
                            value={ fields.marketing.marketingEmail.value }
                            onValueChange={ newValue => updateMarketing( 'marketingEmail', newValue )}
                        />
                        <FormSwitchInput
                            label={'SMS'}
                            value={ fields.marketing.marketingSMS.value }
                            onValueChange={ newValue => updateMarketing( 'marketingSMS', newValue )}
                        />
                        <FormSwitchInput
                            label={'Post'}
                            value={ fields.marketing.marketingPost.value }
                            onValueChange={ newValue => updateMarketing( 'marketingPost', newValue )}
                        />
                    </View>
                );

            }}</UserContext.Consumer>
        );
    }
}

const styles = StyleSheet.create({

});

UserSettingsMarketing.contextType = UserContext;

// Wrap and export
export default function( props ) {

    const navigation = useNavigation();
    
    return <UserSettingsMarketing {...props} navigation={navigation} />;
}
