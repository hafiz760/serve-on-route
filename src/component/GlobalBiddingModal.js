import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, DeviceEventEmitter } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { updateNotiId } from "../store/reducers/session";
import Modal from "react-native-modalbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomerBiddingCard from "./CustomerBiddingCard";
import { navigate } from "../navigations";

const GlobalBiddingModal = () => {
    const notiId = useSelector((state) => state.session.notiId);
    const { socket } = useSelector((state) => state.socket);
    const { user } = useSelector((state) => state.session);
    const isDriver = useSelector((state) => state.session.bool);

    console.log("GlobalBiddingModal: mounted", isDriver ? "Driver" : "Customer");

    const [mainModel, setMainModel] = useState(false);
    const [incomingParcelNotifications, setIncomingParcelNotifications] = useState([]);
    const [customerBids, setCustomerBids] = useState([]);
    const ModalNotification = useRef();

    const closeModelBaseOnId = (id) => {
        if (incomingParcelNotifications.length === 1) {
            setMainModel(false);
        }
        setIncomingParcelNotifications((previous) => previous.filter((value) => value.id !== id));
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
            DeviceEventEmitter.emit('refreshHome');
            closeModelBaseOnId(selectedParcel.id);
        } catch (error) {
            console.log("Bid Error", error);
        }
    };

    const handleAcceptCustomerBid = async (bid) => {
        try {
            var data = await AsyncStorage.getItem('response');
            var datas = JSON.parse(data);

            const formData = new FormData();
            formData.append('rider_id', bid.bidder._id);
            formData.append('status', 'in_progress');
            formData.append('pay_amount', bid?.bid_amount);

            await axios.patch(
                `${BASE_URL}${URL_V}parcel/${bid.parcel._id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${datas.access_token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                },
            );

            setCustomerBids(prev => prev.filter(b => b._id !== bid._id));
            if (customerBids.length === 1) setMainModel(false);
            
            alert('You have chosen your driver. He is on his way!');
            navigate('CustomerMyTrips');
        } catch (err) {
            console.log("Accept Bid Error", err);
        }
    };

    const handleDeclineCustomerBid = (bid) => {
        const filtered = customerBids.filter(b => b._id !== bid._id);
        setCustomerBids(filtered);
        if (filtered.length === 0) setMainModel(false);
    };

    const getParcelById = async (parcelId) => {
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

            const exists = incomingParcelNotifications.some((item) => item.id === responseOne.data.id);
            if (!exists) {
                setIncomingParcelNotifications((prev) => [...prev, responseOne.data]);
                setMainModel(true);
            }
        } catch (err) {
            console.log("GlobalBiddingModal: Error", err);
        }
    };

    const dispatch = useDispatch();

    useEffect(() => {
        if (notiId && user && isDriver) {
            const isOTPNotification = notiId?.toLowerCase().includes('otp') || notiId?.toLowerCase().includes('verification');
            if (isOTPNotification) {
                dispatch(updateNotiId(null));
                return;
            }

            if (notiId.includes("Id: ") && notiId.includes(" has")) {
                const parts = notiId.split("Id: ");
                if (parts.length > 1) {
                    const id = parts[1].split(" has")[0];
                    if (id) getParcelById(id);
                }
            }
            dispatch(updateNotiId(null));
        }
    }, [notiId, user, isDriver]);

    useEffect(() => {
        if (socket && user && !isDriver) {
            console.log("GlobalBiddingModal: Setting up customer socket listener");
            socket.on('bidding', (incomingBid) => {
                console.log("GlobalBiddingModal: Received bid for customer", incomingBid.bidder._id);
                setCustomerBids(prev => {
                    const exists = prev.find(b => b.bidder._id === incomingBid.bidder._id);
                    if (exists) {
                        return [incomingBid, ...prev.filter(b => b.bidder._id !== incomingBid.bidder._id)];
                    }
                    return [incomingBid, ...prev];
                });
                setMainModel(true);
            });

            return () => {
                socket.off('bidding');
            };
        }
    }, [socket, user, isDriver]);

    const hasContent = (isDriver && incomingParcelNotifications.length > 0) || (!isDriver && customerBids.length > 0);

    return (
        <Modal
            ref={ModalNotification}
            isOpen={mainModel && hasContent}
            entry={"top"}
            swipeToClose={false}
            backdropPressToClose={false}
            style={styles.modal}
            backdropOpacity={0.5}
        >
            <View style={styles.container}>
                {isDriver ? (
                    incomingParcelNotifications.map((val) => (
                        <BiddingCard
                            val={val}
                            key={val?._id}
                            CloseModelBaseOnId={closeModelBaseOnId}
                            handleBid={handleBid}
                        />
                    ))
                ) : (
                    customerBids.map((bid) => (
                        <CustomerBiddingCard
                            value={bid}
                            key={bid._id}
                            onAccept={handleAcceptCustomerBid}
                            onDecline={handleDeclineCustomerBid}
                        />
                    ))
                )}
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
