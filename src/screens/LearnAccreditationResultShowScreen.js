// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import {View, Text, SafeAreaView, ScrollView, Dimensions, Alert, StyleSheet, Image, Linking} from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
// Google Analytics
// import firebase from '@react-native-firebase/app';
// import analytics from '@react-native-firebase/analytics'
// external imports
import LinearGradient from 'react-native-linear-gradient';
// https://github.com/vivaxy/react-native-auto-height-image
import AutoHeightImage from 'react-native-auto-height-image';
// local
import LoadingSpinner from '../components/LoadingSpinner';
import GeneralMessage from '../components/GeneralMessage';
import LearnModulePartsOverview from '../components/LearnModulePartsOverview';
import AnimatedView from '../components/AnimatedView';
import ButtonBlock from '../components/ButtonBlock';
import GeneralTabsHeader from '../components/GeneralTabsHeader';

// context
import { LearnContext } from '../context/LearnContext';
// styles
import {STYLES, VARS} from '../Styles';
import { _i } from '../Translations';
import * as UserService from '../services/user';

import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/icons/selection.json';
const Icon = createIconSetFromIcoMoon(icoMoonConfig, 'icomoon', 'icomoon.ttf' );

const DIMENSIONS = Dimensions.get('screen');

class LearnAccreditationResultShowScreen extends React.Component {

    constructor( props ) {

        super( props );

        const { accreditationResponse } = props.route.params;
        this.state = {
            accreditationResponse: accreditationResponse
        };
    }

    _init = async () => {
        if( this._isMounted ) this.setState({ loadingAccreditation: false });
    }

    _isMounted = false;
    _isLoading = false;

    async learnModuleAccreditationCompleteEvent(moduleTitle, userId) {
        // await analytics().logEvent('module_accreditation_complete', {
        //     module_name: moduleTitle,
        //     uid: userId
        // });
    }

    componentDidMount() {
        this._isMounted = true;
        this._init();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    _downloadCertificate = () => {
        Linking.openURL(this.state.accreditationResponse.accreditations[0].certificate_path).catch(err => console.error("Couldn't load page", err));
    }
    _backToLearn = () => {
        this.props.navigation.reset({
            index: 0,
            routes: [{ name: 'learn.index' }],
        });
    }

    render() {

        const { navigate } = this.props.navigation;

        return (
            <LearnContext.Consumer>{( learnContext ) => {

                const { accreditationLoaded, phoenixUser, currentModule } = learnContext;

                if( !accreditationLoaded ) {
                    return (
                        <LinearGradient colors={STYLES.gradients.purple} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
                            <SafeAreaView style={STYLES.container.center}>
                                <LoadingSpinner color={STYLES.colors.white} />
                            </SafeAreaView>
                        </LinearGradient>
                    )
                }

                if( accreditationLoaded) {
                    return (
                        <LinearGradient colors={STYLES.gradients.purple} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
                            <SafeAreaView style={STYLES.container.default}>
                                <ScrollView>

                                <View style={{justifyContent: 'center', alignItems: 'center', paddingTop: VARS.spacer.large}}>

                                    {
                                        this.state.accreditationResponse.quiz_results.pass &&
                                        <Icon name={ `rc-icon-accreditation-passed` } size={ 148 } color={ STYLES.colors.white } style={{ marginLeft: VARS.spacer.large, marginRight: VARS.spacer.large, marginBottom: VARS.spacer.small }} />
                                    }
                                    {
                                        !this.state.accreditationResponse.quiz_results.pass &&
                                        <Icon name={ `rc-icon-accreditation-failed` } size={ 148 } color={ STYLES.colors.white } style={{ marginLeft: VARS.spacer.large, marginRight: VARS.spacer.large, marginBottom: VARS.spacer.small }} />
                                    }

                                </View>
                                <View style={{...STYLES.section.large, paddingBottom: VARS.spacer.large }}>
                                    <View>
                                        {
                                            this.state.accreditationResponse.quiz_results.pass &&
                                            <Text style={styles.accreditation_label}>{ _i(('Congratulations!')) }</Text>
                                        }
                                        {
                                            !this.state.accreditationResponse.quiz_results.pass &&
                                            <Text style={styles.accreditation_label}>{ _i(('Exam failed')) }</Text>
                                        }
                                    </View>
                                    <AnimatedView
                                        duration={400}
                                        animationName={'fade-in'}
                                        customStyle={{...STYLES.tabs.header_active_indicator, alignItems: 'center', alignSelf:'center'}}
                                    />
                                    <View style={{paddingTop: VARS.spacer.large}}>
                                        {
                                            this.state.accreditationResponse.quiz_results.pass &&
                                            <Text style={{color: STYLES.colors.white, textAlign: 'center' }}>
                                                Only our wisest travel agents will make it all the way to Royal Guru – the true badge of knowledge when it comes to booking Royal holidays.
                                                {"\n"}{"\n"}Keep your eyes peeled for an email from the Club Royal team regarding your exclusive benefits.
                                            </Text>
                                        }
                                        {
                                            !this.state.accreditationResponse.quiz_results.pass &&
                                            <Text style={{color: STYLES.colors.white, textAlign: 'center' }}>
                                                Sorry, you did not pass the accreditation exam on this occasion.{"\n"}{"\n"}
                                                You can re-take the exam in 24 hours.
                                            </Text>
                                        }
                                    </View>
                                </View>
                                <View style={{
                                    marginLeft: VARS.spacer.large,
                                    marginRight: VARS.spacer.large,
                                    marginTop: VARS.spacer.small,
                                    marginBottom: VARS.spacer.small,
                                }}>
                                    <AnimatedView animationName={'fade-in'}>
                                        {
                                            this.state.accreditationResponse.quiz_results.pass &&
                                            <ButtonBlock
                                                color={'yellow'}
                                                label={_i('Download Certificate')}
                                                xAdjust={VARS.spacer.large}
                                                customStyle={{marginBottom: 0}}
                                                onPressEvent={this._downloadCertificate}
                                            />
                                        }
                                        {
                                            !this.state.accreditationResponse.quiz_results.pass &&
                                            <ButtonBlock
                                                color={'yellow'}
                                                label={_i('Back to learn')}
                                                xAdjust={VARS.spacer.large}
                                                customStyle={{marginBottom: 0}}
                                                onPressEvent={() => {this.learnModuleAccreditationCompleteEvent(currentModule.slug, phoenixUser.user.id), this._backToLearn}}
                                            />
                                        }
                                    </AnimatedView>
                                    {
                                        this.state.accreditationResponse.quiz_results.pass &&
                                        <View style={{alignContent: 'center', alignSelf: 'center'}}>
                                            <Text style={{
                                                ...STYLES.text.legal_heading,
                                                color: STYLES.colors.white,
                                                textTransform: 'uppercase',
                                                paddingTop: VARS.spacer.small
                                            }} onPress={this._backToLearn}>{_i('Back to learn')}</Text>
                                        </View>
                                    }
                                </View>

                                </ScrollView>
                            </SafeAreaView>
                        </LinearGradient>
                    )
                }
            }}</LearnContext.Consumer>
        );
    };

};

LearnAccreditationResultShowScreen.contextType = LearnContext;

const styles = StyleSheet.create({
    accreditation_label: {
        ...STYLES.text.body_light,
        color: STYLES.colors.white,
        fontSize: 30,
        lineHeight: 30,
        textAlign: 'center',
    },
});

// Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <LearnAccreditationResultShowScreen {...props} navigation={navigation} />;
}
