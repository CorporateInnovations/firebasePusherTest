/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, Alert } from 'react-native';
// local components
import GeneralModal from '../components/GeneralModal';
import HeadingGroup from '../components/HeadingGroup';
// context
import { UserContext } from '../context/UserContext';
// styles
import { STYLES } from '../Styles';

//transfer

/*******************************************************************************
 * RewardsClaimBooking Class
 ******************************************************************************/
export default class RewardsClaimBooking extends React.Component {

    render() {

        return (
            <UserContext.Consumer>{( userContext ) => {
                const { claimBooking, renderFields } = userContext;

                return (
                    <GeneralModal
                        active={ claimBooking.active }
                        actions={ claimBooking.actions }
                    >
                        {
                            claimBooking.state == 'form' &&
                            <View>
                                { renderFields('claim') }
                            </View>
                        }
                        {
                            claimBooking.state == 'outcome' &&
                            <HeadingGroup
                                heading={ claimBooking.outcomeHeading }
                                body={ claimBooking.outcomeBody }
                                textColor={STYLES.colors.navy.default}
                            />
                        }
                    </GeneralModal>
                );
            }}</UserContext.Consumer>
        );
    }
}

RewardsClaimBooking.contextType = UserContext;
