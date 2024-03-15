// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, SafeAreaView, ScrollView, Alert } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
// external imports
import LinearGradient from 'react-native-linear-gradient';
// local components
import LoadingSpinner from '../components/LoadingSpinner';
import GeneralModal from '../components/GeneralModal';
import GeneralMessage from '../components/GeneralMessage';
import HeadingGroup from '../components/HeadingGroup';

// context
import { LearnContext } from '../context/LearnContext';
// styles
import { STYLES } from '../Styles';
import { logError } from '../Helpers';
import { _i } from '../Translations';

class LearnLoadingScreen extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            loading: false,
            showMessage: false,
            messageHeading: '',
            messageBody: '',
        };
    }

    _isMounted = false;

    _isLoading = false;

    _focus = null;

    _handleRejection( promise ) {
        return promise.catch( error => {
            this._showMessage();
            logError( 'failed to init learn', 'LearnLoadingScreen->_handleRejection', error );
            return error;
        });
    }

    _loadingPromises = ( ...ps ) => {
        return Promise.all( ps.map( this._handleRejection ) );
    }

    _clearMessage = () => {
        if( this._isMounted ) {
            this.setState({
                showMessage: false,
                messageBody: '',
                messageHeading: '',
            });
        }
    }

    _showMessage = ( heading, body ) => {
        if( this._isMounted ) {
            this.setState({
                showMessage: true,
                messageBody: typeof body === 'string' && body.length > 0 ? body : 'Unable to load Learn. Please try again later',
                messageHeading: typeof heading === 'string' && heading.length > 0 ? heading : 'Error',
            });
        }
    }

    _init = async () => {

        this._clearMessage();

        if( this.context.canAccessLearn ) {
            this._enterLearn();
            return;
        }

        if( this._isMounted ) {
            this.setState({ loading: true });
        }

        // run all the init promsises together to save on load time
        this._loadingPromises(
            this.context.getPhoenixUser())
            .then( results => {
                this.context.canAccessLearn ? this._enterLearn() : this._noAccess();
            })
            .finally(() => {
                if( this._isMounted ) {
                    this.setState({ loading: false });
                }
            });
    }

    _enterLearn = () => {
        this.props.navigation.navigate('learn.index');
    }

    _noAccess = () => {
        this._showMessage( _i('No Access'), _i('Your account does not yet have access to the Learn section.'));
    }


    componentDidMount() {

        this._isMounted = true;

        // listener will fire whenever this Screen is vistied including subsequent post-mounted visits.
        // must be here because people can swipe navigate back to this loading screen and we don't want them to be stranded.
        this._focus = this.props.navigation.addListener('focus', () => {
            this._init();
        });

    }

    componentWillUnmount() {

        this._isMounted = false;

    }

    render() {

        return (
            <LearnContext.Consumer>{( learnContext ) => {
                return (
                    <>
                        <LinearGradient colors={STYLES.gradients.purple} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
                            <SafeAreaView style={STYLES.container.center}>
                                {
                                    this.state.loading &&
                                    <LoadingSpinner color={STYLES.colors.white} size={60} />
                                }
                                {
                                    ( !this.state.loading && this.state.messageHeading.length > 0 ) &&
                                    <GeneralMessage message={ this.state.messageHeading } textColor={ STYLES.colors.white } />
                                }
                            </SafeAreaView>
                            <GeneralModal
                                active={ this.state.showMessage === true && this.state.messageHeading.length > 0 && this.state.messageBody.length > 0 }
                                actions={[{ key: '1', label: _i('Close'), color: STYLES.colors.navy.default, onPressEvent: () => this.setState({ showMessage: false }) }]}
                            >
                                <HeadingGroup
                                    heading={ this.state.messageHeading }
                                    body={ this.state.messageBody }
                                    textColor={STYLES.colors.navy.default}
                                />
                            </GeneralModal>
                        </LinearGradient>
                    </>
                );
            }}</LearnContext.Consumer>
        );
    };

};

LearnLoadingScreen.contextType = LearnContext;

// Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <LearnLoadingScreen {...props} navigation={navigation} />;
}