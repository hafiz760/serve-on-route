import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { TextInput } from '../../../component/Form';
import { Text, Icon } from '../../../component/Basic';
import theme from '../../../theme/styles';
import { COLOR } from '../../../theme/typography';
import styles from './styles';

const BiddingCard = ({ val, CloseModelBaseOnId, handleBid }) => {
  const [biddingValue, setBiddingValue] = useState(val?.fare);
  const [isBidFormShow, setBidFormShow] = useState(false);

  // Helper to format date safely
  const formatDate = (dateString) => {
    if (!dateString) return '';
    // If it's already a clean date string, return it
    if (typeof dateString === 'string' && dateString.length === 10) return dateString;
    try {
      // Handle potential JSON stringified format from original code
      const cleanStr = dateString.replace(/['"]+/g, '');
      return cleanStr.substring(0, 10);
    } catch (e) {
      return dateString;
    }
  };

  return (
    <View style={styles.cardContainer}>
      {/* Header Section */}
      <View style={styles.cardHeader}>
        <Image
          source={require('../../../assets/images/avatar.png')}
          resizeMode="cover"
          style={styles.cardAvatar}
        />
        <View style={styles.cardHeaderInfo}>
          <Text style={styles.cardName}>
            {val?.customer_id?.first_name} {val?.customer_id?.last_name}
          </Text>
          <Text style={styles.cardCity}>City: {val?.customer_id?.city}</Text>
        </View>
        <Text style={styles.cardPrice}>$ {val?.fare}</Text>
      </View>


      {/* Route Section */}
      <View style={styles.routeContainer}>
        <View style={styles.routeRow}>
          <View style={styles.routeItem}>
            <Text style={styles.locationLabel}>FROM</Text>
            <Text style={styles.locationText}>{val?.from_location}</Text>
          </View>
          <View style={styles.routeItem}>
            <Text style={styles.locationLabel}>TO</Text>
            <Text style={styles.locationText}>{val?.to_location}</Text>
          </View>
        </View>
      </View>

      {/* Details Grid */}
      <View style={styles.detailGrid}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Receiving Slot</Text>
          <Text style={styles.detailValue}>{val?.receiving_slot}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Delivery Time</Text>
          <Text style={styles.detailValue}>
            {formatDate(val?.time)}
          </Text>
        </View>

      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.declineBtn]}
          onPress={() => CloseModelBaseOnId(val.id)}>
          <Text style={styles.declineBtnText}>Decline</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.offerBtn]}
          onPress={() => setBidFormShow(!isBidFormShow)}>
          <Text style={styles.actionBtnText}>Make Offer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.acceptBtn]}
          onPress={() => handleBid(biddingValue, val)}>
          <Text style={styles.actionBtnText}>Accept</Text>
        </TouchableOpacity>
      </View>

      {/* Bid Form */}
      {isBidFormShow && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 15,
              backgroundColor: '#F8F9FA',
              borderRadius: 8,
              padding: 5,
            }}>
            <TextInput
              placeholder="Enter Your Offer"
              placeholderTextColor={COLOR.GREYVIOLET}
              keyboardType="numeric"
              style={{
                flex: 1,
                height: 45,
                paddingHorizontal: 15,
                color: COLOR.DARK,
                fontFamily: 'Roboto-Bold', // Assuming font family availability
              }}
              onChangeText={setBiddingValue}
              onSubmitEditing={() => handleBid(biddingValue, val)}
              value={String(biddingValue)}
            />
            <TouchableOpacity
              onPress={() => {
                handleBid(biddingValue, val);
                Keyboard.dismiss();
              }}
              style={{
                padding: 10,
                backgroundColor: COLOR.PRIMARY,
                borderRadius: 6,
                marginRight: 5,
              }}>
              <Icon
                name="send"
                type="FontAwesome"
                style={{ color: 'white', fontSize: 16 }}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
};

export default BiddingCard;
