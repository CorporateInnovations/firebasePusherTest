/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/
// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import {View, Text, Dimensions, StyleSheet, Image, TouchableOpacity, SafeAreaView, Linking, RefreshControl} from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
import { TouchableHighlight, FlatList   } from 'react-native-gesture-handler';
// local components
import LearnCategoryOverview from '../components/LearnCategoryOverview';
import GeneralMessage from '../components/GeneralMessage';
import LoadingSpinner from '../components/LoadingSpinner';
// Google Analytics
// import firebase from '@react-native-firebase/app';
// import analytics from '@react-native-firebase/analytics'
// context
import { LearnContext } from '../context/LearnContext';
// config
import { STYLES, VARS } from '../Styles';
import { _i } from '../Translations';
import GeneralTabsHeader from './GeneralTabsHeader';
import GeneralTabsPanel from './GeneralTabsPanel';
import GeneralHTML from './GeneralHTML';

import YourJourneyOverview from './YourJourneyOverview';

import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/icons/selection.json';
import AnimatedView from './AnimatedView';
import ButtonBlock from './ButtonBlock';
const Icon = createIconSetFromIcoMoon(icoMoonConfig, 'icomoon', 'icomoon.ttf' );

// react-native-virtualized-view - https://github.com/hoaphantn7604/react-native-virtualized-view
import { ScrollView } from 'react-native-virtualized-view';
import TierProgress from './TierProgress';
const DIMENSIONS = Dimensions.get('screen');

/*******************************************************************************
 * LearnUser Class
 ******************************************************************************/
class LearnUser extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            loadingCategories: true,
            activeTab: 'Modules',
            refreshing: false
        };
    }

    _isMounted = false;

    _init = async () => {

        await this.context.getUserLearnModules().then(data => {
            this.context.getYourJourney(data);
            this.context.getAccreditations(data);
            this.state.refreshing = false;
        });


        if( this._isMounted ) this.setState({ loadingCategories: false });
    }

    _renderItem = ({ item }) => (
        <LearnCategoryOverview category={ item } />
    );

    _gotoAccredidation = ( accreditation ) => {
        this.context.setAccreditationQuestionIndex(0);
        this.props.navigation.navigate('learn.module.part.show.accreditation', { moduleId: accreditation.eligibilities[0].module.id, moduleTitle: accreditation.eligibilities[0].module.title, partIndex: 0});
    }

    _renderNextUp = () => {

        if( this.context.nextUp.length === 0 ) return null;

        const module = this.context.nextUp[0];

        const { navigate } = this.props.navigation;

        return (
            <TouchableOpacity
                onPress={ () => navigate( 'learn.module.show', { moduleId: module?.id, moduleTitle: module?.title } ) }
                style={{
                    // flex: 1,
                    marginLeft: VARS.spacer.large,
                    marginRight: VARS.spacer.large,
                    marginTop: VARS.spacer.large,
                    marginBottom: VARS.spacer.small
                }}
            >
                <View style={{ marginBottom: VARS.spacer.small }}>
                    <Text style={{...STYLES.text.heading4, color: STYLES.colors.white }}>{ _i('Up Next') }</Text>
                </View>
                <Image
                    source={{ uri: module?.thumbnail }}
                    style={{
                        width: DIMENSIONS.width - ( VARS.spacer.large * 2 ),
                        height: ( DIMENSIONS.width - ( VARS.spacer.large * 2 ) ) * 0.7,
                        marginBottom: 5,
                    }}
                />
                <Text style={{...STYLES.text.body_bold, color: STYLES.colors.white}}>{ module?.title }</Text>
            </TouchableOpacity>
        );
    }

    async componentDidMount() {
        this._isMounted = true;
        this._init();

        // await firebase.app();
        // await analytics().setCurrentScreen('Learn - Overview Screen', 'learn.index');
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    _downloadCertificate = () => {
        Linking.openURL(this.context.accreditation_certificate).catch(err => console.error("Couldn't load page", err));
    }

    _onRefresh = () => {
        if(!this.state.refreshing) {
            this.state.refreshing = true;
            this._init();
        }

    }

    render() {

        if( this.state.loadingCategories ) {
            return (
                <View style={STYLES.container.center}>
                    <LoadingSpinner color={STYLES.colors.white} size={60} />
                </View>
            )
        }

        return (
            <LearnContext.Consumer>{( learnContext) => {
                const { level, categories, nextUp, tiers, accreditationLoaded, yourJourneyLoaded, accreditationAvailable, accreditationGained, accreditation_certificate, accreditation} = learnContext;
                return (
                    <>
                    <ScrollView nestedScrollEnabled={true} refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />
                    }>
                        {
                            nextUp.length > 0 && this._renderNextUp()
                        }
                        <GeneralTabsHeader style={{paddingBottom: VARS.spacer.small, paddingTop: VARS.spacer.small}}
                            tabs={[
                                { slug: 'Modules', label: _i('Modules'), setActiveTab: ( slug ) => this.setState({ activeTab: slug }) },
                                { slug: 'Accreditation', label: _i('Accreditation'), setActiveTab: ( slug ) => this.setState({ activeTab: slug }) },
                                { slug: 'yourJourney', label: _i('Your Journey'), setActiveTab: ( slug ) => this.setState({ activeTab: slug }) },
                            ]}
                            activeTabSlug={this.state.activeTab}
                            inactiveColor={STYLES.colors.white}
                            activeColor={STYLES.colors.white}
                        />
                        {
                            this.state.activeTab == 'Modules' &&
                            <TierProgress />
                        }

                        {
                            this.state.activeTab === 'Modules' &&
                                    <FlatList
                                        data={categories}
                                        renderItem={this._renderItem}
                                        keyExtractor={ item => item.id.toString() }
                                        ListEmptyComponent={<View style={STYLES.container.center}><GeneralMessage message={_i('No Learn Modules')} color={STYLES.colors.white} /></View>}
                                        ListHeaderComponent={ null }
                                    />
                        }
                        {
                            (!accreditationLoaded  && this.state.activeTab == 'Accreditation') &&
                            <View style={STYLES.container.center}>
                                <LoadingSpinner color={STYLES.colors.white} size={60} />
                            </View>
                        }
                        {
                            (accreditationLoaded && this.state.activeTab == 'Accreditation' ) &&
                            <GeneralTabsPanel>
                                <View style={{
                                    marginLeft: VARS.spacer.large,
                                    marginRight: VARS.spacer.large,
                                    marginTop: VARS.spacer.small,
                                    marginBottom: VARS.spacer.small,
                                }}>
                                    <View>
                                        <Icon
                                            name={ (!accreditationAvailable ? `rp-icon-locked` : `rc-icon-reward-status-approved`) }
                                            size={ 60 }
                                            color={ STYLES.colors.white }
                                            style={{ paddingTop: VARS.spacer.small, paddingBottom: VARS.spacer.small, textAlign: 'center' }}
                                        />
                                    </View>
                                    <View style={{...styles.row, marginBottom: VARS.spacer.small }}>
                                        {
                                            !accreditationGained &&
                                            <Text style={styles.accreditation_label}>{ _i((!accreditationAvailable ? 'Accreditation Locked' : 'Gain Accreditation')) }</Text>
                                        }
                                        {
                                            accreditationGained &&
                                            <Text style={styles.accreditation_label}>{ _i(('Accreditation Achieved')) }</Text>
                                        }

                                        <AnimatedView
                                            duration={400}
                                            animationName={'fade-in'}
                                            customStyle={{...STYLES.tabs.header_active_indicator, alignItems: 'center', alignSelf:'center'}}
                                        />
                                    </View>
                                    <View>
                                        {
                                            !accreditationGained && !accreditationAvailable &&
                                            <Text style={{color: STYLES.colors.white, textAlign: 'center' }}>
                                                Do you have what it takes to become a Royal Guru? After completing the Learn modules across each tier (Learner, Expert and Guru). Put what you’ve learnt to the test with a 30 question exam. Score highly enough and you will be officially certified as one of the wisest Royal Caribbean travel agents in the business. Show off your status with an exclusive badge, window sticker, and other pieces of merchandise. Plus be invited to exclusive Royal events when you pass the exam!
                                            </Text>
                                        }
                                        {
                                            !accreditationGained && accreditationAvailable &&
                                                <Text style={{color: STYLES.colors.white, textAlign: 'center' }}>
                                                    Do you have what it takes to become a Royal Guru? You have completed the Learn modules across each tier (Learner, Expert and Guru), now you can put what you’ve learnt to the test with a 30 question exam. Score 90% and you will be officially certified as one of the wisest Royal Caribbean travel agents in the business - a Royal Guru.
                                                </Text>
                                        }
                                        {
                                            accreditationGained &&
                                                <>
                                                    <Text style={{color: STYLES.colors.white, textAlign: 'center' }}>
                                                        Congratulations!{"\n"}{"\n"}
                                                        Only our wisest travel agents will make it all the way to Royal Guru – the true badge of knowledge when it comes to booking Royal holidays.
                                                        {"\n"}{"\n"}Keep your eyes peeled for an email from the Club Royal team regarding your exclusive benefits.
                                                    </Text>
                                                </>
                                                }
                                    </View>
                                        {
                                        accreditationAvailable && !accreditationGained &&
                                            <AnimatedView animationName={'fade-in'}>
                                                <ButtonBlock
                                                    color={ 'yellow' }
                                                    label={_i('Start Accreditation Exam')}
                                                    xAdjust={32}
                                                    customStyle={{ marginTop: 10 }}
                                                    onPressEvent={ () => this._gotoAccredidation( accreditation ) }
                                                />
                                            </AnimatedView>
                                        }
                                    {
                                        accreditationGained &&
                                        <AnimatedView animationName={'fade-in'}>
                                            <ButtonBlock
                                                color={ 'yellow' }
                                                label={_i('Download Certificate')}
                                                xAdjust={32}
                                                customStyle={{ marginTop: 10 }}
                                                onPressEvent={ this._downloadCertificate }
                                            />
                                        </AnimatedView>
                                    }
                                </View>
                            </GeneralTabsPanel>
                        }
                        {
                            (!yourJourneyLoaded && this.state.activeTab == 'yourJourney') &&
                            <View style={STYLES.container.center}>
                                <LoadingSpinner color={STYLES.colors.white} size={60} />
                            </View>
                        }
                        {
                            (yourJourneyLoaded && this.state.activeTab == 'yourJourney') &&
                                <GeneralTabsPanel>
                                    <View style={{
                                        paddingLeft: VARS.spacer.large,
                                        paddingRight: VARS.spacer.large,
                                        paddingTop: VARS.spacer.small,
                                        paddingBottom: VARS.spacer.small
                                    }}>
                                        <YourJourneyOverview />
                                    </View>
                                </GeneralTabsPanel>

                        }
                    </ScrollView>
                    </>

                );
            }}</LearnContext.Consumer>
        );
    }
}

LearnUser.contextType = LearnContext;

const styles = StyleSheet.create({
    accreditation_label: {
        ...STYLES.text.body_light,
        color: STYLES.colors.white,
        fontSize: 30,
        lineHeight: 30,
        textAlign: 'center',
    },
});

export default function( props ) {

    const navigation = useNavigation();

    return <LearnUser {...props} navigation={navigation} />;
}
