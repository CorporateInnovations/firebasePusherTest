// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, SafeAreaView, StyleSheet, ScrollView, Alert, Linking } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';

// context
import { RegistrationContext } from '../context/RegistrationContext';

// external imports
import LinearGradient from 'react-native-linear-gradient';

// local components
import HeadingGroup from '../components/HeadingGroup';
import ProgressStepper from '../components/ProgressStepper';
import ButtonBlock from '../components/ButtonBlock';
import LoadingModal from '../components/LoadingModal';

// helpers
// https://github.com/react-native-linear-gradient/react-native-linear-gradient
import { _i } from '../Translations';

// styles
import { STYLES } from '../Styles';

class RegistrationMarketingScreen extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            saveInProgress: false
        };
    }

    _isMounted = false;

    _isLoading = false;

    _saveStep = () => {

        if( !this.context.isValid(['marketing']) ) {
            // handle the error
            return;
        }

        this.setState({ saveInProgress: true });

        this.context.verify()
            .then(data => {
                this.props.navigation.navigate('register.verify_email');
            })
            .catch(error => {
                const message = _.get( error, 'message', 'Sorry, we were unable to process your registration at this point, please try again later.' );
                Alert.alert( 'Registration Error (Phoenix)', message );
            })
            .finally(() => {
                if( this._isMounted ) {
                    this.setState({ saveInProgress: false });
                }
            });
    };

    componentDidMount() {

        this._isMounted = true;

    }

    componentWillUnmount() {

        this._isMounted = false;

    }

    render() {

        const { navigate } = this.props.navigation;

        return (
            <RegistrationContext.Consumer>{( registrationContext ) => {
                const { totalSteps, renderFields } = registrationContext;
                return (
                    <LinearGradient colors={STYLES.gradients.purple} start={STYLES.gradients.top} end={STYLES.gradients.bottom} style={{ flex: 1 }}>
                        <SafeAreaView style={STYLES.container.default}>
                            <ScrollView>
                                <ProgressStepper step={3} total={totalSteps} />
                                <HeadingGroup
                                    heading={ _i('Marketing')}
                                    textColor={ STYLES.colors.white }
                                />
                                <View style={STYLES.section.large}>
                                    <View style={STYLES.text.paragraph}>
                                        <Text style={styles.body_text}>{ _i('Check this box to opt-in and receive our top offers, flash sales and exciting updates.') }</Text>
                                    </View>
                                    { renderFields( 'marketing' ) }
                                    <View style={STYLES.text.paragraph}>
                                        <Text style={styles.body_text}>{ _i('You can adjust these preferences at any time but please allow 48 hours for us to action any new preferences indicated. Be advised that if you opt out of all forms of marketing we will delete your details from our marketing database.') }</Text>
                                    </View>
                                    <View style={STYLES.text.paragraph}>
                                        <Text style={styles.body_text}>{ _i('See our full ') }<Text style={styles.link_text} onPress={ () => Linking.openURL('https://www.myclubroyal.co.uk/#/privacy') }>{ _i('Privacy Policy.') }</Text></Text>
                                    </View>
                                    <ButtonBlock
                                        color={this.state.saveInProgress ? 'disabled' : 'yellow'}
                                        label={ this.state.saveInProgress ? _i('Saving') : _i('Next')}
                                        xAdjust={36}
                                        customStyle={{ marginBottom: 20 }}
                                        onPressEvent={ () => this._saveStep() }
                                        disabled={this.state.saveInProgress}
                                    />
                                    <ButtonBlock
                                        color={'navy'}
                                        label={_i('Back')}
                                        xAdjust={36}
                                        onPressEvent={ () => navigate('register.profile') }
                                        disabled={this.state.saveInProgress}
                                    />
                                </View>
                            </ScrollView>
                        </SafeAreaView>
                    </LinearGradient>
                );
            }}</RegistrationContext.Consumer>
        );
    };

};

const styles = StyleSheet.create({
    body_text: {
        ...STYLES.text.body_light,
        color: STYLES.colors.white
    },
    link_text: {
        ...STYLES.text.body_light,
        color: STYLES.colors.yellow.default
    }
});

RegistrationMarketingScreen.contextType = RegistrationContext;

    // Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <RegistrationMarketingScreen {...props} navigation={navigation} />;
}