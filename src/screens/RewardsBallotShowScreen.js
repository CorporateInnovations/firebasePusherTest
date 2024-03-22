// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, SafeAreaView, ScrollView, Dimensions, StyleSheet, Linking, Alert } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
import VideoPlayer from 'react-native-video-player';
// external imports
import LinearGradient from 'react-native-linear-gradient';
// https://github.com/vivaxy/react-native-auto-height-image
import AutoHeightImage from 'react-native-auto-height-image';
// https://meliorence.github.io/react-native-render-html/
import RenderHtml, { defaultSystemFonts } from 'react-native-render-html';

// context
import { UserContext } from '../context/UserContext';
// local components
import GeneralMessage from '../components/GeneralMessage';
import GeneralHTML from '../components/GeneralHTML';
import ButtonBlock from '../components/ButtonBlock';

// local config
import { STYLES, VARS } from '../Styles';
import { _i } from '../Translations';

const DIMENSIONS = Dimensions.get('screen');

class RewardsBallotShowScreen extends React.Component {

    constructor( props ) {

        super( props );

        const { ballot } = props.route.params;

        this.state = {
            ballot: ballot,
            submitInProgress: false
        };
    }

    _isMounted = false;

    _isLoading = false;

    _enterBallot = async ballot_id => {

        if(this._isMounted) {
            this.setState({ submitInProgress: true });
        }

        this.context.enterBallot(ballot_id)
            .then(data => {
                Alert.alert(_i('Success!'), _i('You were entered into this Ballot'));
            })
            .catch(error => {
                Alert.alert(_i('Error'), _i('There was an error entering you into the ballot, please try again later.'));
            })
            .finally(() => {
                if(this._isMounted) {
                    this.setState({ submitInProgress: false });
                }
            })
    }

    componentDidMount() {

        this._isMounted = true;

    }

    componentWillUnmount() {

        this._isMounted = false;

    }

    render() {

        const { navigate } = this.props.navigation;
        const { ballot } = this.props.route.params;

        if( !ballot ) {
            return (
                <View style={STYLES.section.large}>
                    <GeneralMessage color={STYLES.colors.navy.default} message={ _i('Unable to find ballot content') } />
                </View>
            );
        }

        return (
            <UserContext.Consumer>{( userContext ) => {
                const { getIsExistingBallotEntry, enterBallot } = userContext;
                const existingBallotEntry = getIsExistingBallotEntry(ballot.id);
                return (
                    <SafeAreaView style={STYLES.container.default}>
                        <ScrollView style={{flex:1}}>
                            <AutoHeightImage
                                style={{flex: 0}}
                                width={DIMENSIONS.width}
                                source={{ uri: ballot.image_url }}
                            />
                            <View style={{flex: 1}}>
                                <LinearGradient
                                    colors={STYLES.gradients.orange}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={{
                                        ...STYLES.section.large,
                                        flex: 0,
                                        paddingTop: VARS.spacer.small,
                                        paddingBottom: VARS.spacer.small,
                                    }}
                                >
                                    <View style={STYLES.text.paragraph}>
                                        <Text style={styles.headline_text}>{ ballot.name }</Text>
                                    </View>
                                    <Text style={styles.intro_text}>{ballot.intro_text}</Text>
                                </LinearGradient>
                                <View style={STYLES.section.large}>
                                    <View style={STYLES.text.paragraph}>
                                        <GeneralHTML html={ballot.body} />
                                    </View>
                                    {
                                        existingBallotEntry === true &&
                                        <ButtonBlock
                                            color={'disabled'}
                                            label={_i('You\'re Entered!')}
                                            xAdjust={36}
                                            customStyle={{ marginBottom: 20 }}
                                            onPressEvent={ () => Alert.alert(_i('Success'), _i('You are already entered into this ballot')) }
                                        />
                                    }
                                    {
                                        !existingBallotEntry &&
                                        <ButtonBlock
                                            color={'yellow'}
                                            label={_i('Enter Ballot')}
                                            xAdjust={36}
                                            customStyle={{ marginBottom: 20 }}
                                            onPressEvent={ () => this._enterBallot(ballot.id) }
                                            disabled={this.state.submitInProgress}
                                        />
                                    }
                                </View>
                            </View>
                        </ScrollView>
                    </SafeAreaView>
                );
            }}</UserContext.Consumer>
        );
    };

};

RewardsBallotShowScreen.contextType = UserContext;

const styles = StyleSheet.create({
    intro_text: {
        fontFamily: VARS.fonts.family.darwin_light,
        fontSize: VARS.fonts.size.lead,
        lineHeight: 18,
        color: VARS.colors.white,
        paddingBottom: 5,
    },
    headline_text: {
        ...STYLES.text.heading3,
        color: VARS.colors.white
    },
});

    // Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <RewardsBallotShowScreen {...props} navigation={navigation} />;
}
