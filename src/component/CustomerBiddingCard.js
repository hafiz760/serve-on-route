import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Icon } from './Basic';
import { COLOR, FAMILY, SIZE } from '../theme/typography';

const CustomerBiddingCard = ({ value, onAccept, onDecline }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <View style={styles.avatarContainer}>
          <Image
            source={
              value?.bidder?.avatar
                ? { uri: value?.bidder?.avatar }
                : require('../assets/images/driver.jpeg')
            }
            resizeMode="cover"
            style={styles.avatar}
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.name}>
            {value?.bidder?.first_name} {value?.bidder?.last_name}
          </Text>
          <View style={styles.ratingRow}>
            <Icon name="star" type="FontAwesome" style={styles.starIcon} />
            <Text style={styles.ratingText}>
              Rating: {value?.bidder?.rating || '0'}
            </Text>
          </View>
        </View>

        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>
            ${value?.bid_amount}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.declineButton}
          onPress={() => onDecline(value)}>
          <Text style={styles.declineButtonText}>Decline</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => onAccept(value)}>
          <Text style={styles.acceptButtonText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLOR.PRIMARY,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_16,
    color: COLOR.DARK,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    fontSize: 14,
    color: '#FFB800',
    marginRight: 4,
  },
  ratingText: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_12,
    color: COLOR.GREYVIOLET,
  },
  priceBadge: {
    backgroundColor: COLOR.GREEN,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  priceText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_18,
    color: 'white',
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  declineButton: {
    flex: 1,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#FF4444',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineButtonText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_14,
    color: '#FF4444',
  },
  acceptButton: {
    flex: 1,
    backgroundColor: COLOR.GREEN,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButtonText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_14,
    color: 'white',
  },
});

export default CustomerBiddingCard;
