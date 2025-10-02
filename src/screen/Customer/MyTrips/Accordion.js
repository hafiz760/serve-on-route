import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import styles from "./styles";
import theme from "../../../theme/styles";

import { Icon } from "../../../component/Basic";
import { Button } from "../../../component/Form";
import { navigate } from "../../../navigations";

const Accordion = ({
  title,
  text,
  renderContent,
  onOpened,
  onClosed,
  expanded,
  trip,
}) => {
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (opened) {
      onOpened && onOpened();
    } else {
      onClosed && onClosed();
    }
  }, [opened]);

  const toggle = () => {
    setOpened(!opened);
  };

  const handleNavigation = () => {
    const [fromLatitude, fromLongitude] = trip?.from_location_cor?.split(",");
    const [toLatitude, toLongitude] = trip?.to_location_cor?.split(",");

    const data = {
      pickupCords: {
        latitude: +fromLatitude.trim(),
        longitude: +fromLongitude.trim(),
        locationName: trip?.from_location.replace(/^"(.*)"$/, "$1"),
      },
      droplocationCords: {
        latitude: +toLatitude.trim(),
        longitude: +toLongitude.trim(),
        locationName: trip?.to_location.replace(/^"(.*)"$/, "$1"),
      },
    };

    navigate("DrawerNav", {
      screen: "PublicHome",
      params: {
        mydata: data,
      },
    });
  };

  return (
    <View style={styles.accordion}>
      <Button disabled style={styles.accordionBtn} onPress={toggle}>
        <Text style={opened ? styles.accordionTitle : styles.accordionTitle}>
          {title}
        </Text>
        <View style={styles.accordionInfo}>
          <View style={styles.accordionItem}>
            {/* <Text
              style={
                opened
                  ? styles.accordionActiveText
                  : styles.accordionInactiveText
              }
            >
              {text}
            </Text> */}
          </View>
          <TouchableOpacity onPress={handleNavigation}>
            <Icon
              name="content-copy"
              type="MaterialCommunityIcons"
              style={[theme.SIZE_20, theme.DARKBLUE, { marginRight: 5 }]}
            />
          </TouchableOpacity>
          <Icon
            name={opened ? "keyboard-arrow-down" : "keyboard-arrow-right"}
            type="MaterialIcons"
            style={[theme.SIZE_20, theme.DARKBLUE]}
          />
        </View>
      </Button>
      {opened ? renderContent() : null}
    </View>
  );
};

export default Accordion;
