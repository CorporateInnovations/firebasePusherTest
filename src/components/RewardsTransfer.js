/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { Alert } from 'react-native';
// local components
import GeneralModal from '../components/GeneralModal';
import HeadingGroup from '../components/HeadingGroup';
// context
import { UserContext } from '../context/UserContext';
// styles
import { STYLES } from '../Styles';

//transfer

/*******************************************************************************
 * RewardsTransfer Class
 ******************************************************************************/
export default class RewardsTransfer extends React.Component {

    render() {

        return (
            <UserContext.Consumer>{( userContext ) => {
                const { rewardsTransfer } = userContext;

                return (
                    <GeneralModal
                        active={ rewardsTransfer.active }
                        actions={ rewardsTransfer.actions }
                    >
                        <HeadingGroup
                            heading={ rewardsTransfer.outcomeHeading }
                            body={ rewardsTransfer.outcomeBody }
                            textColor={STYLES.colors.navy.default}
                        />
                    </GeneralModal>
                );
            }}</UserContext.Consumer>
        );
    }
}

RewardsTransfer.contextType = UserContext;
