import React, { Component, createContext } from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { Alert } from 'react-native';
// lodash
import { _ } from 'lodash';
// components
import FormField from '../components/FormField';
// styles
import { STYLES } from '../Styles';
// configs
import { _i } from '../Translations';
import { logError } from '../Helpers';
import CONFIG from '../Config';
// services
import * as NewsService from '../services/news';

export const NewsContext = createContext();

class NewsContextProvider extends Component {

    // mounted flag
    _isMounted = false;

    state = {
        posts: [],
        postsLoaded: false,
        category: null,
        page: null,
    };

    /**
     * fetch posts from phoenix
     */
    getPosts = async request => {
        try {

            if( request === 'all' ) {
                if( this._isMounted ) {
                    await this.setState({ category: null, page: null });
                }
            }
            const posts = await NewsService.getPosts( this.state.page, this.state.category );
            if( this._isMounted ) {
                this.setState({ posts, postsLoaded: true });
            }
        } catch( error ) {
            logError( 'Get News Posts Error', 'NewsContext->getPosts', error );
        }
    }

    updateCategory = async category => {
        category = category || null;

        if( this._isMounted ) {
            await this.setState({ category: category, page: null });
        }

        this.getPosts();
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render () {
        return (
            <NewsContext.Provider value={{
                ...this.state,
                getPosts: this.getPosts,
                updateCategory: this.updateCategory
            }}>
                {this.props.children}
            </NewsContext.Provider>
        )
    }
}

export default NewsContextProvider;