import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, DeviceEventEmitter } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { updateNotiId } from "../store/reducers/session";
import Modal from "react-native-modalbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import BiddingCard from "../screen/Driver/Home/BiddingCard";
import { BASE_URL, URL_V } from "../utilities/helper";

const GlobalBiddingModal = () => {
    const notiId = useSelector((state) => state.session.notiId);
    const { socket } = useSelector((state) => state.socket);
    const { user } = useSelector((state) => state.session);

    console.log("GlobalBiddingModal: mounted");
    console.log("GlobalBiddingModal: notiId", notiId);

    const [mainModel, setMainModel] = useState(false);
    const [incomingParcelNotifications, setIncomingParcelNotifications] = useState([]);
    const ModalNotification = useRef();

    const closeModelBaseOnId = (id) => {
        console.log("GlobalBiddingModal: closeModelBaseOnId called with id", id);
        console.log("GlobalBiddingModal: current notifications count", incomingParcelNotifications.length);
        if (incomingParcelNotifications.length === 1) {
            console.log("GlobalBiddingModal: closing modal (last notification)");
            setMainModel(false);
        }
        setIncomingParcelNotifications((previous) => {
            const filtered = previous.filter((value) => value.id !== id);
            console.log("GlobalBiddingModal: notifications after filter", filtered.length);
            return filtered;
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

            // Emit event to refresh Driver Home screen
            DeviceEventEmitter.emit('refreshHome');

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

            console.log("GlobalBiddingModal: parcel data received", responseOne.data);
            
            const exists = incomingParcelNotifications.some(
                (item) => item.id === responseOne.data.id
            );

            console.log("GlobalBiddingModal: parcel already exists?", exists);

            if (!exists) {
                console.log("GlobalBiddingModal: adding new parcel to notifications");
                setIncomingParcelNotifications((prev) => {
                    const updated = [...prev, responseOne.data];
                    console.log("GlobalBiddingModal: updated notifications count", updated.length);
                    return updated;
                });
                // Only open modal if we have valid parcel data
                console.log("GlobalBiddingModal: opening modal");
                setMainModel(true);
            } else {
                console.log("GlobalBiddingModal: parcel already in list, skipping");
            }
        } catch (err) {
            console.log("GlobalBiddingModal: Error fetching parcel", err?.response?.data || err?.message);
        }
    };

    const dispatch = useDispatch();

    useEffect(() => {
        console.log("=== GlobalBiddingModal: useEffect triggered ===");
        console.log("GlobalBiddingModal: notiId", notiId);
        console.log("GlobalBiddingModal: user", user ? `${user.first_name} (role: ${user.role})` : "null");

        if (notiId && user) {
            // Check if this is an OTP notification - if so, skip it for riders
            const isOTPNotification = notiId?.toLowerCase().includes('otp') || 
                                      notiId?.toLowerCase().includes('verification');
            const isRider = user?.role?.includes("rider");
            
            if (isOTPNotification && isRider) {
                console.log("GlobalBiddingModal: 🚫 Skipping OTP notification for rider");
                dispatch(updateNotiId(null));
                return;
            }
            
            // 1. Only process bidding logic for riders/drivers
            // 2. Only process if it follows the parcel notification format
            console.log("GlobalBiddingModal: isRider?", isRider);

            if (isRider && notiId.includes("Id: ") && notiId.includes(" has")) {
                console.log("GlobalBiddingModal: notiId format is valid for parcel notification");
                try {
                    const parts = notiId.split("Id: ");
                    console.log("GlobalBiddingModal: split parts", parts);
                    if (parts.length > 1) {
                        const id = parts[1].split(" has")[0];
                        if (id) {
                            console.log("GlobalBiddingModal: ✅ extracted parcel id:", id);
                            getParcelById(id);
                        } else {
                            console.log("GlobalBiddingModal: ❌ extracted id is empty");
                        }
                    } else {
                        console.log("GlobalBiddingModal: ❌ split failed, parts length:", parts.length);
                    }
                } catch (e) {
                    console.log("GlobalBiddingModal: ❌ Error parsing notiId", e);
                }
            } else {
                console.log("GlobalBiddingModal: ❌ Skipping - either not a rider or invalid notiId format");
                console.log("  - isRider:", isRider);
                console.log("  - contains 'Id: ':", notiId.includes("Id: "));
                console.log("  - contains ' has':", notiId.includes(" has"));
            }

            // Always clear notiId from store after processing 
            // This prevents loops and stops non-bidding notifications (like OTPs) from lingering
            console.log("GlobalBiddingModal: clearing notiId from Redux");
            dispatch(updateNotiId(null));
        } else {
            console.log("GlobalBiddingModal: ❌ Skipping - notiId or user is null");
        }
        console.log("=== GlobalBiddingModal: useEffect complete ===");
    }, [notiId, user]);

    console.log("GlobalBiddingModal: render - mainModel:", mainModel, "notifications count:", incomingParcelNotifications.length);
    console.log("GlobalBiddingModal: modal isOpen?", mainModel && incomingParcelNotifications.length > 0);

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
