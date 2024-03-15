// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, SafeAreaView, StyleSheet} from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
// external imports
import LinearGradient from 'react-native-linear-gradient';
// icons
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/icons/selection.json';
const Icon = createIconSetFromIcoMoon( icoMoonConfig, 'icomoon', 'icomoon.ttf' );
// context
import { AuthContext } from '../context/AuthContext';
// local components
import GeneralMessage from '../components/GeneralMessage';
// styles
import { STYLES, VARS } from '../Styles';
import { _i } from '../Translations';
import { formatDate } from '../Helpers';

class RewardsShowScreen extends React.Component {

    constructor( props ) {

        super( props );

        const { reward } = props.route.params;

        this.state = {
            reward: reward || null
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

        return (
            <SafeAreaView style={STYLES.container.default}>
                <LinearGradient colors={STYLES.gradients.navy} start={{ x: 1, y: 1 }} end={{ x: 0, y: 0 }} style={{ flex: 0 }}>
                    {
                        this.state.reward &&
                        <View style={STYLES.section.large}>
                            <View style={{marginBottom: 18}}>
                                <Text style={styles.reward_value_text}>{ this.state.reward.value }</Text>
                            </View>
                            <View style={{flexDirection: 'row', marginBottom: 9}}>
                                <Icon name={ 'rc-icon-calendar' } size={16} color={STYLES.colors.white} style={{width: 30, marginTop: 2 }} />
                                <Text style={styles.reward_meta_text}>{ formatDate( this.state.reward.reward_date, 'D MMM YYYY' ) }</Text>
                            </View>
                            <View style={{flexDirection: 'row', marginBottom: 9}}>
                                <Icon name={ 'rc-icon-confirmed' } size={16} color={STYLES.colors.white} style={{width: 30, marginTop: 2 }} />
                                <Text style={styles.reward_meta_text}>{ !this.state.reward.booking_ref ? 'No Booking Reference' : this.state.reward.booking_ref  }</Text>
                            </View>
                            <View style={{flexDirection: 'row', marginBottom: 9}}>
                                {
                                    this.state.reward.status == 'approved' &&
                                    <Icon name={ 'rc-icon-reward-status-approved' } size={16} color={STYLES.colors.white} style={{width: 30, marginTop: 2 }} />
                                }
                                {
                                    this.state.reward.status == 'rejected' &&
                                    <Icon name={ 'rc-icon-reward-status-rejected' } size={16} color={STYLES.colors.white} style={{width: 30, marginTop: 2 }} />
                                }
                                {
                                    ( this.state.reward.status != 'rejected' && this.state.reward.status != 'approved' ) &&
                                    <View style={{width: 35 }}></View>
                                }
                                <Text style={styles.reward_meta_text}>{ this.state.reward.status }</Text>
                            </View>
                        </View>
                    }
                    {
                        !this.state.reward &&
                        <GeneralMessage color={STYLES.colors.white} message={ _i('Could not read reward data') } />
                    }
                </LinearGradient>
            </SafeAreaView>
        );
    };

};

const styles = StyleSheet.create({
    reward_value_text: {
        ...STYLES.text.heading2,
        color: STYLES.colors.white,
    },
    reward_meta_text: {
        ...STYLES.text.body_light,
        color: STYLES.colors.white,
    }
});

    // Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <RewardsShowScreen {...props} navigation={navigation} />;
}