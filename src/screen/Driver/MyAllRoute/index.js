import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, Image } from "react-native";
import { Container, Content, Text, Icon } from "../../../component/Basic";
import { Button, TextInput } from "../../../component/Form";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Modal from "react-native-modalbox";

import styles from "./styles";
import theme from "../../../theme/styles";
import { COLOR, FAMILY, SIZE } from "../../../theme/typography";
import Header from "../../../component/Header";
import { DarkStatusBar } from "../../../component/StatusBar";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useIsFocused } from "@react-navigation/native";
import AppSpinner from "../../../component/AppSpinner";
import { showMessage } from "../../../helper/showAlert";
// import {BASE_URL,URL_V} from "@env"
import { BASE_URL, URL_V } from "../../../utilities/helper";
import { navigate } from "../../../navigations";

export default function MyTrip() {
  const [tabSelected, setTabSelected] = useState("all");
  const [isDisabled, setIsDisabled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState();
  const [isToggleSuccess, setIsToggleSuccess] = useState(false);
  const isFocused = useIsFocused();

  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMenuItemId, setSelectedMenuItemId] = useState(null);
  useEffect(() => {
    getRoutes();
  }, [data.length, isToggleSuccess]);
  useEffect(() => {
    if (isFocused) {
      getRoutes();
    }
  }, [isFocused]);

  async function getRoutes() {
    var riderData = await AsyncStorage.getItem("response");
    var rider = JSON.parse(riderData);

    axios.get(`${BASE_URL}${URL_V}routes?rider=${rider._id}&page=1&limit=1234`, {
      headers: {
        Authorization: `Bearer ${rider.access_token}`,
      },
    })
      .then((data) => {
        console.log(
          "res get all route",
          JSON.stringify(data.data.docs, null, 2)
        );
        setData(data.data.docs);
        setLoading(false);
      })
      .catch((err) => {
        console.log(("error", err));
        setLoading(false);
      });
  }

  async function onDelete(id) {
    var riderData = await AsyncStorage.getItem("response");
    var rider = JSON.parse(riderData);
    const res =await axios
      .delete(
        `  ${BASE_URL}${URL_V}routes/${id}
        `,
        {
          headers: {
            Authorization: `Bearer ${rider.access_token}`,
          },
        }
      )
      .then((response) => {
        setData((pre) =>
          pre.filter((val) => {
            return val._id != id;
          })
        );
        showMessage("success", "Route Has Been Deleted Succefully!");

        // console.log("route deleted succfully", data);
      })
      .catch((err) => {
        console.log(("error", err));
        showMessage("error", "Error in  Deleted Routes!");
      });
  }

  async function handleToggleStatus(id, status) {
    console.log("Deleted is call", id);
    var riderData = await AsyncStorage.getItem("response");
    var rider = JSON.parse(riderData);
    let body = {
      status: !status,
    };
    console.log("body", body);
    axios
      .put(
        `  ${BASE_URL}${URL_V}routes/updateStatus${id}
        `,
        body,
        {
          headers: {
            Authorization: `Bearer ${rider.access_token}`,
          },
        }
      )
      .then((response) => {
        // const updatedData = data.map((item) => {
        //   if (item._id === id) {
        //     return { ...item, isActive: "true" };
        //   }
        //   return item;
        // });
        setIsToggleSuccess(!isToggleSuccess);
        showMessage("success", "Route Has Been Active Succefully!");
        //  setData(updatedData)
        // console.log("route deleted succfully", data);
      })
      .catch((err) => {
        console.log(("error", err));
        showMessage("error", "Error in  Active Routes!");
      });
  }

  function renderAll() {
    return (
      <View>
        <ScrollView>
          {data && data.length > 0 && data.filter((d) => d.isActive)?.length > 0 ? (
            data.map((val, index) => {
              if (val.isActive) {
                return (
                  <View
                    key={val._id}
                    style={{
                      backgroundColor: '#fff',
                      borderRadius: 14,
                      marginVertical: 10,
                      marginHorizontal: 8,
                      padding: 16,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 6,
                      elevation: 4,
                      position: 'relative',
                    }}
                  >
                    {/* 3 dots icon */}
                    <TouchableOpacity
                      style={{ position: 'absolute', top: 12, right: 12, zIndex: 10 }}
                      onPress={() => {
                        if (selectedMenuItemId === val._id) {
                          setSelectedMenuItemId(null);
                        } else {
                          setSelectedMenuItemId(val._id);
                        }
                      }}
                    >
                      <Icon
                        name="dots-vertical"
                        type="MaterialCommunityIcons"
                        style={{ fontSize: 22, color: '#888' }}
                      />
                    </TouchableOpacity>
                    {selectedMenuItemId === val._id && (
                      <View style={{
                        position: 'absolute',
                        top: 36,
                        right: 16,
                        backgroundColor: 'white',
                        borderRadius: 8,
                        elevation: 8,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.15,
                        shadowRadius: 8,
                        zIndex: 20,
                      }}>
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedMenuItemId(null);
                            onDelete(val._id);
                          }}
                          style={{ flexDirection: 'row', alignItems: 'center', padding: 12 }}
                        >
                          <Icon
                            name="delete"
                            type="MaterialCommunityIcons"
                            style={{ marginRight: 8, color: 'red', fontSize: 18 }}
                          />
                          <Text style={{ color: 'red', fontWeight: 'bold' }}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    {/* Route Info */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                      <Text style={{ fontWeight: 'bold', color: '#59499E', fontSize: 16 }}>{`ROUTE ${index + 1}`}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: '#888', fontSize: 13, marginBottom: 2 }}>From</Text>
                        <Text style={{ fontSize: 15, fontWeight: '600', color: '#222' }}>{val?.from || 'No Origin'}</Text>
                      </View>
                      <Icon name="arrow-right" type="MaterialCommunityIcons" style={{ fontSize: 22, color: '#59499E', marginHorizontal: 10 }} />
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: '#888', fontSize: 13, marginBottom: 2 }}>To</Text>
                        <Text style={{ fontSize: 15, fontWeight: '600', color: '#222' }}>{val?.to || 'No Destination'}</Text>
                      </View>
                    </View>
                    {/* Mark Button */}
                    <TouchableOpacity
                      onPress={() => handleToggleStatus(val._id, val.isActive)}
                      style={{
                        alignSelf: 'flex-end',
                        backgroundColor: '#F44336',
                        borderRadius: 20,
                        paddingVertical: 7,
                        paddingHorizontal: 18,
                        marginTop: 4,
                      }}
                    >
                      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 13 }}>Mark in-Active</Text>
                    </TouchableOpacity>
                  </View>
                );
              }
            })
          ) : (
            <View style={styles.noTripsFoundContainer}>
              <Text style={styles.noTripsFoundText}>No Active Routes Found</Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  function renderOpen() {
    return (
      <View>
        <ScrollView>
          {data && data.length > 0 && data.filter((d) => !d.isActive)?.length > 0 ? (
            data.map((val, index) => {
              if (!val.isActive) {
                return (
                  <View
                    key={val._id}
                    style={{
                      backgroundColor: '#fff',
                      borderRadius: 14,
                      marginVertical: 10,
                      marginHorizontal: 8,
                      padding: 16,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 6,
                      elevation: 4,
                      position: 'relative',
                    }}
                  >
                    {/* 3 dots icon */}
                    <TouchableOpacity
                      style={{ position: 'absolute', top: 12, right: 12, zIndex: 10 }}
                      onPress={() => {
                        if (selectedMenuItemId === val._id) {
                          setSelectedMenuItemId(null);
                        } else {
                          setSelectedMenuItemId(val._id);
                        }
                      }}
                    >
                      <Icon
                        name="dots-vertical"
                        type="MaterialCommunityIcons"
                        style={{ fontSize: 22, color: '#888' }}
                      />
                    </TouchableOpacity>
                    {selectedMenuItemId === val._id && (
                      <View style={{
                        position: 'absolute',
                        top: 36,
                        right: 16,
                        backgroundColor: 'white',
                        borderRadius: 8,
                        elevation: 8,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.15,
                        shadowRadius: 8,
                        zIndex: 20,
                      }}>
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedMenuItemId(null);
                            onDelete(val._id);
                          }}
                          style={{ flexDirection: 'row', alignItems: 'center', padding: 12 }}
                        >
                          <Icon
                            name="delete"
                            type="MaterialCommunityIcons"
                            style={{ marginRight: 8, color: 'red', fontSize: 18 }}
                          />
                          <Text style={{ color: 'red', fontWeight: 'bold' }}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    {/* Route Info */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                      <Text style={{ fontWeight: 'bold', color: '#59499E', fontSize: 16 }}>{`ROUTE ${index + 1}`}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: '#888', fontSize: 13, marginBottom: 2 }}>From</Text>
                        <Text style={{ fontSize: 15, fontWeight: '600', color: '#222' }}>{val?.from || 'No Origin'}</Text>
                      </View>
                      <Icon name="arrow-right" type="MaterialCommunityIcons" style={{ fontSize: 22, color: '#59499E', marginHorizontal: 10 }} />
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: '#888', fontSize: 13, marginBottom: 2 }}>To</Text>
                        <Text style={{ fontSize: 15, fontWeight: '600', color: '#222' }}>{val?.to || 'No Destination'}</Text>
                      </View>
                    </View>
                    {/* Mark Button */}
                    <TouchableOpacity
                      onPress={() => handleToggleStatus(val._id, val.isActive)}
                      style={{
                        alignSelf: 'flex-end',
                        backgroundColor: '#4CAF50',
                        borderRadius: 20,
                        paddingVertical: 7,
                        paddingHorizontal: 18,
                        marginTop: 4,
                      }}
                    >
                      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 13 }}>Mark Active</Text>
                    </TouchableOpacity>
                  </View>
                );
              }
            })
          ) : (
            <View style={styles.noTripsFoundContainer}>
              <Text style={styles.noTripsFoundText}>No In-Active Routes Found</Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <Container>
      <DarkStatusBar />
      <Header leftType="back" title="MY ROUTES" />


      <Content style={{ flex: 0.175, }}>
        <View style={styles.myTripTabItems}>
          <Button
            style={tabSelected === "all" ? styles.tabActive : styles.tabInactive}
            onPress={() => setTabSelected("all")}
          >
            <Text
              style={
                tabSelected === "all"
                  ? styles.tabActiveText
                  : styles.tabInactiveText
              }
            >
              ACTIVE
            </Text>
          </Button>
          <Button
            style={tabSelected === "open" ? styles.tabActive : styles.tabInactive}
            onPress={() => setTabSelected("open")}
          >
            <Text
              style={
                tabSelected === "open"
                  ? styles.tabActiveText
                  : styles.tabInactiveText
              }
            >
              IN-ACTIVE
            </Text>
          </Button>
        </View>
      </Content>


      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <AppSpinner color={COLOR.PRIMARY} size="large" />
        </View>
      ) : (
        <Content contentContainerStyle={theme.layoutDf}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.myTripContainer}>
              {tabSelected === "all" ? renderAll() : renderOpen()}
            </View>
          </ScrollView>
          <View style={styles.myTripHeader}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Button
                style={[styles.tabActive1]}
                onPress={() => navigate("DriverAddRoutes")}
              >
                <Text style={styles.tabActiveText}>ADD</Text>
              </Button>
            </View>
          </View>
        </Content>
      )}

      {/* <Modal isOpen={true} position={"center"}>
        <Text>muneeb</Text>
      </Modal> */}

      <Modal
        position={"center"}
        isOpen={isOpen}
        onClosed={() => setIsOpen(false)}
        isDisabled={isDisabled}
        style={styles.modalRating}
      >
        <View style={styles.modalRatingContainer}>
          <Button style={styles.closeSortDesc}>
            <Icon
              name="close"
              type="MaterialIcons"
              style={[theme.SIZE_20, theme.DARKVIOLET]}
            />
          </Button>
          <View style={{ height: 300, width: "100%" }}>
            <ScrollView>
              <View style={styles.reciver}>
                <Text>What is your Name</Text>
              </View>

              <View style={styles.sender}>
                <Text>My Name is Aex</Text>
              </View>
            </ScrollView>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TextInput
              placeholder="Type Here"
              placeholderTextColor="rgba(0,0,0,0.7)"
              style={styles.formInput3}
            />
            <Icon
              name="send"
              type="FontAwesome"
              style={[theme.SIZE_30, theme.DARKVIOLET]}
            />
          </View>
        </View>
      </Modal>
    </Container>
  );
}
