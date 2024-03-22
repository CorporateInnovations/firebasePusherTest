/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { StyleSheet, View, Text, FlatList, Alert, TouchableOpacity } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
// local components
import AnimatedView from '../components/AnimatedView';
import LoadingSpinner from '../components/LoadingSpinner';
import GeneralMessage from '../components/GeneralMessage';
import NewsPostsListItem from '../components/NewsPostsListItem';

// context
import { NewsContext } from '../context/NewsContext';

import { STYLES, VARS } from '../Styles';
import { formatDate } from '../Helpers';
import { _i } from '../Translations';

/*******************************************************************************
 * NewsPostsList Class
 ******************************************************************************/
class NewsPostsList extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {

        };
    }

    _isMounted = false;

    _getPosts = () => {
        this.context.getPosts();
    }

    _postCategories = () => {
        return (
            <NewsContext.Consumer>{( newsContext ) => {
                const { updateCategory, category } = newsContext;
                const linkCategories = [
                    { label: 'All', category: null },
                    { label: 'News', category: 'news' },
                    { label: 'Campaigns', category: 'campaigns' },
                    { label: 'Useful Information', category: 'useful-information' }
                ];
                return (
                    <View style={STYLES.tabs.header}>
                        {
                            linkCategories.map( ( link, index ) => {
                                return (
                                    <TouchableOpacity
                                        onPress={ () => updateCategory(link.category) }
                                        style={STYLES.tabs.header_button}
                                        key={index.toString()}
                                    >
                                        <Text style={{
                                            ...STYLES.tabs.header_button_text,
                                            color: category === link.category ? STYLES.colors.white : STYLES.colors.burgundy.default,
                                        }}>{link.label}</Text>
                                        {
                                            category === link.category &&
                                            <AnimatedView
                                                duration={400}
                                                animationName={'fade-in'}
                                                customStyle={STYLES.tabs.header_active_indicator}
                                            />
                                        }
                                    </TouchableOpacity>
                                );
                            })
                        }
                    </View>
                );
            }}</NewsContext.Consumer>
        );
    }

    componentDidMount() {
        this._isMounted = true;
        
        //if( Array.isArray( this.context.posts ) && this.context.posts.length === 0 ) {
            this._getPosts();
        //}
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {

        const { navigate } = this.props.navigation;

        return (
            <NewsContext.Consumer>{( newsContext ) => {
                const { getPosts, postsLoaded, posts } = newsContext;

                if( !postsLoaded ) {
                    return (
                        <LoadingSpinner />
                    );
                }

                /*
                if( postsLoaded && posts.length === 0 ) {
                    return (
                        <GeneralMessage message={ _i('There are no news posts') } />
                    );
                }
                */

                if( postsLoaded ) {
                    return (
                        <View
                            style={{
                                justifyContent: 'space-between'
                            }}
                        >
                            <FlatList
                                data={ posts }
                                ListHeaderComponent={ this._postCategories() }
                                ListEmptyComponent={<GeneralMessage message={ _i('No posts') } />}
                                keyExtractor={ item => item.id.toString() }
                                contentContainerStyle={{ padding: VARS.spacer.large}}
                                onRefresh={() => this._getPosts() }
                                refreshing={false}
                                renderItem={({ item, index }) => (
                                    <NewsPostsListItem
                                        mode={'vertical'}
                                        post={item}
                                    />
                                )}
                            />
                        </View>
                    );
                }
                
            }}</NewsContext.Consumer>
        );
    }
}

NewsPostsList.contextType = NewsContext;

const styles = StyleSheet.create({

});

export default function( props ) {

    const navigation = useNavigation();

    return <NewsPostsList {...props} navigation={navigation} />;
}
