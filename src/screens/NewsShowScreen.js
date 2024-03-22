// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, SafeAreaView, ScrollView, Dimensions, StyleSheet, Linking } from 'react-native';
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
import { NewsContext } from '../context/NewsContext';
// local components
import GeneralMessage from '../components/GeneralMessage';
import ButtonBlock from '../components/ButtonBlock';

// local config
import { STYLES, VARS } from '../Styles';
import { _i } from '../Translations';

const DIMENSIONS = Dimensions.get('screen');

class NewsShowScreen extends React.Component {

    constructor( props ) {

        super( props );

        const { post } = props.route.params;

        this.state = {
            post: post
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
        const { post } = this.props.route.params;

        if( !post ) {
            return (
                <View style={STYLES.section.large}>
                    <GeneralMessage color={STYLES.colors.navy.default} message={ _i('Unable to find new post content') } />
                </View>
            );
        }

        return (
            <NewsContext.Consumer>{( newsContext ) => {
                return (
                    <SafeAreaView style={STYLES.container.default}>
                        <ScrollView style={{flex:1}}>
                            {
                                ( post.mediaType === 'image' && post.mediaUri ) &&
                                <AutoHeightImage
                                    style={{flex: 0}}
                                    width={DIMENSIONS.width}
                                    source={{uri: post.mediaUri}}
                                />
                            }
                            {
                                ( post.mediaType === 'video' && post.mediaUri ) &&
                                <VideoPlayer
                                    video={{ uri: post.mediaUri }}
                                    videoWidth={1600}
                                    videoHeight={900}
                                />
                            }
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
                                    {
                                        post.date &&
                                        <Text style={styles.date_text}>{ post.date }</Text>
                                    }
                                    <Text style={styles.headline_text}>{ post.headline }</Text>
                                </LinearGradient>
                                <View style={STYLES.section.large}>
                                    {
                                        ( typeof post.pdf === 'string' && post.pdf.length > 0 ) &&
                                        <ButtonBlock
                                            color={'navy'}
                                            label={_i('Download PDF')}
                                            customStyle={{ marginBottom: VARS.spacer.small }}
                                            xAdjust={36}
                                            onPressEvent={ () => Linking.openURL(post.pdf) }
                                        />
                                    }
                                    {
                                        ( typeof post.bodyHTML === 'string' && post.bodyHTML.length > 0 ) &&
                                        <RenderHtml
                                            contentWidth={(DIMENSIONS.width - (2 * VARS.spacer.large))}
                                            tagsStyles={tagsStyles}
                                            systemFonts={systemFonts}
                                            source={{
                                                html: post.bodyHTML
                                            }}
                                        />
                                    }
                                </View>
                            </View>
                        </ScrollView>
                    </SafeAreaView>
                );
            }}</NewsContext.Consumer>
        );
    };

};

const systemFonts = ['DarwinW00-Light', 'Darwin-Bold', ...defaultSystemFonts];

const tagsStyles = {
    body: {
        color: VARS.colors.navy.default,
        fontFamily: VARS.fonts.family.darwin_light,
        fontSize: VARS.fonts.size.body,
        lineHeight: 22
    },
    a: {
        fontFamily: VARS.fonts.family.darwin_bold,
        color: VARS.colors.pink.default,
        textDecorationLine: 'none'
    }
};

const styles = StyleSheet.create({
    date_text: {
        fontFamily: VARS.fonts.family.darwin_light,
        fontSize: VARS.fonts.size.body,
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

    return <NewsShowScreen {...props} navigation={navigation} />;
}