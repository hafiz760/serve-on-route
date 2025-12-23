import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import Modal from "react-native-modalbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import BiddingCard from "../screen/Driver/Home/BiddingCard";
import { BASE_URL, URL_V } from "../utilities/helper";

const GlobalBiddingModal = () => {
    const notiId = useSelector((state) => state.session.notiId);
    const { socket } = useSelector((state) => state.socket);

    console.log("GlobalBiddingModal: mounted");
    console.log("GlobalBiddingModal: notiId", notiId);

    const [mainModel, setMainModel] = useState(false);
    const [incomingParcelNotifications, setIncomingParcelNotifications] = useState([]);
    const ModalNotification = useRef();

    const closeModelBaseOnId = (id) => {
        if (incomingParcelNotifications.length === 1) {
            setMainModel(false);
        }
        setIncomingParcelNotifications((previous) => {
            return previous.filter((value) => value.id !== id);
        });
    };

    const handleBid = async (bidValue, selectedParcel) => {
        try {
            var data = await AsyncStorage.getItem("response");
            var datas = JSON.parse(data);
            const requestPayload = {
                bid_amount: bidValue,
                parcel: selectedParcel._id,
                bidder: datas._id,
                description: "string",
            };

            setMainModel(false);
            socket.emit("bidding", requestPayload);
            alert("You successfully bid on this parcel");

            // Remove the bid parcel from the list
            closeModelBaseOnId(selectedParcel.id);

        } catch (error) {
            console.log("Bid Error", error);
        }
    };

    const getParcelById = async (parcelId) => {
        console.log("GlobalBiddingModal: getParcelById called with", parcelId);
        try {
            var data = await AsyncStorage.getItem("response");
            var datas = JSON.parse(data);

            const responseOne = await axios.get(
                `${BASE_URL}${URL_V}parcel/${parcelId}`,
                {
                    headers: {
                        Authorization: `Bearer ${datas.access_token}`,
                    },
                }
            );

            const exists = incomingParcelNotifications.some(
                (item) => item.id === responseOne.data.id
            );

            if (!exists) {
                setIncomingParcelNotifications((prev) => [...prev, responseOne.data]);
                // Only open modal if we have valid parcel data
                setMainModel(true);
            }
        } catch (err) {
            console.log("Error fetching parcel", err?.response);
        }
    };

    useEffect(() => {
        console.log("GlobalBiddingModal: useEffect triggered with notiId", notiId);
        if (notiId) {
            const id = notiId.split("Id: ")[1].split(" has")[0];
            console.log("GlobalBiddingModal: extracted id", id);
            getParcelById(id);
        }
    }, [notiId]);

    return (
        <Modal
            ref={ModalNotification}
            isOpen={mainModel && incomingParcelNotifications.length > 0}
            entry={"top"}
            swipeToClose={false}
            backdropPressToClose={false}
            style={styles.modal}
            backdropOpacity={0.5}
        >
            <View style={styles.container}>
                {incomingParcelNotifications.map((val) => (
                    <BiddingCard
                        val={val}
                        key={val?._id}
                        CloseModelBaseOnId={closeModelBaseOnId}
                        handleBid={handleBid}
                    />
                ))}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        height: 'auto',
        maxHeight: '60%',
        width: '85%',
        backgroundColor: 'transparent',
        marginTop: 10,
        marginHorizontal: 5,
    },
    container: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderRadius: 12,
        padding: 8,
        paddingRight: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    }
});

export default GlobalBiddingModal;
