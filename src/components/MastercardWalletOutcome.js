/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, Dimensions, Image } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
// lodash
import _ from 'lodash';

/*******************************************************************************
 * Local components
 ******************************************************************************/
import GeneralModal from '../components/GeneralModal';
import HeadingGroup from '../components/HeadingGroup';

/*******************************************************************************
 * Global Consts
 ******************************************************************************/

// Styles
import { STYLES, VARS } from '../Styles';
import { _i } from '../Translations';

const DIM = Dimensions.get('window');

/*******************************************************************************
 * MastercardWalletOutcome Class
 ******************************************************************************/

class MastercardWalletOutcome extends React.Component { 
  
    constructor(props) {
        super(props);

        this.state = {
            wallet_outcome: _.get( props, 'wallet_outcome', null ),
            outcome_received: false,
            show_success: false,
            context: props.context,
        };
    }

    _isMounted = false;

    _completeConfirmation = () => {

        if( this.state.context == 'splash-screen' ) {

            if( this._isMounted ) {
                this.setState(
                    {
                        show_success: false,
                    },
                    () => {
                        this.props.navigation.navigate( 'tab.mastercard' );
                    }
                );
            }

        } else {

            if( this._isMounted ) {
                this.setState({
                    show_success: false,
                });
            }
        }
    }

    componentDidMount = () => {
        this._isMounted = true;
    }

    componentWillReceiveProps = (nextProps) => {
        
        if( _.get( nextProps, 'wallet_outcome.success', false ) === true && !this.state.outcome_received ) {
            this.setState({
                show_success: true,
                outcome_received: true
            });
        }

    }

    componentWillUnmount = () => {

        if( this._isMounted ) {
            this.setState({
                show_success: false,
            });
        }

        this._isMounted = false;

    }

    render () {

        return (
            <GeneralModal
                active={ this.state.show_success }
                actions={[
                    { key: '1', label: _i('Done'), color: STYLES.colors.navy.default, onPressEvent: this._completeConfirmation },
                ]}
            >
                <HeadingGroup
                    heading={ _i("You're all Set!") }
                    body={ _i("Your card has been added to Apple Wallet.") }
                    textColor={STYLES.colors.navy.default}
                />
                <View style={ STYLES.text.paragraph } >
                    <Text style={ STYLES.text.boddy_light }>{_i("Apple Pay is an easier way to pay in shops, in apps, and online with your iPhone, iPad and Mac.")}</Text>
                </View>
                <View style={ STYLES.text.paragraph } >
                    <Text style={ STYLES.text.boddy_light }>{_i("Use Apple Pay wherever you see these symbols.")}</Text>
                </View>
                <View style={ styles.image_container } >
                    <Image source={ require( '../../assets/images/apple-contactless.png' ) } />
                </View>        
            </GeneralModal>
        );
    }
}

const styles = {
    image_container: {
        width: DIM.width - ( VARS.spacer.large * 2 ),
        flex: 0,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
}

// Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <MastercardWalletOutcome {...props} navigation={navigation} />;
}