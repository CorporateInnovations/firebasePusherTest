/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { StyleSheet, View, Modal, Text, FlatList, Dimensions, TouchableOpacity, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
// Camera Roll Functions
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
// FetchBlob - for android use mainly
import RNFetchBlob from "rn-fetch-blob";
// Google Analytics
// import firebase from '@react-native-firebase/app';
// import analytics from '@react-native-firebase/analytics'
// https://github.com/vivaxy/react-native-auto-height-image
import AutoHeightImage from 'react-native-auto-height-image';

// icons
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/icons/selection.json';
const Icon = createIconSetFromIcoMoon( icoMoonConfig, 'icomoon', 'icomoon.ttf' );

// local components
import GeneralMessage from '../components/GeneralMessage';
import GeneralTabsHeader from '../components/GeneralTabsHeader';
import GeneralModal from '../components/GeneralModal';
import GeneralTabsPanel from '../components/GeneralTabsPanel';
import AnimatedView from '../components/AnimatedView';
import GeneralHTML from '../components/GeneralHTML';
import LoadingSpinner from '../components/LoadingSpinner';

// context
import { UserContext } from '../context/UserContext';

import { STYLES, VARS } from '../Styles';
import { formatDate } from '../Helpers';
import { _i } from '../Translations';

const DIMENSIONS = Dimensions.get('screen');

/*******************************************************************************
 * TopOffers Class
 ******************************************************************************/
class TopOffers extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            activeTab: 'GBP',
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
                  // No logic needed here
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

    _buildOffers = data => {
        
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
                <>
                    <GeneralTabsHeader
                        tabs={[
                            { slug: 'GBP', label: _i('GBP'), setActiveTab: ( slug ) => {this.switchToGBPEvent(), this.setState({ activeTab: slug })} },
                            { slug: 'EUR', label: _i('EUR'), setActiveTab: ( slug ) => {this.switchToEUREvent(), this.setState({ activeTab: slug })} },
                        ]}
                        activeTabSlug={this.state.activeTab}
                        inactiveColor={STYLES.colors.white}
                    />
                    {
                        !topOffersLoaded &&
                        <View style={STYLES.container.center}>
                            <LoadingSpinner color={STYLES.colors.white} size={60} />
                        </View>
                    }
                    {
                        (topOffersLoaded && this.state.activeTab === 'GBP') &&
                        <GeneralTabsPanel>
                            <View style={{...STYLES.section.large, paddingTop: 0}}>
                                {
                                    (typeof gbp_offers.content === 'string' && gbp_offers.content.length > 0) &&
                                    <GeneralHTML html={gbp_offers.content} />
                                }
                                {
                                    gbp_offers &&
                                    <AnimatedView
                                        duration={400}
                                        animationName={'fade-in'}
                                        customStyle={styles.container}
                                    >
                                        <FlatList
                                            horizontal={false}
                                            data={gbp_offers.offers}
                                            renderItem={({ item, index }) => {
                                                return(
                                                <TouchableOpacity
                                                    onPress={() => { this.setState({ modal_active: true, modal_image: item.image_path }) }}
                                                    style={{flex: 0, marginRight: (index + 1) < gbp_offers.offers.length ? 8 : 0, paddingBottom: VARS.spacer.large }}
                                                    width={(DIMENSIONS.width - (2 * VARS.spacer.large)) / 2.2}
                                                >
                                                    <AutoHeightImage
                                                        width={(DIMENSIONS.width - (2 * VARS.spacer.small)) / 1.1}
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
                        </GeneralTabsPanel>
                    }
                    {
                        (topOffersLoaded && this.state.activeTab === 'EUR') &&
                        <GeneralTabsPanel>
                            <View style={{...STYLES.section.large, paddingTop: 0}}>
                                {
                                    (typeof eur_offers.content === 'string' && eur_offers.content.length > 0) &&
                                    <GeneralHTML html={eur_offers.content} />
                                }
                                {
                                    eur_offers &&
                                    <AnimatedView
                                        duration={400}
                                        animationName={'fade-in'}
                                        customStyle={styles.container}
                                    >
                                        <FlatList
                                            horizontal={false}
                                            data={eur_offers.offers}
                                            renderItem={({ item, index }) => {
                                                return(
                                                <TouchableOpacity
                                                    onPress={() => { this.setState({ modal_active: true, modal_image: item.image_path }) }}
                                                    style={{flex: 0, marginRight: (index + 1) < eur_offers.offers.length ? 8 : 0, paddingBottom: VARS.spacer.large }}
                                                    width={(DIMENSIONS.width - (2 * VARS.spacer.large)) / 2.2}
                                                >
                                                    <AutoHeightImage
                                                        width={(DIMENSIONS.width - (2 * VARS.spacer.small)) / 1.1}
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
                        </GeneralTabsPanel>
                    }
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
                </>
                );
            }}</UserContext.Consumer>
        );
    }
}

TopOffers.contextType = UserContext;

const styles = StyleSheet.create({
    
});

export default function( props ) {

    const navigation = useNavigation();

    return <TopOffers {...props} navigation={navigation} />;
}
