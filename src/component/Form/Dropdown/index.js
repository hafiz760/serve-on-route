import { Fragment, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useFormikContext } from "formik";
import DropDownPicker from "react-native-dropdown-picker";
import AppText from "../AppText";
import ErrorMessage from "./ErrorMessage";
import colors from "../../config/colors";

const AppFormField = ({ name, label, items, labelStyles, width }) => {
  const { setFieldValue, values, errors, touched } = useFormikContext();
  const [open, setOpen] = useState(false);
  return (
    <Fragment>
      {label && <AppText style={labelStyles}>{label}</AppText>}
      <View style={styles.container}>
        <DropDownPicker
          open={open}
          setOpen={setOpen}
          value={values[name]}
          items={items}
          onSelectItem={(e) => setFieldValue("type", e.value)}
          style={styles.dropdownContainer}
        />
      </View>
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </Fragment>
  );
};
const styles = StyleSheet.create({
  container: {
    zIndex: 2,
    marginBottom: 15,
  },
  dropdownContainer: {
    backgroundColor: colors.light,
    borderColor: "#E5E5E5",
  },
});
export default AppFormField;