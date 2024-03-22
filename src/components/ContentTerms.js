// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, SafeAreaView, StyleSheet, ScrollView, Alert, Linking, KeyboardAvoidingView, Platform } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
// lodash
import _ from 'lodash';

// local components

// helpers
// https://github.com/react-native-linear-gradient/react-native-linear-gradient
import { _i } from '../Translations';

// styles
import { STYLES, VARS } from '../Styles';

class ContentTerms extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            agreeTerms: false,
            agreeCookies: false,
            saveInProgress: false
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
            <>
                <View style={STYLES.section.large}>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>Thank you for visiting our website or downloading the Club Royal Plus app. These Terms and Conditions of Use apply to the entire group of websites and apps owned, operated, licensed or controlled by Royal Caribbean Cruises Ltd., Celebrity Cruises Inc., or their affiliates (collectively the "Company"), including but not limited to the websites <Text style={{color: STYLES.colors.yellow.default}} onPress={() => Linking.openURL('https://www.royalcaribbean.com')}>www.royalcaribbean.com</Text>, and <Text style={{color: STYLES.colors.yellow.default}} onPress={() => Linking.openURL('https://www.celebritycruises.com')}>www.celebritycruises.com</Text>. <Text style={{color:STYLES.colors.yellow.default}} onPress={() => Linking.openURL('https://www.myclubroyal.co.uk')}>www.myclubroyal.co.uk</Text> and related websites using the .ie and .co.uk suffixes and the Club Royal Plus app (collectively the "Company Websites"). Club Royal and Rewards are managed in the UK by RCL Cruises Ltd (company no. 07366612) trading as Royal Caribbean International with registered office address at 7 The Heights, Brooklands, Weybridge, Surrey KT13 0XW ("RCL"). We offer services and programs in many parts of the world.  Company Websites may refer to certain services or programs which are not available worldwide, without specifically limiting the offers as such. Such reference does not imply that the Company intends to offer such service or programs in all countries or locations.</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>Read these Terms and Conditions of Use carefully before using this website or any other Company Website.</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>By using this website, the Club Royal Plus app or any other Company Website, you signify your assent to these terms of use, all applicable laws and regulations (including export and re-export control laws) and agree that you are responsible for compliance with any applicable local laws.  If you do not agree to these terms of use, please do not use the sites.  We reserve the right, in our sole discretion, to change, modify, delete or otherwise alter portions of these terms at any time. Any such change, modification, deletion or alteration shall be effective immediately upon posting the same on a Company Website. Please check these terms periodically for changes. Your continued use of any Company Website following the posting of such changes means you accept those changes.</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_heading}>Participation</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>Club Royal and the Rewards Scheme is open to qualifying current employees (“Participants”) of UK and Republic of Ireland approved Travel Agents who are authorised by RCL to promote and sell Royal Caribbean International branded cruise package holidays (“hereinafter in the singular “Approved Travel Agent” or plural “Approved Travel Agencies” as applicable).</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>Participants are entitled to participate in the UK and Ireland Club Royal and Rewards programs only on the basis of their employment by an approved Travel Agent who have a Business Partnership Agreement with RCL (“Approved Travel Agency”). Participants acknowledge and accept that the Company and the Approved Travel Agency which employs the Participant may from time to time share details of a Participant’s Club Royal accounts and Bookings claimed through Rewards, for the purpose of account administration and verification of the Participant’s compliance with these Terms and Conditions and entitlement to Rewards claimed, in accordance with RCL’s legitimate interests in operating this Reward Scheme. For more information on RCL’s privacy policy, see the Club Royal website (<Text style={{color:STYLES.colors.yellow.default}} onPress={() => Linking.openURL('https://www.myclubroyal.co.uk')}>www.myclubroyal.co.uk</Text>).</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>RCL reserves the right to de-activate any Participant’s membership in the event that they fail to log into their Club Royal account for a period of 6 consecutive months. RCL will write to those Participants who have failed to log into their accounts for a consecutive 6-month period by email and give them a notice period of 30 days to log back into their account for it to remain active. In the event that a Participant does not log back in to their Club Royal account within 30 days of receiving any such email notification from us, the Participant’s membership shall then automatically de-activate, and all unclaimed benefits or funds not previously transferred to a prepaid MasterCard shall be forfeited.</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_heading}>Privacy</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>Any personal data you transmit to a Company Website by electronic mail or otherwise will be used by the Company in accordance with the privacy policy of the Company in your territory which you can access by visiting <Text style={{color:STYLES.colors.yellow.default}} onPress={() => Linking.openURL('https://www.royalcaribbean.co.uk/privacy')}>www.royalcaribbean.co.uk/privacy</Text>. That privacy policy refers to what is considered to be “personal data” by applicable laws. Any other communication or material you transmit to a Company Website, such as questions, comments and suggestions, will be treated as non-confidential and nonproprietary. The Company shall be free to use such communication or material, including any ideas, inventions, concepts, techniques or know-how disclosed therein, for any legitimate purpose without further permission from you. This provision is without prejudice to your statutory rights.</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_heading}>Passwords</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>Passwords are personal to you. As such as a condition of accessing Club Royal and Rewards, you undertake to keep your password confidential at all times and not share with it with third parties. It is your responsibility to keep password and user name details secret, and RCL shall have no liability for any loss suffered by you where such loss is attributed to a failure by you to maintain adequate account security.</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>You also undertake to log off from the Club Royal website if you are likely to be away from your computer for any prolonged periods.</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>In the event of you ceasing to be a current employee in good standing of an Approved Trade Partner, you shall no longer make use of Club Royal in any way.</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_heading}>UK and Ireland Club Royal Plus Specific Terms & Conditions</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>1.</Text>
                            <Text style={STYLES.text.bullet_content}>1.	By registering your details to participate in Club Royal, either via the platform (<Text style={{color:STYLES.colors.yellow.default}} onPress={() => Linking.openURL('https://www.myclubroyal.co.uk')}>www.myclubroyal.co.uk</Text>) or via the Club Royal Plus app, you agree to the following terms and conditions: You must download our Club Royal Plus app (available on Apple or Android devices) to find out about our latest campaigns and company news, to claim and spend your rewards and to take part in our exclusive ballots.</Text>
                        </View>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_heading}>UK and Ireland Rewards Specific Terms & Conditions</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>By registering your details to participate in Rewards Scheme (“Rewards Scheme”) you agree to the following terms and conditions:</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>1.</Text>
                            <Text style={STYLES.text.bullet_content}>1.	RCL reserves the right to vary or withdraw the Rewards Scheme at any time by giving a minimum of 30 days’ notice to Reward Scheme Participants of any variations in terms or withdrawal of the Reward Scheme, such notice to be dispatched to Participants by email to their registered email address. Variations to terms will be set out herein from the effective date of such change and shall be binding on all Participants from that date. On the effective date of termination of the Rewards Scheme all unused benefits remaining following a notice period will immediately expire.</Text>
                        </View>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>2.</Text>
                            <Text style={STYLES.text.bullet_content}>To be permitted to become a Participant of the Scheme, Participants must:</Text>
                        </View>
                        <View style={STYLES.text.bullet_sub_row}>
                            <View style={STYLES.text.bullet_row}>
                                <Text style={STYLES.text.bullet_mark}>a)</Text>
                                <Text style={STYLES.text.bullet_content}>have successfully completed the Royal Caribbean Learning module - 'We Are Royal'</Text>
                            </View>
                            <View style={STYLES.text.bullet_row}>
                                <Text style={STYLES.text.bullet_mark}>b)</Text>
                                <Text style={STYLES.text.bullet_content}>at all times, be employed by an Approved Travel Agency. For the avoidance of doubt, RCL shall have no liability to Participants where for whatever reason an Approved Travel Agency ceases to qualify as an Approved Travel Agency. In such circumstances RCL shall suspend such Participant’s account without any liability to Participant. RCL will however permit Participant to utilise any benefits accrued up to that time in accordance with the terms of the Reward Scheme;</Text>
                            </View>
                            <View style={STYLES.text.bullet_row}>
                                <Text style={STYLES.text.bullet_mark}>c)</Text>
                                <Text style={STYLES.text.bullet_content}>be permitted to participate at all times in the Scheme by their employer who must be an Approved Travel Agency. In the event that an Approved Travel Agency advises RCL that it does not agree to the intended or continued participation of any Participants in the Reward Scheme, RCL shall suspend such Participant’s account without liability to RCL. RCL will however, if requested by the Approved Travel Agency, permit Participant to utilise any rewards accrued up to the time of suspension in accordance with the terms of the Reward Scheme.</Text>
                            </View>
                        </View>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>3.</Text>
                            <Text style={STYLES.text.bullet_content}>Participants acting in the course of their employment with an Approved Travel Agency shall be required to register at <Text style={{color:STYLES.colors.yellow.default}} onPress={() => Linking.openURL('https://www.myclubroyal.co.uk')}>MyClubRoyal.co.uk</Text> (the “Website”) any confirmed valid booking they have personally made with a consumer for a Royal Caribbean International branded cruise only or Fly-Cruise package holiday (a “Qualifying Booking”).</Text>
                        </View>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>4.</Text>
                            <Text style={STYLES.text.bullet_content}>Only one registration may be made for each Qualifying Booking made since the inception of the Reward Scheme and such Qualifying Bookings must be registered within 40 days of receipt of a confirmation from RCL.</Text>
                        </View>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>5.</Text>
                            <Text style={STYLES.text.bullet_content}>All registrations of Qualifying Bookings are subject to approval by RCL, who may give or decline approval to participate in the Reward Scheme or any promotions running on the Reward Scheme at any time in its absolute discretion. The Participant shall be notified accordingly and shall have no right to appeal against any such notification.</Text>
                        </View>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>6.</Text>
                            <Text style={STYLES.text.bullet_content}>All approved Royal Caribbean bookings made from 27th January 2022 will receive the below new pay-out per booking, based on stateroom category. The amount paid per booking will be the same for all members (irrespective of their previous membership tier). If the booking is later upgraded, RCL will not pay out the increased applicable amount for an original booking.</Text>
                        </View>
                        <View style={{ ...STYLES.text.table, paddingLeft: 25 }}>
                            <View style={STYLES.text.table_row}>
                                <Text style={STYLES.text.table_head}>Stateroom Category</Text>
                                <Text style={STYLES.text.table_head}>Total Pay-out</Text>
                            </View>
                            <View style={STYLES.text.table_row}>
                                <Text style={STYLES.text.table_cell}>Interior/Oceanview</Text>
                                <Text style={STYLES.text.table_cell}>£5</Text>
                            </View>
                            <View style={STYLES.text.table_row}>
                                <Text style={STYLES.text.table_cell}>Balcony</Text>
                                <Text style={STYLES.text.table_cell}>£10</Text>
                            </View>
                            <View style={STYLES.text.table_row}>
                                <Text style={STYLES.text.table_cell}>Suite</Text>
                                <Text style={STYLES.text.table_cell}>£15</Text>
                            </View>
                        </View>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>7.</Text>
                            <Text style={STYLES.text.bullet_content}>RCL will honour all approved eligible Club Rewards bookings which have been claimed but then are subsequently cancelled.</Text>
                        </View>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>8.</Text>
                            <Text style={STYLES.text.bullet_content}>From 31st March 2020 all new bookings whereby FCCs (Future Cruise Credits) are amended using Lift & Shift will not be eligible for any pay outs.</Text>
                        </View>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>9.</Text>
                            <Text style={STYLES.text.bullet_content}>Group & on-board bookings will only ever receive the standard £5.00 per booking. They will not be included in any stateroom category pay outs or Club Reward accelerators.</Text>
                        </View>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>10.</Text>
                            <Text style={STYLES.text.bullet_content}>Participants who book a Royal Caribbean cruise are eligible to claim Holiday Cash Back within 4 weeks of their sailing date. Agents simply claim this through Club Rewards website. All members will receive £100, Holiday Cash Back which cannot be claimed on ship launch sailings, competition cruises and other selected sailings.</Text>
                        </View>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>11.</Text>
                            <Text style={STYLES.text.bullet_content}>Any interline bookings claiming holiday cash back must include the full gratuities for every guest sailing. If gratuities have been removed from the booking, the holiday cash back request will be declined.</Text>
                        </View>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>12.</Text>
                            <Text style={STYLES.text.bullet_content}>RCL may vary rewards and incentives from time to time and will advertise the latest incentives on the <Text style={{color:STYLES.colors.yellow.default}} onPress={() => Linking.openURL('https://www.myclubroyal.co.uk')}>myClubRoyal.co.uk</Text> website.</Text>
                        </View>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>13.</Text>
                            <Text style={STYLES.text.bullet_content}>Once a registration of a Qualifying Booking is made, it will be validated by RCL within 14 working days and subject to approval, points will be credited to the Participants' personal “Virtual Account” on the website.</Text>
                        </View>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>14.</Text>
                            <Text style={STYLES.text.bullet_content}>The decision by RCL to approve or deny registrations shall be in their sole discretion and in accordance with the rules of this site. No discussions shall be entered into where such are registrations overrule the terms of the Rewards Scheme from time to time in force.</Text>
                        </View>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>15.</Text>
                            <Text style={STYLES.text.bullet_content}>Registrations can only be made against Qualifying Bookings made directly by Participants who have legitimately made the Booking and any claims made by other Participants for the same Qualifying Bookings that are validated as belonging to a different Participant shall result in the suspension or exclusion of the offending Participant(s) by RCL from the Reward Scheme at its absolute discretion and/or the loss of any accrued rewards or benefits in their Virtual Account.</Text>
                        </View>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>16.</Text>
                            <Text style={STYLES.text.bullet_content}>Rewards will be received in the form of a virtual prepaid Mastercard ("Reward Card"). Upon registration to the Reward Scheme on the website, Participants will be required to provide personal details in order to facilitate the activation of a Reward Card, which will be issued to a new Participant only once they have made a successful Qualifying Booking. Participants will need to download the Club Royal Plus App and set up the virtual card.  Members will then be able to view balances & transfer rewards from their Virtual Account to their Reward Card (details of how to activate the Reward Card, where it can be used, and answers to some Frequently Asked Questions can be found on the website).</Text>
                        </View>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>17.</Text>
                            <Text style={STYLES.text.bullet_content}>Participants will only receive a Reward Card upon claiming their first booking through Club Rewards.</Text>
                        </View>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>18.</Text>
                            <Text style={STYLES.text.bullet_content}>RCL reserves at its absolute discretion the right to debit funds and/or benefits from a Participant account in the event that a Qualifying Booking is subsequently cancelled prior to fulfilment.</Text>
                        </View>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>19.</Text>
                            <Text style={STYLES.text.bullet_content}>RCL may from time to time vary the design, look, feel and benefits associated with the Reward Card and may, at its sole discretion offer different types of Reward Cards that offer different tiers or variations of benefits.</Text>
                        </View>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>20.</Text>
                            <Text style={STYLES.text.bullet_content}>Activation and use of the Reward Card is also subject to the Mastercard Terms and Conditions which can be found on Club Rewards website (<Text style={{color:STYLES.colors.yellow.default}} onPress={() => Linking.openURL('https://www.myclubroyal.co.uk')}>www.myclubroyal.co.uk</Text>) once you are signed up to be a Club Rewards members. By activating the MasterCard, Participants are deemed to have read, understood, accepted and be bound by the MasterCard Terms and Conditions.</Text>
                        </View>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>21.</Text>
                            <Text style={STYLES.text.bullet_content}>For the avoidance of doubt, the terms and conditions of MasterCard relating to the use of any prepaid card shall be incorporated herein and as such, any breach of MasterCard's terms and conditions from time to time in force shall be considered a breach of the terms and conditions of the Reward Scheme.</Text>
                        </View>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>22.</Text>
                            <Text style={STYLES.text.bullet_content}>Reward Cards will be issued in the name of the registered Participant and rewards will be credited to the Virtual Account of the Participant once their claims have been verified by RCL.</Text>
                        </View>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>23.</Text>
                            <Text style={STYLES.text.bullet_content}>All Reward Cards have an expiry date - this will be stated on the virtual Card itself. The expiry date will be approximately two years from the date of issue. Any rewards on the Reward Card that are not utilised prior to the expiry of the card shall be forfeited unless a new Reward Card is issued to the Participant, in which case such funds will be transferred to the new Rewards Card.</Text>
                        </View>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>24.</Text>
                            <Text style={STYLES.text.bullet_content}>Any rewards in a Participant's Virtual Account which have not been transferred to the Reward Card within 24 months of being earned (the “Expiry Date”) will be forfeited by the Participant. This means that Participants will not be entitled to, or able to use, those virtual rewards in their account after the Expiry Date and RCL shall deduct such unused credit or benefits accordingly after 24 months without liability to Participants. Once a Participant's Reward Card has expired, a new virtual Reward Card will be provided to the Participant PROVIDED THAT that they remain eligible to participate in the Reward Scheme.</Text>
                        </View>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>25.</Text>
                            <Text style={STYLES.text.bullet_content}>For the avoidance of doubt, new and replacement Reward Cards will not be given to Participants that are no longer eligible to participate in the Reward Scheme (including, for example, if they are no longer employed by the Approved Travel Agency, or if they have not made a Royal Caribbean booking within a 6-month period).</Text>
                        </View>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>26.</Text>
                            <Text style={STYLES.text.bullet_content}>RCL will cover any tax & National Insurance applicable to each approved booking payment. Rewards will constitute income for Participants and accordingly, RCL will account for any taxes and national insurance on the reward(s) earned. RCL Cruises Limited has a basic rate TAS in place. Therefore, higher rate taxpayers that have received rewards will need to include the benefit on their personal tax return.</Text>
                        </View>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>27.</Text>
                            <Text style={STYLES.text.bullet_content}>RCL reserves the right to de-activate any Participant's membership in the event that they fail to log into their Club Rewards account for a period of 6 consecutive months. RCL will write to those Participants who have failed to log into their accounts for a 6-month period by email and give them a period of 30 days' to log back into their account for it to remain active. In the event that a Participant does not log back in to their Rewards account within 30 days of receiving any such email notification from us, the Participant's membership shall then automatically terminate and all unclaimed funds not previously transferred to a prepaid MasterCard shall be forfeited.</Text>
                        </View>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>28.</Text>
                            <Text style={STYLES.text.bullet_content}>RCL will not be liable for any act or omission caused for reasons outside of its reasonable control in relation to the Reward Scheme or the Reward Cards.</Text>
                        </View>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>29.</Text>
                            <Text style={STYLES.text.bullet_content}>Notwithstanding the aforementioned, save where contrary to applicable law, our liability to each Participant shall be limited to the financial amount (if any) accrued by that Participant in any calendar year.</Text>
                        </View>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>30.</Text>
                            <Text style={STYLES.text.bullet_content}>RCL reserves the right to suspend or cancel payment of any reward or deduct rewards from a Participant's virtual account or the Reward Card at any time, during or after the claim verification process, in the event of a misrepresentation of a reward entitlement, a duplicate claim being made for a single reward, disqualified submissions or as a result of any other act or omission that results in the incorrect payment of a reward. RCL will not be liable to the Participant in relation to such incorrect payment.</Text>
                        </View>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>31.</Text>
                            <Text style={STYLES.text.bullet_content}>In the event of any suspected irregularity, misuse or fraud, RCL shall be entitled to suspend and, where verified, terminate a Participant's membership and Virtual Account without any liability to Participants.</Text>
                        </View>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>32.</Text>
                            <Text style={STYLES.text.bullet_content}>Participants and Approved Travel Agencies agree that RCL may request you to allow us to feature you and/or your company in publicity in connection with the Reward Scheme, and we may request that you consent to our use of your image. Such publicity may include (without limitation) photo shoots and features for use in trade press, magazines, the website and RCL's internal and external websites. Participation in such publicity is optional.</Text>
                        </View>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>33.</Text>
                            <Text style={STYLES.text.bullet_content}>Participants are entitled to participate in this Programme only on the basis of their current employment by an Approved Travel Agency. Participants acknowledge and accept that RCL and the Approved Travel Agency which employs the Participant may from time to time share details of the Bookings made by the Participant and the Rewards claimed by the Participant, for the purpose of administration or verification of the Participant's compliance with these Terms and Conditions and entitlement to Rewards claimed, in accordance with RCL's legitimate interests in operating this Reward Scheme. You may upload a profile image which may also be used to identify you in any competitions that you participate in e.g. leader boards. You warrant that any image uploaded shall be not be fraudulent, dishonest, misleading, obscene in nature, considered in bad taste, breach any third- party copyright, privacy or image rights or in any way feature any unlawful images or material. While all images will be vetted for suitability, any breach by a Participant of this term shall allow Club Rewards the right to terminate membership.</Text>
                        </View>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>RCL provides the Reward Scheme as a means of providing reasonable and lawful incentives for the promotion of its products and services. By participating in the Reward Scheme, each Participant agrees that it is a condition of their participation that they shall comply with all applicable laws, statutes, regulations and further any codes in relation to anti-bribery, anti-slavery and anti-corruption.</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_heading}>UK and Ireland Learn & Ballot Prizes Specific Terms & Conditions</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>With effect from 23rd August 2022, UK & Ireland Club Royal Members will have the opportunity to enter Ballot Prizes, upon completion of the relevant Tier Level Learn modules and upon making and claiming for the required number of bookings for each Tier level.</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>To be able to move through the Tiers and gain access to higher value Ballot Prizes, members will have to complete the required number of Learn modules and claim for the required number of bookings for each Tier. </Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>Any bookings that have been claimed for prior to 23rd August 2022 will not be counted and the member’s account will all be re-set to 0 upon launch (23rd August 2022).</Text>
                    </View>
                    <View style={{ ...STYLES.text.table, paddingLeft: 25 }}>
                        <View style={STYLES.text.table_row}>
                            <Text style={STYLES.text.table_head}>TIER LEVEL</Text>
                            <Text style={STYLES.text.table_head}>NEEDED TO PROGRESS</Text>
                        </View>
                        <View style={STYLES.text.table_row}>
                            <Text style={STYLES.text.table_cell}>Learner</Text>
                            <Text style={STYLES.text.table_cell}>Completion of all available modules</Text>
                        </View>
                        <View style={STYLES.text.table_row}>
                            <Text style={STYLES.text.table_cell}>Expert</Text>
                            <Text style={STYLES.text.table_cell}>Completion of all available modules AND to make and claim for 25 bookings or more</Text>
                        </View>
                        <View style={STYLES.text.table_row}>
                            <Text style={STYLES.text.table_cell}>Guru</Text>
                            <Text style={STYLES.text.table_cell}>Completion of all available modules AND to make and claim for 50 bookings or more</Text>
                        </View>
                        <View style={STYLES.text.table_row}>
                            <Text style={STYLES.text.table_cell}>Royal Guru</Text>
                            <Text style={STYLES.text.table_cell}>Complete the Accreditation module with a pass rate of 90% or more</Text>
                        </View>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>Members who achieve Guru level have the chance to become a Royal Guru upon completion of the Accreditation module, where members have to answer 30 multiple choice questions which are pulled at random each time. The Accreditation module is timed to 30 minutes, during which time members must get 90% or more to be able to pass. Members who do not pass the Accreditation module can re-take it after 24 hours have passed. Members who gain Royal Guru will also have to re-take the Accreditation module on their 1-year anniversary of passing and each year thereafter, in order to remain at Royal Guru level status.</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>Ballot Prizes are only available on the Club Royal Plus App where Members can select which prizes they wish to enter for by selecting ‘Enter’ on the Ballot Prize available to them in their Tier level. Each prize will have its own Terms and Conditions. In entering for the Ballot Prize(s) the member is considered to have read and agreed to those Terms and Conditions.</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>Members who wish to hear about our Ballot Prizes and Learn Updates and Events can choose to opt into our email marketing communications via the My Profile section on the My Club Royal website and/or app. </Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_heading}>Limited License</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>You should assume that everything that you read or see on any Company Website is copyrighted or otherwise protected and owned by the Company or some third party who licensed to the Company the right to use such material. Unless otherwise expressly noted, nothing that you read or see on any Company Website may be copied or used except as provided in these Terms and Conditions of Use or with the prior written approval of Royal Caribbean Cruises Ltd. To obtain such approval, please contact <Text style={{color:STYLES.colors.yellow.default}} onPress={() => Linking.openURL('mailto:royalsalessupportuk@rccl.com')}>royalsalessupportuk@rccl.com</Text></Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>We grant you permission to print individual pages from a Company Website, unless otherwise expressly noted, for your own personal, noncommercial use in learning about, evaluating or purchasing the Company's services or products. No other permission is granted to you to print, copy, reproduce, distribute, license, transfer, sale, transmit, upload, download, store, display in public, alter or modify these materials. This grant of permission is not a transfer of title, and under this permission you may not:</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>•</Text>
                            <Text style={STYLES.text.bullet_content}>Use the materials for any commercial purpose, or for any public display (commercial or noncommercial);</Text>
                        </View>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>•</Text>
                            <Text style={STYLES.text.bullet_content}>Remove any copyright, or other proprietary notations from the materials;</Text>
                        </View>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>•</Text>
                            <Text style={STYLES.text.bullet_content}>Transfer the materials to another person or "mirror" the materials on any other server.</Text>
                        </View>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>The permissions granted hereunder shall automatically terminate if you violate any of these restrictions and may be terminated by the Company at any time. The materials contained in the Company Website are protected by applicable copyright, and trademark law. Please review the Company's Copyright, and Trademarks pages for additional details.</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>We make no warranties or representations to you that your use of any materials displayed on a Company Website will not infringe the rights of third parties.</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_heading}>Disclaimers</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>The Company has used reasonable efforts in collecting, preparing and providing quality information and materials, but does not warrant or guarantee the accuracy, completeness, adequacy or currency of the information contained in or linked to this website or any other Company Website. Users of information from this website or any other Company Website or links do so at their own risk. We assume no liability or responsibility for any errors or omissions in the content of any Company Website. The Company is not responsible for pricing, typographical, or other errors and reserves the right to cancel without liability any bookings made at erroneous rates. While the Company may make changes to the information in any Company Website or to any Company service or product at any time without notice, the Company makes no commitment to update the information on a Company Website.</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>The materials in the Company Websites are provided "as is" and without warranties of any kind either express or implied, including without limitation any warranty for materials, information services or other services or products provided through or in connection with any Company Website. To the fullest extent permissible pursuant to applicable law, company disclaims all warranties, express or implied, including, but not limited to, implied warranties of accuracy, merchantability and/or fitness for a particular purpose.</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>The company does not warrant that the functions contained in the materials will be uninterrupted or error-free, that defects will be corrected, or that this site or any other Company Website or the server(s) that makes the Company Websites available are free of viruses or other harmful components.</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>To the fullest extent allowed by applicable law, the company does not warrant or make any representations regarding the use or the results of the use of the materials in this website or any other Company Website in terms of their correctness, accuracy, reliability, or otherwise. You (and not the company) assume the entire cost of all necessary servicing, repair, or correction.</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>This disclaimer of liability applies to any damages or injury caused by any failure of performance, error, omission, interruption, deletion, defect, delay in operation or transmission, computer virus, communication line failure, theft or destruction or unauthorized access to, alteration of, or use of record, whether for breach of contract, tortious behavior, negligence or under any other cause of action.</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_heading}>Limitation of Liability</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>Under no circumstances, including, but not limited to, negligence, shall the Company be liable for any special or consequential damages that result from the use of, or the inability to use, the materials in this website or any other Company Website, even if the Company or a Company authorized representative has been advised of the possibility of such damages. In no event shall the Company's total liability to you for all damages, losses, and causes of action (whether in contract, tort (including, but not limited to, negligence), or otherwise) exceed the amount paid by you, if any, for accessing this site or any other Company Websites.</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_heading}>Governing Law</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>These terms and conditions shall be governed in accordance with the laws of England, excluding provisions regarding conflicts of law. Participants agree to submit to the exclusive jurisdiction of the English Courts for all matters (including contractual and non-contractual disputes) involving this Reward Scheme.</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_heading}>Website Copyrights</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>Unless otherwise expressly noted, all materials, including images, illustrations, designs, icons, photographs, appearing anywhere on a Company Website are protected by worldwide copyright laws and treaty provisions. The copyright on such materials is held by or on behalf of the original creator of the materials. None of the materials may be copied, reproduced, displayed, modified, published, uploaded, posted, transmitted, or distributed in any form or by any means other than as described in the Linking Policy section or with the specific cruise brand's prior written permission. All rights not expressly granted herein are reserved. Any unauthorized use of the materials appearing on Company Website may violate copyright, trademark and other applicable laws and could result in criminal or civil penalties. </Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>U.S. Government Rights: United States Government license rights in the materials appearing on Company Websites are limited to those mandatory rights identified in ARS 252.227-7015(b) and all other applicable laws and regulations. All other use is prohibited without the prior written approval of the applicable cruise brand. Use of any of the materials appearing on Company Websites by the Government constitutes acknowledgment and acceptance of the Company's proprietary rights in the materials.</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_heading}>Trademarks</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>The trademarks, service marks, logos and graphics (the "Trademarks") appearing on Company Websites are registered and unregistered Trademarks of Royal Caribbean International's or its subsidiaries (collectively, "Royal Caribbean") or others.</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>Other product names used in this publication are for identification purposes only and may be trademarks of their respective companies. No license or right is granted by implication, estoppel or any other means to use any Trademark appearing on Company Websites.</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>Any use of Royal Caribbean's Trademarks or linking to a Company Website must follow the terms set out in our Linking Policy section. A partial list of the Trademarks owned by Royal Caribbean and its subsidiaries, is set out below. If you are unsure whether a trademark, service mark, logo or graphic not on the list is the property of a Company or if you have any questions about the use of Royal Caribbean's Trademarks please contact our Webmaster. Royal Caribbean vigilantly enforces its intellectual property rights and will actively seek the recovery of any costs and damages it may incur preventing the misuse or misappropriation of its property.</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_heading}>TRADE/SERVICE MARKS</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>A non-exhaustive list of trade/service marks of Royal Caribbean Cruises Ltd includes:</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>Royal Caribbean, Adventure of the Seas®, Allure of the Seas®, Anthem of the Seas®, Brilliance of the Seas®, Enchantment of the Seas®, Explorer of the Seas®, Freedom of the Seas®, Grandeur of the Seas®, Harmony of the Seas®, Icon of the SeasSM, Independence of the Seas®, Jewel of the Seas®, Liberty of the Seas®, Mariner of the Seas®, Navigator of the Seas®, Oasis of the Seas®, Odyssey of the SeasSM, Ovation of the Seas®, Quantum of the Seas®, Radiance of the Seas®, Rhapsody of the Seas®, Serenade of the Seas®, Symphony of the Seas®, Spectrum of the Seas®, Vision of the Seas®, Voyager of the Seas®, Wonder of the SeasSM.</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>Perfect Day and CocoCay are trademarks of Royal Caribbean.</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>A number of our features onboard have trademarked names, if you would like a list of these, please contact us for further information.</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>The contents of these terms and conditions replace all previous editions. Whilst every effort is made to ensure the accuracy of the terms and conditions at the time of issue, regrettably errors do occasionally occur, and information may have changed since the date of issue.</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>WOW is a trademark of Royal Caribbean International®</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>Ships of Bahamian Registry at Royal Caribbean® International, we pride ourselves on the quality of our staff. We are committed to ongoing training, a part of which sometimes involves the recording of telephone calls.</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>Trademarks registered in the United States and selected territories worldwide.</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>© 2023 Royal Caribbean International® All Rights Reserved.</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_heading}>Linking Policy For Travel Agents</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>These Terms and Conditions of Use apply to the entire group of Company Websites. Many Company Websites contain links to or frames of non-Company Websites. We try to include links and frames only to other sites that are in good taste, but we do not control nor are we responsible for the contents of those sites. Similarly, we cannot guarantee that such non-Company Websites will not change without our knowledge. The inclusion of a link to or frame of any non-Company Websites does not imply the Company's endorsement of the linked or framed sites or their content. Any concerns regarding any such service or resource, or any link thereto, should be directed to the particular service or resource.</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>The Company encourages links to its Internet sites by bona fide travel agents. Any such links to a Company Website must conform to the following rules:</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>Unless the Company provides you, the travel agent, with prior authorization in writing, any link to a Company Website must use one of the logos which are protected by trademark law.</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>The Company grants you a limited license to use these logos, but does not transfer title in these logos to you. The logos may only be used as an active link to the appropriate Royal Caribbean and Celebrity Cruises website.  To download the Royal Caribbean logo, please log into <Text style={{color:STYLES.colors.yellow.default}} onPress={() => Linking.openURL('https://www.myclubroyal.co.uk')}>www.myclubroyal.co.uk</Text> and visit the toolbox area.</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>•</Text>
                            <Text style={STYLES.text.bullet_content}>You may not use the logos to imply that any portion of the Company has sponsored or endorsed your website without receiving the prior written permission of the Company</Text>
                        </View>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>•</Text>
                            <Text style={STYLES.text.bullet_content}>You may not alter the logos in any way, including proportions or colors and may not animate or morph the logos to change their appearance.</Text>
                        </View>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>•</Text>
                            <Text style={STYLES.text.bullet_content}>You may not use the logos on any site which, in the Company's sole discretion, disparages Royal Caribbean or Celebrity Cruises or their affiliates or their respective products or services.</Text>
                        </View>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>•</Text>
                            <Text style={STYLES.text.bullet_content}>The logos may only be used on World Wide Web pages which, in the Company's sole discretion, make accurate references to the Company and its products and/or services. The logos must be placed on the same page as the reference to Royal Caribbean or Celebrity Cruises and as close to the reference as feasible.</Text>
                        </View>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>•</Text>
                            <Text style={STYLES.text.bullet_content}>Any link to a Company Website must only be to that site's home page. As an example, the home page of various Company Websites may be viewed and accessed from the link displayed beneath the logos listed below. No "deep linking" to other pages on a Company Website is permitted without the Company's prior written consent."</Text>
                        </View>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>•</Text>
                            <Text style={STYLES.text.bullet_content}>The Company may, in its sole discretion, terminate your right to use these logos at any time. The Company may take action against any use of the logos that does not conform to these policies or that infringes any right held by the Company and will actively seek the recovery of any costs it may incur preventing any such misuse or damages that may result from such misuse.</Text>
                        </View>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_heading}>Other Logos and Graphics</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>No logos or graphics other than those listed here may be used without the prior written approval of the Company. Any unauthorized use of any materials contained on a Company Website may result in criminal or civil penalties and the Company will actively seek the recovery of any costs and damages it may incur preventing the misuse or misappropriation of its property.</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_heading}>TERMS AND CONDITIONS GOVERNING USAGE OF THE IMAGE LIBRARY</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>By making use of the Image Library you agree the following conditions of use of the Image Library:</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>All images for download shall be used exclusively by Approved Trade Partners to promote the sale of Royal Caribbean International cruise holidays only.</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>You undertake that your use of any advertisement by you featuring any image(s) deriving from the Image Library must strictly adhere to the terms and conditions of the specific image which shall include, but not necessarily be limited to, conditions relating to the following:</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>•</Text>
                            <Text style={STYLES.text.bullet_content}>Permitted distribution channel(s);</Text>
                        </View>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>•</Text>
                            <Text style={STYLES.text.bullet_content}>Geographic scope of use;</Text>
                        </View>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>•</Text>
                            <Text style={STYLES.text.bullet_content}>Duration in time an image may be used for;</Text>
                        </View>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>•</Text>
                            <Text style={STYLES.text.bullet_content}>If any credit to the author is required; and</Text>
                        </View>
                        <View style={STYLES.text.bullet_row}>
                            <Text style={STYLES.text.bullet_mark}>•</Text>
                            <Text style={STYLES.text.bullet_content}>Any special terms and conditions or permissions applicable to any asset.</Text>
                        </View>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>See Image Library for terms and conditions relating to any specific images you wish to make use of. Please ensure you check the terms and conditions relating to the use of any image immediately prior to commencing any marketing/PR campaign utilising such image(s).</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>Notwithstanding compliance with any restrictions on image usage as may be applied to the use of any image, any advertisement featuring any image(s) from the Image Library must also be used strictly in accordance with any brand guidelines provided to you from time to time.</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>You undertake that you will not give access to, provide, share or distribute images to third parties for their own usage outside of your organisation or for any purpose other than specified at 1 or as permitted by us.</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>You will not modify any image(s) without our express written permission.</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>You will immediately inform us in the event of any third -party claim relating to your use of such images.</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>You will indemnify us for any losses we incur as a result of any breach of these terms and conditions or the license to use any image by you. Losses include, but are not limited to, fines, charges, fees, penalties, costs, expenses, compensation, damages and expenses.</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}>You will be solely responsible for any third party costs, including without limitation, residuals, fines, fees or other payments if you make use of any asset outside any limitations notified to you relating to any image.</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_heading}>END</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_heading}>Version: 14 March 2023</Text>
                    </View>

                    {/*} CONTENT BITS
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_light}></Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={STYLES.text.legal_heading}>Passwords</Text>
                    </View>
                    <View style={STYLES.text.bullet_row}>
                        <Text style={STYLES.text.bullet_mark}>•</Text>
                        <Text style={STYLES.text.bullet_content}></Text>
                    </View>
                    <Text style={{color:STYLES.colors.yellow.default}} onPress={() => Linking.openURL('https://')}></Text>
                    {*/}
                </View>
            </>
        );
    };

};

const styles = StyleSheet.create({

});

    // Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <ContentTerms {...props} navigation={navigation} />;
}
