import React from 'react';
import {View, Text} from 'react-native';
import styles from '../styles';
import {ToggleSwitch} from '../../../../component/Form';

export default function PermissionTab({isEnabled, setIsEnabled}) {
  return (
    <View style={styles.profileContainer}>
      <View style={styles.profileContent}>
        <View style={[styles.profileInputDetail, {paddingBottom: -100}]}>
          <View style={styles.switchInfo}>
            <Text style={styles.switchText}>Connect your stripe account</Text>
            <ToggleSwitch setValue={setIsEnabled} value={isEnabled} />
          </View>
        </View>

        <View style={styles.profileInputDetail}>
          <Text style={[styles.permissionText]}>
            Here is the Payment method button you can click the connect account
            button and can enable the payment integration with the help of
            stripe.\n Once you click the button in bottom a ref link is
            generated you can click the link that send control to stripe you
            have to full filled your information then your account us acctivated
            and then you can make payment and recivied the payment from user
          </Text>
        </View>
      </View>
    </View>
  );
}
