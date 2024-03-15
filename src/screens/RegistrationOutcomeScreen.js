// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, SafeAreaView } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';

import { RegistrationContext } from '../context/RegistrationContext';

import LinearGradient from 'react-native-linear-gradient';

import HeadingGroup from '../components/HeadingGroup';
import ButtonBlock from '../components/ButtonBlock';
import AnimatedView from '../components/AnimatedView';

import { _i } from '../Translations';

import { STYLES } from '../Styles';

class RegistrationOutcomeScreen extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            foo: 'bar'
        };
    }

    _isMounted = false;

    _isLoading = false;

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
                const { abtaNumber, email } = registrationContext.fields;
                return (
                    <LinearGradient colors={STYLES.gradients.pink} start={STYLES.gradients.top} end={STYLES.gradients.bottom} style={{ flex: 1 }}>
                        <SafeAreaView style={STYLES.container.default}>
                            <View style={STYLES.container.default}>
                                <View style={STYLES.section.large}>
                                    <HeadingGroup
                                        heading={ _i('Thank you')}
                                        body={ _i('Our team will review your registration request and contact you at the work email provided. If approved, you will be able to proceed with creating your account.')}
                                        textColor={ STYLES.colors.white }
                                    />
                                </View>
                            </View>
                            <View style={{...STYLES.container.default, alignItems: 'flex-end', justifyContent: 'flex-end', alignContent: 'flex-end' }}>
                                <AnimatedView
                                    duration={400}
                                    animationName={'fade-in-down'}
                                    customStyle={STYLES.section.large}
                                >
                                    <ButtonBlock
                                        color={'navy'}
                                        label={_i('Back to Sign In')}
                                        customStyle={{ marginBottom: 20 }}
                                        xAdjust={36}
                                        onPressEvent={ () => navigate('login.login') }
                                    />
                                </AnimatedView>
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

    return <RegistrationOutcomeScreen {...props} navigation={navigation} />;
}