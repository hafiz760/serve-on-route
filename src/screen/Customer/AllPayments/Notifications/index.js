import React, {useEffect, useState} from 'react';
import {FlatList, View, Text, Button} from 'react-native';

import Item from './Item';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showMessage} from '../../../../helper/showAlert';
import {useSelector} from 'react-redux';
import {BASE_URL, URL_V} from '../../../../utilities/helper';
import ConfirmationModal from '../../../../component/ConfirmationModal';

export default function Notification({showLoading, loading}) {
  const [data, setdata] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const {user} = useSelector(state => state.session);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    var userData = await AsyncStorage.getItem('response');
    var datas = JSON.parse(userData);
    console.log(datas);

    const res = axios
      .get(`${BASE_URL}${URL_V}payment?user=${datas._id}`, {
        headers: {
          Authorization: `Bearer ${datas.access_token}`,
        },
      })
      .then(data => {
        console.log('res>>>', JSON.stringify(data.data, null, 2));
        setdata(data.data);
        showLoading(false);
      })
      .catch(err => {
        console.log(('error', err));
        showLoading(false);
      });
  };

  const renderItem = (val, index) => {
    return (
      <Item
        value={val.item}
        deletePaymentRecordById={deletePaymentRecordById}
      />
    );
  };

  const deletePaymentRecordById = paymentId => {
    setSelectedPaymentId(paymentId);
    setIsConfirmed(false);
    setIsModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    setIsConfirmed(true);
    setIsModalVisible(false);
  };

  const onModalHide = async () => {
    if (!isConfirmed || !selectedPaymentId) return;

    try {
      var userData = await AsyncStorage.getItem('response');
      var datas = JSON.parse(userData);
      const res = await axios.delete(
        `${BASE_URL}${URL_V}payment/${selectedPaymentId}`,
        {
          headers: {
            Authorization: `Bearer ${datas.access_token}`,
          },
        },
      );

      if (res.status === 200) {
        showMessage('success', 'Payment method removed successfully');
        const filteredPayments = data.filter(d => d._id !== selectedPaymentId);
        setdata(filteredPayments);
      }
      console.log('MY RESPONSE', res.status);
    } catch (err) {
      showMessage('error', 'Something went wrong!');
    } finally {
      setSelectedPaymentId(null);
      setIsConfirmed(false);
    }
  };

  if (!loading && data?.length === 0) {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 20,
        }}>
        <Text
          style={{
            fontSize: 18,
            color: '#000',
            fontWeight: 'bold',
          }}>
          No Payment Methods Found
        </Text>
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={data}
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
      />
      <ConfirmationModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConfirm={handleConfirmDelete}
        onModalHide={onModalHide}
        message="Are you sure you want to remove this payment method?"
      />
    </>
  );
}
