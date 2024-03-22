// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { SafeAreaView, StyleSheet, Text, View, ScrollView } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
// context
import { AuthContext } from '../context/AuthContext';
// styles
import { STYLES, VARS } from '../Styles';
import { _i } from '../Translations';
// components
import ButtonBlock from '../components/ButtonBlock';
import AnimatedView from '../components/AnimatedView';
import HeadingGroup from '../components/HeadingGroup';
import GeneralIcon from '../components/GeneralIcon';
import GeneralMessage from '../components/GeneralMessage';
import LoadingSpinner from '../components/LoadingSpinner';

class ChallengeIndexScreen extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            challengeSubmitted: false,
            step: 1
        };
    }

    _isMounted = false;

    _init = async () => {
        //this.context.setupChallenge();
    }

    _startApproval = async () => {

        await this.context.setChallengeStep(2);

        if( this.context.challengeMethod?.isBiometric) {
            this.context.bioVerifyChallenge();
        }
    }

    componentDidMount() {
        this._isMounted = true;
        this._init();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            <AuthContext.Consumer>{( authContext ) => {

                const { 
                    updateChallenge,
                    challengeUpdatePending,
                    challengeUpdateComplete,
                    challengeSuccess,
                    resetChallengeState,
                    challengeMethod,
                    submitChallenge,
                    useKnowledgeChallenge,
                    allowBiometricRetry,
                    bioVerifyChallenge,
                    challengeValue,
                    challengeError,
                    challengeErrorMessage,
                    renderFields,
                    submitKnowldge,
                    challengeStep,
                    rejectChallenge,
                    challengeManuallyRejected
                } = authContext;

                if( challengeError ) {
                    return (
                        <SafeAreaView style={{...STYLES.container.center, backgroundColor: STYLES.colors.white}}>
                            <GeneralMessage color={STYLES.colors.navy.default} message={challengeErrorMessage || _i('There was an error')} />
                        </SafeAreaView>
                    );
                }

                if( challengeUpdatePending ) {
                    return (
                        <SafeAreaView style={{...STYLES.container.center, backgroundColor: STYLES.colors.white}}>
                            <LoadingSpinner color={STYLES.colors.navy.default} size={60} />
                        </SafeAreaView>
                    );
                }

                if( challengeUpdateComplete ) {
                    return (
                        <SafeAreaView style={{...STYLES.container.center, backgroundColor: STYLES.colors.white}}>
                            <AnimatedView
                                duration={400}
                                animationName={'fade-in-up'}
                                customStyle={{...STYLES.section.large, flex: 0 }}
                            >
                                {
                                    !challengeManuallyRejected &&
                                    <HeadingGroup
                                        heading={ challengeSuccess ? _i('Approved!') : _i('Failed')}
                                        body={ challengeSuccess ? _i('Your transaction has been verified') : _i('Your transaction was not verified.') }
                                        textColor={ STYLES.colors.navy.default }
                                    />

                                }
                                {
                                    challengeManuallyRejected &&
                                    <HeadingGroup
                                        heading={ _i('Transaction Rejected') }
                                        body={ _i('The transaction has been rejected and will not be authorised.') }
                                        textColor={ STYLES.colors.navy.default }
                                    />

                                }
                                <ButtonBlock
                                    color={'navy'}
                                    label={_i('Done')}
                                    xAdjust={36}
                                    customStyle={{marginTop:40}}
                                    onPressEvent={ () => resetChallengeState() }
                                />
                            </AnimatedView>
                        </SafeAreaView>
                    )
                }

                return (
                    <SafeAreaView style={{...STYLES.container.default, backgroundColor: STYLES.colors.white}}>
                        <ScrollView contentContainerStyle={{ flex: 1 }}>
                            <AnimatedView
                                duration={400}
                                animationName={'fade-in-up'}
                                customStyle={{...STYLES.section.large, flex: 0 }}
                            >
                                <HeadingGroup
                                    heading={ _i('Approval Required')}
                                    body={ _i('Please confirm you want to make the following payment.') }
                                    textColor={ STYLES.colors.navy.default }
                                />
                                
                            </AnimatedView>
                            {
                                challengeStep === 1 &&
                                <AnimatedView
                                    duration={400}
                                    animationName={'fade-in-up'}
                                >
                                    <View style={{
                                        ...STYLES.text.paragraph,
                                        flexDirection: 'row',
                                        justifyContent: 'center'
                                    }}>
                                        <Text style={{...STYLES.text.heading2, color: STYLES.colors.navy.default}}>{ challengeValue || 'Value Unknown'}</Text>
                                    </View>
                                </AnimatedView>
                            }
                            {
                                challengeStep === 2 &&
                                <AnimatedView
                                    duration={400}
                                    animationName={'fade-in-up'}
                                    customStyle={{...STYLES.section.large, flex: 2 }}
                                >
                                    {
                                        challengeMethod.type == 'passcode' &&
                                        <View>
                                            { renderFields('challenge') }
                                        </View>
                                    }
                                    {
                                        ( challengeMethod.type == 'FaceID' || challengeMethod.type == 'TouchID' || challengeMethod.type == 'Biometrics' ) &&
                                        <View style={{alignItems:'center'}}>
                                            <GeneralIcon name={ challengeMethod.icon } size={ 100 } color={ STYLES.colors.navy.default } />
                                            <GeneralMessage message={challengeMethod.body} />
                                        </View>
                                    }
                                </AnimatedView>
                            }

                            <AnimatedView
                                duration={400}
                                animationName={'fade-in-down'}
                                customStyle={{...STYLES.section.large, flex: 0 }}
                            >
                                {
                                    challengeStep === 1 &&
                                    <>
                                        <ButtonBlock
                                            color={'navy'}
                                            label={_i('Cancel Transaction')}
                                            xAdjust={36}
                                            customStyle={{ marginBottom: 20 }}
                                            onPressEvent={ () => rejectChallenge() }
                                        />
                                        <ButtonBlock
                                            color={'yellow'}
                                            label={_i('Approve Transaction')}
                                            xAdjust={36}
                                            onPressEvent={ () => this._startApproval() }
                                        />
                                    </>
                                }

                                {
                                    challengeStep === 2 &&
                                    <>
                                        {
                                            ( allowBiometricRetry ) &&
                                            <ButtonBlock
                                                color={'yellow'}
                                                label={_i('Try again')}
                                                xAdjust={36}
                                                customStyle={{ marginBottom: 20 }}
                                                onPressEvent={ () => bioVerifyChallenge() }
                                            />
                                        }
                                        {
                                            ( challengeMethod.type == 'FaceID' || challengeMethod.type == 'TouchID' || challengeMethod.type == 'Biometrics' ) &&
                                            <ButtonBlock
                                                color={'navy'}
                                                label={_i('Verify with passcode')}
                                                xAdjust={36}
                                                customStyle={{ marginBottom: 20 }}
                                                onPressEvent={ () => useKnowledgeChallenge() }
                                            />
                                        }
                                        {
                                            challengeMethod.type == 'passcode' &&
                                            <ButtonBlock
                                                color={'yellow'}
                                                label={_i('Submit passcode')}
                                                xAdjust={36}
                                                customStyle={{ marginBottom: 20 }}
                                                onPressEvent={ () => submitKnowldge() }
                                            />
                                        }
                                    </>
                                }
                            </AnimatedView>
                        </ScrollView>
                    </SafeAreaView>
                );
            }}</AuthContext.Consumer>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
});

ChallengeIndexScreen.contextType = AuthContext;

export default function( props ) {

    const navigation = useNavigation();

    return <ChallengeIndexScreen {...props} navigation={navigation} />;
}