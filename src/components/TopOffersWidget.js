/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { StyleSheet, View, Modal, Text, FlatList, Dimensions, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
// Google Analytics
// import firebase from '@react-native-firebase/app';
// import analytics from '@react-native-firebase/analytics'
// https://github.com/vivaxy/react-native-auto-height-image
import AutoHeightImage from 'react-native-auto-height-image';
// external imports
import LinearGradient from 'react-native-linear-gradient';
// Camera Roll Functions
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
// FetchBlob - for android use mainly
import RNFetchBlob from "rn-fetch-blob";

// icons
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/icons/selection.json';
const Icon = createIconSetFromIcoMoon( icoMoonConfig, 'icomoon', 'icomoon.ttf' );

// local components
import GeneralMessage from '../components/GeneralMessage';
import GeneralHTML from '../components/GeneralHTML';
import GeneralModal from '../components/GeneralModal';
import AnimatedView from '../components/AnimatedView';
import LoadingSpinner from '../components/LoadingSpinner';

// context
import { UserContext } from '../context/UserContext';

import { STYLES, VARS } from '../Styles';
import { formatDate } from '../Helpers';
import { _i } from '../Translations';

const DIMENSIONS = Dimensions.get('screen');

/*******************************************************************************
 * TopOffersWidget Class
 ******************************************************************************/
class TopOffersWidget extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            activeTab: 'GBP',
            currentImageViewed: null,
            modal_active: false,
            modal_image: null,
            confirmModalShow: false,
        };
    }

    _isMounted = false;

    _confirmModalOpen = () => {
        this.setState({modal_active: false, confirmModalShow: true },() => {setTimeout(this._confirmModalClose, 3000)});
    }

    _confirmModalClose = () => {
        this.setState({
            confirmModalShow: false,
            modal_active: true, 
          });
    }

    _close = () => {

        if( this._isMounted ) {
            this.setState({
                modal_active: false,
                modal_image: null,
            });
        }
    }

    _download = () => {
        this.downloadTopOfferImageEvent(this.state.currentImageViewed);

        if (Platform.OS === "ios") {
            CameraRoll.save(this.state.modal_image);
            this._confirmModalOpen();
        }

        if (Platform.OS === "android") {
            RNFetchBlob.config({
                fileCache: true,
                appendExt: "jpg",
              })
                .fetch("GET", this.state.modal_image, {
                  //No logic needed here
                })
                .then((res) => {
                    CameraRoll.save(res.path());
                    this._confirmModalOpen();
                });
        }
        
    }

    async switchToGBPEvent() {
        // await analytics().logEvent('top_offers_gbp_viewed');
    }

    async switchToEUREvent() {
        // await analytics().logEvent('top_offers_eur_viewed');
    }

    async downloadTopOfferImageEvent(currency) {
        if(currency == 'gbp') {
            // await analytics().logEvent('top_offers_gbp_image_download');
            console.log("GBP Firebase Event Fired!")
        }

        if(currency == 'eur') {
            // await analytics().logEvent('top_offers_eur_image_download');
            console.log("EUR Firebase Event Fired!")
        }
        
    }

    componentDidMount() {
        this._isMounted = true;
        this.context.getTopOffers();
        this.switchToGBPEvent();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {

        const { navigate } = this.props.navigation;

        return (
            <UserContext.Consumer>{( userContext ) => {
                const { gbp_offers, eur_offers, topOffersLoaded } = userContext;
                return (
                <LinearGradient colors={STYLES.gradients.green} start={{ x: 1, y: 0.5 }} end={{ x: 0.5, y: 1 }} style={{ flex: 1 }}>
                    <View style={{...STYLES.section.large, paddingBottom: 0}}>
                        <AnimatedView
                            duration={400}
                            animationName={'fade-in'}
                            customStyle={styles.container}
                        >
                            <View style={{flex:0,flexDirection:'row',flexWrap:'nowrap',alignItems:'center'}}>
                                <Text style={{ ...styles.heading_text, color: '#044935' }}>{_i('Top Offers')}</Text>
                                <TouchableOpacity
                                    onPress={ () => {this.switchToGBPEvent(), this.setState({ activeTab: 'GBP' })} }
                                    style={{
                                        ...styles.button,
                                        backgroundColor: this.state.activeTab == 'GBP' ? '#044935' : '#5B8442'
                                    }}
                                >
                                    <Text style={styles.button_text}>{_i('GBP')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={ () => {this.switchToEUREvent(), this.setState({ activeTab: 'EUR' })} }
                                    style={{
                                        ...styles.button,
                                        backgroundColor: this.state.activeTab == 'EUR' ? '#044935' : '#5B8442'
                                    }}
                                >
                                    <Text style={styles.button_text}>{_i('EUR')}</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={{ ...styles.heading_text, color: VARS.colors.yellow.default }} onPress={() => navigate( 'main.menu', { screen: 'menu.top_offers' } )}>{_i('View All')}</Text>
                        </AnimatedView>
                        {
                            !topOffersLoaded &&
                            <View style={STYLES.container.center}>
                                <LoadingSpinner color={STYLES.colors.white} size={60} />
                            </View>
                        }
                    </View>
                    <View style={{...STYLES.section.large, paddingTop: 0, paddingRight:0, paddingLeft: 0}}>
                        {
                            (topOffersLoaded && this.state.activeTab === 'GBP') &&
                            <View>
                                    {
                                        (typeof gbp_offers.content === 'string' && gbp_offers.content.length > 0) &&
                                        <View style={{...STYLES.section.large, paddingTop:0,paddingBottom:0 }}>
                                            <GeneralHTML html={gbp_offers.content} />
                                        </View>
                                    }
                                    {
                                        gbp_offers &&
                                        <AnimatedView
                                            duration={400}
                                            animationName={'fade-in'}
                                            customStyle={styles.container}
                                        >
                                            <FlatList
                                                horizontal={true}
                                                data={gbp_offers.offers}
                                                contentContainerStyle={{
                                                    paddingLeft: VARS.spacer.large,
                                                    paddingRight: VARS.spacer.large,
                                                }}
                                                renderItem={({ item, index }) => {
                                                    return(
                                                    <TouchableOpacity
                                                        onPress={() => {this.setState({ modal_active: true, modal_image: item.image_path, currentImageViewed: 'gbp' }) }}
                                                        style={{flex: 0, marginRight: (index + 1) < gbp_offers.offers.length ? 8 : 0  }}
                                                        width={(DIMENSIONS.width - (2 * VARS.spacer.large)) / 2.2}
                                                    >
                                                        <AutoHeightImage
                                                            width={(DIMENSIONS.width - (2 * VARS.spacer.large)) / 2.2}
                                                            source={{uri: item.image_path}}
                                                        />
                                                    </TouchableOpacity>
                                                    );
                                                }}
                                                keyExtractor={item => item.id.toString()}
                                            >
                                            </FlatList>
                                        </AnimatedView>
                                    }
                                    {
                                        !gbp_offers &&
                                        <GeneralMessage textColor={STYLES.colors.white} message={ _i('No GBP Offers Available') } />
                                    }
                                </View>
                        }
                        {
                            (topOffersLoaded && this.state.activeTab === 'EUR') &&
                            <View>
                                {
                                    (typeof eur_offers.content === 'string' && eur_offers.content.length > 0) &&
                                    <View style={{...STYLES.section.large, paddingTop:0,paddingBottom:0 }}>
                                        <GeneralHTML html={eur_offers.content} />
                                    </View>
                                }
                                    {
                                        eur_offers &&
                                        <AnimatedView
                                            duration={400}
                                            animationName={'fade-in'}
                                            customStyle={styles.container}
                                        >
                                            <FlatList
                                                horizontal={true}
                                                data={eur_offers.offers}
                                                contentContainerStyle={{
                                                    paddingLeft: VARS.spacer.large,
                                                    paddingRight: VARS.spacer.large,
                                                }}
                                                renderItem={({ item, index }) => {
                                                    return (
                                                    <TouchableOpacity
                                                        onPress={() => { this.setState({ modal_active: true, modal_image: item.image_path, currentImageViewed: 'eur'}) }}
                                                        style={{flex: 0, marginRight: (index + 1) < eur_offers.offers.length ? 8 : 0  }}
                                                        width={(DIMENSIONS.width - (2 * VARS.spacer.large)) / 2.2}
                                                    >
                                                        <AutoHeightImage
                                                            width={(DIMENSIONS.width - (2 * VARS.spacer.large)) / 2.2}
                                                            source={{uri: item.image_path}}
                                                        />
                                                    </TouchableOpacity>
                                                    );
                                                }}
                                                keyExtractor={item => item.id.toString()}
                                            >
                                            </FlatList>
                                        </AnimatedView>
                                    }
                                    {
                                        !eur_offers &&
                                        <GeneralMessage textColor={STYLES.colors.white} message={ _i('No EUR Offers Available') } />
                                    }
                                </View>
                        }
                    </View>
                    <GeneralModal
                        active={ this.state.modal_active && ( typeof this.state.modal_image === 'string' && this.state.modal_image.length > 0 ) }
                        actions={[
                            { key: '1', label: _i('Download'), color: STYLES.colors.navy.default, onPressEvent: this._download },
                            { key: '2', label: _i('Close'), color: STYLES.colors.navy.default, onPressEvent: this._close },
                        ]}
                         style={{
                            padding: 0
                        }}
                    >
                        <AutoHeightImage
                            width={DIMENSIONS.width - (2 * VARS.spacer.small)}
                            source={{uri: this.state.modal_image}}
                        />
                    </GeneralModal>
                    <Modal
                        animationType='fade'
                        transparent={true}
                        visible={this.state.confirmModalShow}
                    >
                        <ScrollView contentContainerStyle={STYLES.modal.overlay}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        >
                            <AnimatedView
                                duration={400}
                                animationName={'fade-in-up'}
                                customStyle={STYLES.modal.confirm}
                            >
                                <View style={STYLES.modal.body}>
                                    <Icon name="rp-check" size={30} color={ STYLES.colors.gray.light } style={styles.action_icon} />
                                </View>
                            </AnimatedView>
                        </KeyboardAvoidingView>
                        </ScrollView>
                    </Modal>
                </LinearGradient>
                );
            }}</UserContext.Consumer>
        );
    }
}

TopOffersWidget.contextType = UserContext;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 0,
        paddingBottom: VARS.spacer.small,
    },
    heading_text: {
        fontFamily: VARS.fonts.family.darwin_bold,
        fontSize: VARS.fonts.size.lead,
        lineHeight: 28,
        textAlign: 'center',
    },
    button: {
        flex: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 24,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 4,
        marginLeft: 6,
    },
    button_text: {
        fontFamily: VARS.fonts.family.darwin_bold,
        textTransform: 'uppercase',
        fontSize: VARS.fonts.size.body,
        letterSpacing: 1,
        textAlign: 'center',
        color: VARS.colors.white
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});

export default function( props ) {

    const navigation = useNavigation();

    return <TopOffersWidget {...props} navigation={navigation} />;
}
