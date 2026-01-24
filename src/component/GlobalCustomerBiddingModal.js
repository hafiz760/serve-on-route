import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useSelector } from "react-redux";
import Modal from "react-native-modalbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import CustomerBiddingCard from "./CustomerBiddingCard";
import { BASE_URL, URL_V } from "../utilities/helper";
import { STORAGE_KEYS, SUCCESS_MESSAGES } from "../constant/appConstants";

/**
 * GlobalCustomerBiddingModal Component
 * Displays bidding interface for customers when drivers bid on their parcels
 * Only visible to users with customer/user role
 */
const GlobalCustomerBiddingModal = () => {
    const notiId = useSelector((state) => state.session.notiId);
    const { socket } = useSelector((state) => state.socket);
    const { user } = useSelector((state) => state.session);

    const isCustomer = user?.role?.includes("user");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [incomingBidNotifications, setIncomingBidNotifications] = useState([]);
    const modalRef = useRef();

    /**
     * Close modal and remove bid from notification list
     * @param {string} bidId - ID of the bid to remove
     */
    const closeModalByBidId = (bidId) => {
        if (incomingBidNotifications.length === 1) {
            setIsModalOpen(false);
        }
        setIncomingBidNotifications((previous) =>
            previous.filter((bid) => bid._id !== bidId)
        );
    };

    /**
     * Handle bid acceptance
     * @param {Object} bidData - Bid object
     */
    const handleAcceptBid = async (bidData) => {
        try {
            const userDataString = await AsyncStorage.getItem('response');
            if (!userDataString) {
                throw new Error("User data not found");
            }

            const userData = JSON.parse(userDataString);

            // Emit socket event to accept the bid
            socket.emit("accept_bid", {
                bid_id: bidData._id,
                parcel_id: bidData.parcel,
                customer_id: userData._id,
            });

            Alert.alert("Success", "Bid accepted successfully!");
            closeModalByBidId(bidData._id);

        } catch (error) {
            console.error("Error accepting bid:", error);
            Alert.alert("Error", "Failed to accept bid. Please try again.");
        }
    };

    /**
     * Handle bid decline
     * @param {Object} bidData - Bid object
     */
    const handleDeclineBid = async (bidData) => {
        try {
            const userDataString = await AsyncStorage.getItem('response');
            if (!userDataString) {
                throw new Error("User data not found");
            }

            const userData = JSON.parse(userDataString);

            // Emit socket event to decline the bid
            socket.emit("decline_bid", {
                bid_id: bidData._id,
                parcel_id: bidData.parcel,
                customer_id: userData._id,
            });

            Alert.alert("Success", "Bid declined.");
            closeModalByBidId(bidData._id);

        } catch (error) {
            console.error("Error declining bid:", error);
            Alert.alert("Error", "Failed to decline bid. Please try again.");
        }
    };

    /**
     * Fetch bid details by ID
     * @param {string} bidId - Bid ID
     */
    const fetchBidById = async (bidId) => {
        try {
            const userDataString = await AsyncStorage.getItem('response');
            if (!userDataString) {
                return;
            }

            const userData = JSON.parse(userDataString);

            const response = await axios.get(
                `${BASE_URL}${URL_V}bid/${bidId}?populate=bidder`,
                {
                    headers: {
                        Authorization: `Bearer ${userData.access_token}`,
                    },
                }
            );

            const bidAlreadyExists = incomingBidNotifications.some(
                (bid) => bid._id === response.data._id
            );

            if (!bidAlreadyExists && response.data) {
                setIncomingBidNotifications((prev) => [...prev, response.data]);
                setIsModalOpen(true);
            }
        } catch (error) {
            console.error("Error fetching bid:", error);
            // Silently fail - bid might not be available anymore
        }
    };

    /**
     * Fetch bids for a specific parcel
     * @param {string} parcelId - Parcel ID
     */
    const fetchBidsForParcel = async (parcelId) => {
        try {
            const userDataString = await AsyncStorage.getItem('response');
            if (!userDataString) {
                console.log("No user data found in AsyncStorage");
                return;
            }

            const userData = JSON.parse(userDataString);
            console.log("Fetching bids for parcel:", parcelId);

            // Try approach 1: Fetch all bids filtered by parcel
            try {
                const bidsResponse = await axios.get(
                    `${BASE_URL}${URL_V}bid?parcel=${parcelId}&populate=bidder&sort=-createdAt&limit=100`,
                    {
                        headers: {
                            Authorization: `Bearer ${userData.access_token}`,
                        },
                    }
                );

                console.log("Bids API response:", bidsResponse.data);

                // Check if response has docs array (pagination)
                const bidsData = bidsResponse.data.docs || bidsResponse.data;

                if (Array.isArray(bidsData) && bidsData.length > 0) {
                    // Get only new bids (not already in the list)
                    const newBids = bidsData.filter(
                        (bid) => !incomingBidNotifications.some((existing) => existing._id === bid._id)
                    );

                    if (newBids.length > 0) {
                        console.log("Found new bids:", newBids);
                        setIncomingBidNotifications((prev) => [...prev, ...newBids]);
                        setIsModalOpen(true);
                        return; // Success, exit function
                    }
                }

                console.log("No new bids found in bids API response");
            } catch (bidsError) {
                console.log("Approach 1 failed (bids endpoint):", bidsError.response?.status, bidsError.response?.data);

                // Try approach 2: Fetch parcel without populate
                try {
                    const parcelResponse = await axios.get(
                        `${BASE_URL}${URL_V}parcel/${parcelId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${userData.access_token}`,
                            },
                        }
                    );

                    console.log("Parcel API response (no populate):", parcelResponse.data);

                    // Check if parcel response has bid-related fields
                    if (parcelResponse.data) {
                        const parcelData = parcelResponse.data;
                        const allKeys = Object.keys(parcelData);
                        console.log("Parcel data keys (count):", allKeys.length);
                        console.log("All parcel keys:", allKeys.join(', '));

                        // Log the full parcel object as string to see everything
                        console.log("Full parcel data:", JSON.stringify(parcelData, null, 2));

                        // Check various possible field names for bids
                        const possibleBidFields = ['bids', 'biddings', 'bid', 'offers', 'Bids', 'Bid'];
                        let bidsField = null;

                        for (const field of possibleBidFields) {
                            if (parcelData[field]) {
                                bidsField = field;
                                console.log(`✅ Found bids in field: ${field}`, parcelData[field]);

                                // If we found bids, try to fetch detailed bid information
                                const bidsArray = Array.isArray(parcelData[field]) ? parcelData[field] : [parcelData[field]];

                                if (bidsArray.length > 0) {
                                    console.log("Processing bids:", bidsArray);

                                    // Fetch detailed bid information with bidder details
                                    const bidDetailsPromises = bidsArray.map(async (bid) => {
                                        try {
                                            const bidId = typeof bid === 'string' ? bid : bid._id;
                                            const bidDetailResponse = await axios.get(
                                                `${BASE_URL}${URL_V}bid/${bidId}?populate=bidder`,
                                                {
                                                    headers: {
                                                        Authorization: `Bearer ${userData.access_token}`,
                                                    },
                                                }
                                            );
                                            return bidDetailResponse.data;
                                        } catch (err) {
                                            console.error("Error fetching bid detail:", err);
                                            return null;
                                        }
                                    });

                                    const bidDetails = await Promise.all(bidDetailsPromises);
                                    const validBids = bidDetails.filter(bid => bid !== null);

                                    if (validBids.length > 0) {
                                        console.log("✅ Successfully fetched bid details:", validBids);
                                        setIncomingBidNotifications(validBids);
                                        setIsModalOpen(true);
                                        return; // Exit the function, modal will open
                                    }
                                }
                                break;
                            }
                        }

                        console.log("❌ No bids field found in parcel data");

                        // For now, show the fallback alert
                        Alert.alert(
                            "New Bid Received!",
                            "A driver has placed a bid on your parcel. Please check your trips to view and manage bids.",
                            [
                                {
                                    text: "View Trips",
                                    onPress: () => {
                                        // TODO: Navigate to trips screen
                                    },
                                },
                                {
                                    text: "OK",
                                    onPress: () => {},
                                },
                            ]
                        );
                    }
                } catch (parcelError) {
                    console.log("Approach 2 failed (parcel endpoint):", parcelError.response?.status, parcelError.response?.data);
                    throw parcelError; // Will be caught by outer catch
                }
            }

        } catch (error) {
            console.error("All approaches failed. Error:", error.response?.data || error.message);
            console.error("Error status:", error.response?.status);
            console.error("Error headers:", error.response?.headers);

            // Fallback: Show alert
            Alert.alert(
                "New Bid Received!",
                "A driver has placed a bid on your parcel. Please check your trips to view and manage bids.",
                [
                    {
                        text: "OK",
                        onPress: () => {},
                    },
                ]
            );
        }
    };

    /**
     * Extract parcel ID from notification and fetch bids
     */
    useEffect(() => {
        if (!isCustomer || !notiId || typeof notiId !== 'string') {
            return;
        }

        // Check if this is a bid_created notification
        if (notiId.includes("has been bid on your parcel")) {
            // Extract rider ID and parcel ID from notification
            const riderId = notiId.split("Rider with Id: ")[1]?.split(" has")[0];

            // Try to extract parcel ID from the notification body
            // The notification body contains the parcel object with _id
            const parcelIdMatch = notiId.match(/_id: new ObjectId\("([^"]+)"\)/);
            const parcelId = parcelIdMatch ? parcelIdMatch[1] : null;

            if (parcelId) {
                console.log("Customer received bid notification for parcel:", parcelId);
                fetchBidsForParcel(parcelId);
            } else {
                console.log("Could not extract parcel ID from notification");
                // Fallback: Show a simple alert
                Alert.alert(
                    "New Bid Received!",
                    "A driver has placed a bid on your parcel. Please check your trips to view and manage bids.",
                    [
                        {
                            text: "OK",
                            onPress: () => setIsModalOpen(false),
                        },
                    ]
                );
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [notiId, isCustomer]);

    // Don't render for non-customers
    if (!isCustomer) {
        return null;
    }

    return (
        <Modal
            ref={modalRef}
            isOpen={isModalOpen && incomingBidNotifications.length > 0}
            entry="top"
            swipeToClose={false}
            backdropPressToClose={false}
            style={styles.modal}
            backdropOpacity={0.5}
        >
            <View style={styles.container}>
                {incomingBidNotifications.map((bid) => (
                    <CustomerBiddingCard
                        key={bid?._id}
                        value={bid}
                        onAccept={handleAcceptBid}
                        onDecline={handleDeclineBid}
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

export default GlobalCustomerBiddingModal;
