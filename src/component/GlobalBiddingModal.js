import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Modal from "react-native-modalbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import BiddingCard from "../screen/Driver/Home/BiddingCard";
import { BASE_URL, URL_V } from "../utilities/helper";
import { STORAGE_KEYS, SUCCESS_MESSAGES } from "../constant/appConstants";
import { updateNotiId } from "../store/reducers/session";

/**
 * GlobalBiddingModal Component
 * Displays bidding interface for drivers when new parcel notifications arrive
 * Only visible to users with driver role
 */
const GlobalBiddingModal = () => {
    const notiId = useSelector((state) => state.session.notiId);
    const { socket } = useSelector((state) => state.socket);
    const { user } = useSelector((state) => state.session);
    const dispatch = useDispatch();

    const isDriver = user?.role?.includes("rider") || user?.role?.includes("driver");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [incomingParcelNotifications, setIncomingParcelNotifications] = useState([]);
    const modalRef = useRef();

    /**
     * Close modal and remove parcel from notification list
     * @param {string} parcelId - ID of the parcel to remove
     */
    const closeModalByParcelId = (parcelId) => {
        if (incomingParcelNotifications.length === 1) {
            setIsModalOpen(false);
        }
        setIncomingParcelNotifications((previous) =>
            previous.filter((parcel) => parcel.id !== parcelId)
        );
    };

    /**
     * Handle bid submission
     * @param {number} bidValue - Bid amount
     * @param {Object} selectedParcel - Parcel object
     */
    const handleBid = async (bidValue, selectedParcel) => {
        try {
            const userDataString = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
            if (!userDataString) {
                throw new Error("User data not found");
            }

            const userData = JSON.parse(userDataString);
            const requestPayload = {
                bid_amount: bidValue,
                parcel: selectedParcel._id,
                bidder: userData._id,
                description: "Bid placed via GlobalBiddingModal",
            };

            setIsModalOpen(false);
            socket.emit("bidding", requestPayload);

            Alert.alert("Success", SUCCESS_MESSAGES.BID_PLACED);
            closeModalByParcelId(selectedParcel.id);

        } catch (error) {
            Alert.alert("Error", "Failed to place bid. Please try again.");
        }
    };

    /**
     * Fetch parcel details by ID
     * @param {string} parcelId - Parcel ID
     */
    const fetchParcelById = async (parcelId) => {
        try {
            const userDataString = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
            if (!userDataString) {
                return;
            }

            const userData = JSON.parse(userDataString);

            const response = await axios.get(
                `${BASE_URL}${URL_V}parcel/${parcelId}`,
                {
                    headers: {
                        Authorization: `Bearer ${userData.access_token}`,
                    },
                }
            );

            const parcelAlreadyExists = incomingParcelNotifications.some(
                (parcel) => parcel.id === response.data.id
            );

            if (!parcelAlreadyExists && response.data) {
                setIncomingParcelNotifications((prev) => [...prev, response.data]);
                setIsModalOpen(true);
            }
        } catch (error) {
            // Silently fail - parcel might not be available anymore
        }
    };

    /**
     * Extract parcel ID from notification and fetch details
     */
    useEffect(() => {
        if (!isDriver || !notiId || typeof notiId !== 'string') {
            console.log('DEBUG GlobalBiddingModal: Skipping -', {isDriver, notiId: notiId?.substring(0, 50)});
            return;
        }

        console.log('DEBUG GlobalBiddingModal: Processing notification:', notiId);
        const parcelId = notiId.split("Id: ")[1]?.split(" has")[0];
        console.log('DEBUG GlobalBiddingModal: Extracted parcelId:', parcelId);
        
        if (parcelId) {
            // Clear notiId so it doesn't re-trigger on refresh
            dispatch(updateNotiId(null));
            fetchParcelById(parcelId);
        } else {
            console.log('DEBUG GlobalBiddingModal: Could not extract parcel ID from notification');
        }
    }, [notiId, isDriver, dispatch, fetchParcelById]);

    // Don't render for non-drivers
    if (!isDriver) {
        return null;
    }

    return (
        <Modal
            ref={modalRef}
            isOpen={isModalOpen && incomingParcelNotifications.length > 0}
            entry="top"
            swipeToClose={false}
            backdropPressToClose={false}
            style={styles.modal}
            backdropOpacity={0.5}
        >
            <View style={styles.container}>
                {incomingParcelNotifications.map((parcel) => (
                    <BiddingCard
                        val={parcel}
                        key={parcel?._id}
                        CloseModelBaseOnId={closeModalByParcelId}
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
