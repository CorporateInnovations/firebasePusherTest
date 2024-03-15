/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { StyleSheet, View, Text, FlatList, Alert, Image, Dimensions, TouchableOpacity } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
import VideoPlayer from 'react-native-video-player';
// https://github.com/vivaxy/react-native-auto-height-image
import AutoHeightImage from 'react-native-auto-height-image';
// local components
import AnimatedView from '../components/AnimatedView';
import LoadingSpinner from '../components/LoadingSpinner';
import GeneralMessage from '../components/GeneralMessage';

// context
import { NewsContext } from '../context/NewsContext';

import { STYLES, VARS } from '../Styles';
import { formatDate } from '../Helpers';
import { _i } from '../Translations';

const DIMENSIONS = Dimensions.get('screen');

/*******************************************************************************
 * NewsPostsListItem Class
 ******************************************************************************/
class NewsPostsListItem extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {

        };
    }

    _isMounted = false;

    _postDimensions = () => {

        let postWidth;

        switch( this.props.mode ) {
            case 'vertical':
                postWidth = DIMENSIONS.width - ( 2 * VARS.spacer.large );
                break;
            case 'compact':
                postWidth = ( ( DIMENSIONS.width - ( 2 * VARS.spacer.large ) ) / 2) - VARS.spacer.small;
        }

        let postDimensions = {
            width: postWidth,
            mediaWidth: postWidth,
            mediaHeight: postWidth * 0.66,
            marginBottom: this.props.mode === 'compact' ? 0 : 2 * VARS.spacer.large,
            strokeMarginTop: this.props.mode === 'compact' ? 5 : 14,
        };

        return postDimensions;
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {

        const { navigate } = this.props.navigation;
        const { headline, id, mediaType, mediaUri, date, snippet } = this.props.post;
        const postDimensions = this._postDimensions();

        return (
            <NewsContext.Consumer>{( newsContext ) => {
                const { getPosts, postsLoaded, posts } = newsContext;

                return (
                    <View
                        key={ id.toString() }
                        style={{
                            width: postDimensions.width,
                            marginBottom: postDimensions.marginBottom
                        }}
                    >
                        {
                            mediaType == 'image' &&
                            <TouchableOpacity
                                onPress={() => { navigate( 'tab.news', { screen: 'news.show', params: { post: this.props.post }} ) }}
                                style={{
                                    ...styles.media_window,
                                }}
                            >
                                <AutoHeightImage
                                    style={{flex: 0}}
                                    width={postDimensions.mediaWidth}
                                    source={{uri: mediaUri}}
                                />
                            </TouchableOpacity>
                        }
                        {
                            mediaType == 'video' &&
                            <View
                                style={{
                                    ...styles.media_window,
                                }}
                            >
                                <VideoPlayer
                                    video={{ uri: mediaUri }}
                                    videoWidth={1600}
                                    videoHeight={900}
                                />
                            </View>
                        }
                        {
                            this.props.mode === 'vertical' &&
                            <Text style={{...styles.body_text, paddingBottom: 5, fontFamily: VARS.fonts.family.darwin_bold }}>{ date }</Text>
                        }
                        <Text style={{...styles.headline_text, paddingBottom: 12, fontSize: VARS.fonts.size[this.props.mode === 'compact' ? 'body' : 'lead'] }} onPress={() => { navigate( 'tab.news', { screen: 'news.show', params: { post: this.props.post }} ) }}>{ headline }</Text>
                        {
                            ( typeof snippet === 'string' && snippet.length > 0 && this.props.mode === 'vertical' ) &&
                            <Text style={{...styles.body_text }}>{ snippet }</Text>
                        }
                        <View style={{ ...styles.stroke, marginTop: postDimensions.strokeMarginTop }}></View>
                    </View>
                );
                
            }}</NewsContext.Consumer>
        );
    }
}

NewsPostsListItem.contextType = NewsContext;

const styles = StyleSheet.create({
    post: {
        width: '100%',
    },
    media_window: {
        borderRadius: 8,
        marginBottom: VARS.spacer.small,
        shadowColor: '#3E1429',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 10,
    },
    headline_text: {
        fontFamily: VARS.fonts.family.darwin_bold,
        fontSize: VARS.fonts.size.lead,
        lineHeight: 18,
        color: VARS.colors.white
    },
    body_text: {
        fontFamily: VARS.fonts.family.darwin_light,
        fontSize: VARS.fonts.size.body,
        lineHeight: 18,
        color: VARS.colors.white
    },
    stroke: {
        flex: 0,
        height: 2,
        width: 40,
        marginTop: 14,
        backgroundColor: STYLES.colors.white,
    }
});

export default function( props ) {

    const navigation = useNavigation();

    return <NewsPostsListItem {...props} navigation={navigation} />;
}
