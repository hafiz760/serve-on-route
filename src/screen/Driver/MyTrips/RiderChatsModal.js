import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text, Icon } from '../../../component/Basic';
import { Button, TextInput } from '../../../component/Form';
import Modal from 'react-native-modalbox';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import styles from './styles';
import theme from '../../../theme/styles';
// import { BASE_URL, URL_V } from "@env";
import { BASE_URL, URL_V } from '../../../utilities/helper';
import AppSpinner from '../../../component/AppSpinner';
import { COLOR } from '../../../theme/typography';

const RiderChatsModal = ({ setSelectedParcel, selectedParcel }) => {
  const [currentLoggedInUserDetails, setCurrentLoggedInUserDetails] =
    useState(null);
  const [text, setText] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { socket } = useSelector(state => state.socket);
  const listRef = useRef(null);

  const getConversationId = async userInfo => {
    setIsLoading(true);
    const selectedMemberId =
      userInfo._id.toString() === selectedParcel.customer_id?._id.toString()
        ? selectedParcel.rider_id
        : selectedParcel.customer_id?._id;

    try {
      const responseOne = await axios.get(
        `${BASE_URL}${URL_V}chat/conversation?parcel=${selectedParcel?._id}`,
        {
          headers: {
            authorization: `Bearer ${userInfo?.token}`,
          },
        },
      );

      if (responseOne.status === 200) {
        setConversationId(responseOne?.data?._id);
        const responseTwo = await getChatsOfConversation(
          responseOne.data._id,
          userInfo,
        );
        setMessages(responseTwo?.data?.docs || []);
      }
    } catch (err) {
      console.log('ERROR IN GET CONVERSATION ID', err.response.data);
    } finally {
      setIsLoading(false);
    }
  };

  const getChatsOfConversation = async (convoId, userInfo) => {
    console.log('COVERSATION ID:', convoId);
    try {
      const response = await axios.get(
        `${BASE_URL}${URL_V}chat?conversationId=${convoId}&page=1&limit=200&sort=createdAt-1`,
        {
          headers: {
            authorization: `Bearer ${userInfo?.token}`,
          },
        },
      );

      return response;
    } catch (err) {
      console.log('ERROR FETCHING CHATS OF CONVERSATION ID', err.response.data);
    }
  };

  const sendMessage = async () => {
    console.log('sendMessage called');
    const selectedMemberId =
      currentLoggedInUserDetails._id.toString() ===
        selectedParcel.customer_id?._id.toString()
        ? selectedParcel.rider_id
        : selectedParcel.customer_id
    console.log('selectedMemberId', selectedMemberId);
    let sendMsg = {
      to: selectedMemberId,
      message: text,
    };

    if (conversationId) {
      sendMsg.conversationId = conversationId;
      console.log('conversation id', conversationId);
    }

    if (text.length > 0) {
      if (messages.length > 0 && !conversationId) {
        console.log('IN NESTED IF====>', currentLoggedInUserDetails);
        const convoResp = await axios.get(
          `${BASE_URL}${URL_V}chat/conversation?member=${selectedMemberId}`,
          {
            headers: {
              authorization: `Bearer ${currentLoggedInUserDetails?.token}`,
            },
          },
        );

        sendMsg.conversationId = convoResp.data._id;
        setConversationId(convoResp.data._id);

        socket.emit('send_message', sendMsg);
        sendMsg._id = Math.random();
        sendMsg.sender = currentLoggedInUserDetails?._id;
        setMessages(prevMessages => [...prevMessages, sendMsg]);
        setText('');
        console.log('if chala');
      } else {
        sendMsg.parcel = selectedParcel._id;
        socket.emit('send_message', sendMsg);
        sendMsg._id = Math.random();
        sendMsg.sender = currentLoggedInUserDetails?._id;
        setMessages(prevMessages => [...prevMessages, sendMsg]);
        setText('');
        console.log('else chala', currentLoggedInUserDetails?._id);
      }
    }
  };

  const getCurrentLoggedInUserDetails = async () => {
    try {
      let data = await AsyncStorage.getItem('response');
      let datas = JSON.parse(data);

      console.log('CURRENT OFF DATA===>', datas);

      const userDetails = {
        _id: datas._id,
        token: datas.access_token,
      };

      setCurrentLoggedInUserDetails(userDetails);
      return userDetails;
    } catch (err) {
      return false;
    }
  };

  const intializeChatFunctionality = async () => {
    try {
      const isUserDetailsFetchedFromAsyncStorage =
        await getCurrentLoggedInUserDetails();

      console.log('MY RESULT===>', isUserDetailsFetchedFromAsyncStorage);
      if (isUserDetailsFetchedFromAsyncStorage) {
        getConversationId(isUserDetailsFetchedFromAsyncStorage);
      }
    } catch (err) {
      console.log('ERROR IN INTIALIZING CHAT FUNCTIONALITY', err.message);
    }
  };

  useEffect(() => {
    intializeChatFunctionality();

    socket.on('receive_message', incomingMsg => {
      console.log('NEW MESS for driver', incomingMsg);
      setMessages(prevMessages => [...prevMessages, incomingMsg]);
    });
  }, []);

  return (
    <Modal
      position={'center'}
      isOpen={Boolean(selectedParcel)}
      onClosed={() => setSelectedParcel(null)}
      style={styles.modalRating}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <View style={styles.modalRatingContainer}>
          <Button
            onPress={() => setSelectedParcel(null)}
            style={styles.closeSortDesc}>
            <Icon
              name="close"
              type="MaterialIcons"
              style={[theme.SIZE_20, theme.DARKVIOLET]}
            />
          </Button>
          <View style={{ flex: 1, width: '100%' }}>
            {isLoading ? (
              <View style={styles.loaderContainerStyles}>
                <AppSpinner size="large" color={COLOR.PRIMARY} />
              </View>
            ) : messages && messages.length > 0 ? (
              <FlatList
                data={messages}
                keyExtractor={message => message._id.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                  const isSender =
                    item?.sender?.toString() ===
                    currentLoggedInUserDetails?._id?.toString();

                  return (
                    <View
                      style={[
                        styles.wrapimg,
                        { justifyContent: isSender ? 'flex-end' : 'flex-start' },
                      ]}>
                      {!isSender && (
                        <View style={styles.reciverPic}>
                          <Image
                            source={
                              selectedParcel?.customer_id?.avatar
                                ? { uri: selectedParcel?.customer_id?.avatar }
                                : require('../../../assets/images/dummyProfile.jpg')
                            }
                            style={styles.profileImg}
                          />
                        </View>
                      )}

                      <View style={isSender ? styles.sender : styles.reciver}>
                        <Text
                          style={
                            isSender ? styles.chatTextSender : styles.chatText
                          }>
                          {item.message}
                        </Text>
                      </View>

                      {isSender && (
                        <View style={styles.senderPic}>
                          <Image
                            source={
                              selectedParcel?.rider_id?.avatar
                                ? { uri: selectedParcel?.rider_id?.avatar }
                                : require('../../../assets/images/dummyProfile.jpg')
                            }
                            style={styles.profileImg}
                          />
                        </View>
                      )}
                    </View>
                  );
                }}
                ref={listRef}
                onLayout={() => listRef?.current?.scrollToEnd({ animated: true })}
                onContentSizeChange={() => {
                  if (messages.length) {
                    listRef?.current?.scrollToEnd({ animated: true });
                  }
                }}
              />
            ) : (
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ color: '#999' }}>No Messages Found</Text>
              </View>
            )}
          </View>
          <View style={styles.chatInputContainer}>
            <TextInput
              placeholder="Type Here..."
              placeholderTextColor="rgba(0,0,0,0.4)"
              style={styles.chatInput}
              defaultValue={text}
              onChangeText={e => setText(e)}
            />
            <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
              <Icon
                name="send"
                type="FontAwesome"
                style={[theme.SIZE_25, theme.DARKVIOLET]}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default RiderChatsModal;