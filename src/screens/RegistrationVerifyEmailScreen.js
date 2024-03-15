// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';

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

class RegistrationVerifyEmailScreen extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            saveInProgress: false
        };
    }

    _isMounted = false;

    _isLoading = false;

    _reSendVerification = () => {

    }

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
                const { totalSteps } = registrationContext;
                return (
                    <LinearGradient colors={STYLES.gradients.purple} start={STYLES.gradients.top} end={STYLES.gradients.bottom} style={{ flex: 1 }}>
                        <SafeAreaView style={STYLES.container.default}>
                            <ProgressStepper step={4} total={totalSteps} />
                            <HeadingGroup
                                heading={ _i('Verify Email')}
                                body={_i('We have sent you a verification link to the login/individual email address you provided. Please open that link to complete your Club Royal account application.')}
                                textColor={ STYLES.colors.white }
                            />
                            <View style={STYLES.section.large}>
                                <ButtonBlock
                                    color={'navy'}
                                    label={_i('Back to Login')}
                                    xAdjust={36}
                                    onPressEvent={ () => navigate('app', { screen: 'login.login' }) }
                                />
                            </View>
                        </SafeAreaView>
                    </LinearGradient>
                );
            }}</RegistrationContext.Consumer>
        );
    };

};

    // Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <RegistrationVerifyEmailScreen {...props} navigation={navigation} />;
}