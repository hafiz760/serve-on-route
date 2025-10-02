import React, { useState } from 'react';
import { View } from 'react-native';
import { DarkStatusBar } from "../../../component/StatusBar";
import Header from "../../../component/Header";
import { Container, Text } from "../../../component/Basic";
import DropDownPicker from "react-native-dropdown-picker";
import styles from './styles';

const faqItems = [
    { label: "what if i need to cancel a booking?", value: "one" },
    { label: "is safe to use app?", value: "two" },
    { label: "how do i receive booking details?", value: "three" },
    { label: "how can i edit my profile information?", value: "four" },
    { label: "how to cancel my trip?", value: "five" },
    { label: "Other Questions?", value: "others" },
];

export default function Index() {
    const [itemsTypes, setItemsTypes] = useState(["one", "two", "three", "four", "five"]);
    const [openModels, setOpenModels] = useState([false, false, false, false, false]);

    const renderDropDown = (index) => (
        <DropDownPicker
            open={openModels[index]}
            items={faqItems}
            setOpen={(value) => setOpenModels((prev) => [...prev.slice(0, index), value, ...prev.slice(index + 1)])}
            value={itemsTypes[index]}
            onSelectItem={(e) => setItemsTypes((prev) => [...prev.slice(0, index), e.value, ...prev.slice(index + 1)])}
            // setItems={() => { }}
            style={styles.selectionBox}
        />
    );

    return (
        <Container>
            <DarkStatusBar />
            <Header leftType="back" title={"FAQs"} />
            <View style={styles.main}>
                {itemsTypes.map((_, index) => renderDropDown(index))}
            </View>
        </Container>
    );
}
