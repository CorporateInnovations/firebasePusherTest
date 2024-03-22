// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, SafeAreaView, ScrollView, Dimensions, Alert } from 'react-native';
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
import { STYLES } from '../Styles';
import { _i } from '../Translations';

const DIMENSIONS = Dimensions.get('screen');

class LearnModuleShowScreen extends React.Component {

    constructor( props ) {

        super( props );

        const { moduleId, moduleTitle } = props.route.params;

        this.state = {
            moduleId,
            moduleTitle,
            loadingCurrentModule: true,
        };
    }

    _init = async () => {
        await this.context.resetCurrentModule();
        await this.context.getUserLearnModule( this.state.moduleId );
        if( this._isMounted ) this.setState({ loadingCurrentModule: false });

    }

    _isMounted = false;

    _isLoading = false;

    componentDidMount() {
        this._isMounted = true;
        if( this.state.moduleTitle ) this.props.navigation.setOptions({ headerTitle: this.state.moduleTitle, });
        this._init();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    _startModule = (currentModule) => {
        this.context.setIsAccreditation(false);
        this.props.navigation.navigate('learn.module.part.show', { moduleId: currentModule.id, moduleTitle: currentModule.title, partIndex: 0 })
    }

    async startModuleEvent(moduleTitle, userId) {
        // await analytics().logEvent('module_view', {
        //     module_name: moduleTitle,
        //     uid: userId
        // });
    }

    render() {

        const { navigate } = this.props.navigation;

        return (
            <LearnContext.Consumer>{( learnContext ) => {

                const { currentModule, phoenixUser } = learnContext;

                if( this.state.loadingCurrentModule ) {
                    return (
                        <LinearGradient colors={STYLES.gradients.purple} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
                            <SafeAreaView style={STYLES.container.center}>
                                <LoadingSpinner color={STYLES.colors.white} />
                            </SafeAreaView>
                        </LinearGradient>
                    )
                }

                if( !currentModule ) {
                    return (
                        <LinearGradient colors={STYLES.gradients.purple} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
                            <SafeAreaView style={STYLES.container.center}>
                                <GeneralMessage message={_i('Unable to load module')} color={STYLES.colors.white} />
                            </SafeAreaView>
                        </LinearGradient>
                    )
                }

                return (
                    <LinearGradient colors={STYLES.gradients.purple} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
                        <SafeAreaView style={STYLES.container.default}>
                            <ScrollView>
                                {
                                    currentModule.thumbnail &&
                                    <AnimatedView animationName={'fade-in'}>
                                        <AutoHeightImage
                                            style={{flex: 0}}
                                            defaultSource={ require('../../assets/images/placeholder-800-600-yellow.png') }
                                            width={DIMENSIONS.width}
                                            source={ { uri: currentModule.thumbnail }}
                                        />
                                    </AnimatedView>
                                }

                                <View style={{...STYLES.section.large, paddingBottom: 0 }}>
                                    <AnimatedView animationName={'fade-in'}>
                                        {
                                            currentModule.title &&
                                            <View style={{ marginBottom: currentModule.subtitle ? 5 : ( currentModule.description ? 20 : 0 ) }}>
                                                <Text style={{...STYLES.text.heading3, color: STYLES.colors.white}}>{currentModule.title}</Text>
                                            </View>
                                        }
                                        {
                                            currentModule.subtitle &&
                                            <View style={{ marginBottom: currentModule.description ? 20 : 0 }}>
                                                <Text style={{...STYLES.text.heading4, color: STYLES.colors.white}}>{currentModule.subtitle}</Text>
                                            </View>
                                        }
                                        {
                                            currentModule.description &&
                                            <View style={{}}>
                                                <Text style={{...STYLES.text.body_light, color: STYLES.colors.white }}>{currentModule.description}</Text>
                                            </View>
                                        }
                                    </AnimatedView>
                                </View>

                                <View style={{...STYLES.section.large, paddingBottom: 0 }}>
                                    <AnimatedView animationName={'fade-in'}>
                                        <ButtonBlock
                                            color={ 'yellow' }
                                            label={_i('Start Module')}
                                            xAdjust={36}
                                            customStyle={{ marginBottom: 10 }}
                                            onPressEvent={ () => { this.startModuleEvent(currentModule.slug, phoenixUser.user.id), this._startModule(currentModule) } }
                                        />
                                    </AnimatedView>
                                </View>

                                <View style={STYLES.section.large}>
                                    <AnimatedView animationName={'fade-in-up'}>
                                        <LearnModulePartsOverview />
                                    </AnimatedView>
                                </View>

                            </ScrollView>
                        </SafeAreaView>
                    </LinearGradient>
                );
            }}</LearnContext.Consumer>
        );
    };

};

LearnModuleShowScreen.contextType = LearnContext;

// Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <LearnModuleShowScreen {...props} navigation={navigation} />;
}
