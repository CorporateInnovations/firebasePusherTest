/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { StyleSheet, View, Text, FlatList, Alert } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation, useFocusEffect } from '@react-navigation/native';
// local components
import LoadingSpinner from '../components/LoadingSpinner';
import GeneralMessage from '../components/GeneralMessage';
import NewsPostsListItem from '../components/NewsPostsListItem';

// context
import { NewsContext } from '../context/NewsContext';

import { STYLES, VARS } from '../Styles';
import { formatDate } from '../Helpers';
import { _i } from '../Translations';

function FetchNewsData({ onUpdate }) {
    useFocusEffect(
        React.useCallback(() => {

            onUpdate()
              
        }, [onUpdate])
    );
  
    return null;
}

/*******************************************************************************
 * NewsPostsLatest Class
 ******************************************************************************/
class NewsPostsLatest extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {

        };
    }

    _isMounted = false;

    _getPosts = async () => {
        this.context.getPosts('all');
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
                const { postsLoaded, posts, getPosts } = newsContext;


                if( !postsLoaded ) {
                    return (
                        <LoadingSpinner />
                    );
                }

                if( postsLoaded && posts.length === 0 ) {
                    return (
                        <>
                            <FetchNewsData
                                onUpdate={this._getPosts}
                            />
                            <GeneralMessage message={ _i('There are no news posts') } />
                        </>
                    );
                }

                return (
                    <View style={styles.container}>
                        <FetchNewsData
                            onUpdate={this._getPosts}
                        />
                        {
                            posts[0] &&
                            <NewsPostsListItem
                                mode={'compact'}
                                post={posts[0]}
                            />
                        }
                        {
                            posts[1] &&
                            <NewsPostsListItem
                                mode={'compact'}
                                post={posts[1]}
                            />
                        }
                    </View>
                );
                
            }}</NewsContext.Consumer>
        );
    }
}

NewsPostsLatest.contextType = NewsContext;

const styles = StyleSheet.create({
    container: {
        flex: 0,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    }
});

export default function( props ) {

    const navigation = useNavigation();

    return <NewsPostsLatest {...props} navigation={navigation} />;
}
