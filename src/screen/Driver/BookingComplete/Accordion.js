import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

import styles from "./styles";
import theme from "../../../theme/styles";

import { Icon } from "../../../component/Basic";
import { Button } from "../../../component/Form";

const Accordion = ({ title, renderContent, onOpened, onClosed, expanded }) => {
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

  return (
    <View style={styles.accordion}>
      <Button disabled style={styles.accordionBtn} onPress={toggle}>
        <Text style={opened ? styles.accordionTitle : styles.accordionTitle}>
          {title}
        </Text>
        <Icon
          name={opened ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          type="MaterialIcons"
          style={[theme.SIZE_20, theme.DARKBLUE]}
        />
      </Button>
      {opened ? renderContent() : null}
    </View>
  );
};

export default Accordion;
