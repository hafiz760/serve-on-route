import React, { useEffect, useState, useRef } from "react";
import { View, Image, TouchableOpacity, FlatList } from "react-native";
import { Text, Icon } from "../../../component/Basic";
import { Button, TextInput } from "../../../component/Form";
import Modal from "react-native-modalbox";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import styles from "./styles";
import theme from "../../../theme/styles";
// import { BASE_URL, URL_V } from "@env";
import { BASE_URL, URL_V } from "../../../utilities/helper";
const RiderChatsModal = ({ setSelectedParcel, selectedParcel }) => {
  const [currentLoggedInUserDetails, setCurrentLoggedInUserDetails] =
    useState(null);
  const [text, setText] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const { socket } = useSelector((state) => state.socket);
  const listRef = useRef(null);

  const getConversationId = async (userInfo) => {
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
        }
      );

      // console.log("resp", responseOne.data);

      if (responseOne.status === 200) {
        setConversationId(responseOne?.data?._id);
        const responseTwo = await getChatsOfConversation(
          responseOne.data._id,
          userInfo
        );
        setMessages(responseTwo?.data?.docs || []);
      }
    } catch (err) {
      console.log("ERROR IN GET CONVERSATION ID", err.response.data);
    }
  };

  const getChatsOfConversation = async (convoId, userInfo) => {
    console.log("COVERSATION ID:", convoId);
    try {
      const response = await axios.get(
        `${BASE_URL}${URL_V}chat?conversationId=${convoId}&page=1&limit=200&sort=createdAt-1`,
        {
          headers: {
            authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );

      return response;
    } catch (err) {
      console.log("ERROR FETCHING CHATS OF CONVERSATION ID", err.response.data);
    }
  };

  const sendMessage = async () => {
    console.log("sendMessage called");
    const selectedMemberId =
      currentLoggedInUserDetails._id.toString() ===
      selectedParcel.customer_id?._id.toString()
        ? selectedParcel.rider_id
        : selectedParcel.customer_id?._id;
    console.log("selectedMemberId", selectedMemberId);
    let sendMsg = {
      to: selectedMemberId,
      message: text,
    };

    if (messages?.length !== 0) {
      sendMsg.conversationId = conversationId;
      console.log("conversation id", conversationId);
    }

    if (text.length > 0) {
      if (messages.length > 0 && !conversationId) {
        console.log("IN NESTED IF====>", currentLoggedInUserDetails);
        const convoResp = await axios.get(
          `${BASE_URL}${URL_V}chat/conversation?member=${selectedMemberId}`,
          {
            headers: {
              authorization: `Bearer ${currentLoggedInUserDetails?.token}`,
            },
          }
        );

        sendMsg.conversationId = convoResp.data._id;
        setConversationId(convoResp.data._id);

        socket.emit("send_message", sendMsg);
        sendMsg._id = Math.random();
        sendMsg.sender = currentLoggedInUserDetails?._id;
        setMessages((prevMessages) => [...prevMessages, sendMsg]);
        setText("");
        console.log("if chala");
      } else {
        sendMsg.parcel = selectedParcel._id;
        socket.emit("send_message", sendMsg);
        sendMsg._id = Math.random();
        sendMsg.sender = currentLoggedInUserDetails?._id;
        setMessages((prevMessages) => [...prevMessages, sendMsg]);
        setText("");
        console.log("else chala", currentLoggedInUserDetails?._id);
      }
    }
  };

  const getCurrentLoggedInUserDetails = async () => {
    try {
      let data = await AsyncStorage.getItem("response");
      let datas = JSON.parse(data);

      console.log("CURRENT OFF DATA===>", datas);

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

      console.log("MY RESULT===>", isUserDetailsFetchedFromAsyncStorage);
      if (isUserDetailsFetchedFromAsyncStorage) {
        getConversationId(isUserDetailsFetchedFromAsyncStorage);
      }
      // console.log("is user detail",isUserDetailsFetchedFromAsyncStorage)
    } catch (err) {
      console.log("ERROR IN INTIALIZING CHAT FUNCTIONALITY", err.message);
    }
  };

  useEffect(() => {
    intializeChatFunctionality();

    socket.on("receive_message", (incomingMsg) => {
      console.log("NEW MESS for driver", incomingMsg);
      setMessages((prevMessages) => [...prevMessages, incomingMsg]);
    });
  }, []);
  // intializeChatFunctionality, socket
  // useEffect(() => {
  //   intializeChatFunctionality();

  //   const receiveMessageHandler = (incomingMsg) => {
  //     console.log("NEW MESS for customer", incomingMsg);
  //     setMessages((prevMessages) => [...prevMessages, incomingMsg]);
  //   };

  //   const check = socket.on("receive_message", receiveMessageHandler);
  //   console.log("check socket is working or not", check);
  //   return () => {
  //     socket.off("receive_message", receiveMessageHandler);
  //   };
  // }, []);

  return (
    <Modal
      position={"center"}
      isOpen={Boolean(selectedParcel)}
      onClosed={() => setSelectedParcel(null)}
      style={styles.modalRating}
    >
      <View style={styles.modalRatingContainer}>
        <Button
          onPress={() => setSelectedParcel(null)}
          style={styles.closeSortDesc}
        >
          <Icon
            name="close"
            type="MaterialIcons"
            style={[theme.SIZE_20, theme.DARKVIOLET]}
          />
        </Button>
        <View style={{ height: 300, width: "100%" }}>
          {messages && messages.length > 0 ? (
            <FlatList
              data={messages}
              keyExtractor={(message) => message._id.toString()}
              renderItem={({ item, index, seperators }) => {
                if (
                  item?.sender?.toString() ===
                  currentLoggedInUserDetails?._id?.toString()
                ) {
                  return (
                    <View style={styles.wrapimg}>
                      <View style={styles.reciverPic}>
                        <Image
                          source={{
                            uri: "https://cdn.pixabay.com/photo/2016/01/10/22/07/beauty-1132617__340.jpg",
                          }}
                          style={styles.profileImg}
                        />
                      </View>
                      <View style={styles.reciver}>
                        <Text style={styles.chatText}>{item.message}</Text>
                      </View>
                    </View>
                  );
                } else {
                  return (
                    <View style={styles.wrapimg}>
                      <View style={styles.sender}>
                        <Text style={styles.chatText}>{item.message}</Text>
                      </View>
                      <View style={styles.senderPic}>
                        <Image
                          source={{
                            uri: "https://cdn.pixabay.com/photo/2016/01/10/22/07/beauty-1132617__340.jpg",
                          }}
                          style={styles.profileImg}
                        />
                      </View>
                    </View>
                  );
                }
              }}
              ref={listRef}
              onLayout={() => listRef?.current.scrollToEnd({ animated: true })}
              onContentSizeChange={() => {
                if (messages.length) {
                  listRef?.current?.scrollToEnd({ animated: true });
                }
              }}
            />
          ) : (
            <Text>No Messages Found</Text>
          )}
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TextInput
            placeholder="Type Here"
            placeholderTextColor="rgba(0,0,0,0.7)"
            style={styles.formInput3}
            defaultValue={text}
            onChangeText={(e) => setText(e)}
          />
          <TouchableOpacity onPress={sendMessage}>
            <Icon
              name="send"
              type="FontAwesome"
              style={[theme.SIZE_30, theme.DARKVIOLET]}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default RiderChatsModal;
