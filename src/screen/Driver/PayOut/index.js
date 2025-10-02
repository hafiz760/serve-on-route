import React, { useState, useEffect } from "react";
import { View, ScrollView, Image ,Button} from "react-native";
import { Container, Content, Text, Icon } from "../../../component/Basic";
import {  Picker, TextInput } from "../../../component/Form";
import { connect } from "react-redux";
import styles from "./styles";
import Header from "../../../component/Header";
import { DarkStatusBar } from "../../../component/StatusBar";
 function PayOut() {
  const [loading, setLoading] = useState(true);
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const handleAddAccount = () => {
   
    console.log('Account Number:', accountNumber);
    console.log('Routing Number:', routingNumber);
    console.log('Account Holder Name:', accountHolderName);
  };
 

  

  

  return (
    <Container>
      <DarkStatusBar />
      <Header leftType="back" />
      <View style={styles.myTripHeader}>
        <Text style={styles.myTripHeaderTitle}>Pay Out</Text>
        <Text style={styles.myTripHeaderText}>
        </Text>
        </View>
        <View style={styles.outerView}>
        <Text style={styles.label}>Account Number</Text>
      <TextInput
        style={styles.input}
        value={accountNumber}
        onChangeText={text => setAccountNumber(text)}
        placeholder="Enter Account Number"
        placeholderTextColor="gray" 
      />

      <Text style={styles.label}>Routing Number</Text>
      <TextInput
        style={styles.input}
        value={routingNumber}
        onChangeText={text => setRoutingNumber(text)}
        placeholder="Enter Routing Number"
        placeholderTextColor="gray" 
      />

      <Text style={styles.label}>Account Holder Name</Text>
      <TextInput
        style={styles.input}
        value={accountHolderName}
        onChangeText={text => setAccountHolderName(text)}
        placeholder="Enter Account Holder Name"
        placeholderTextColor="gray" 
        
      />

      <Button title="Add Account" onPress={handleAddAccount} />
        </View>
    </Container>
  );
}

export default connect(({ session }) => ({ session }))(PayOut);
