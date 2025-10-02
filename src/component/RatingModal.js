import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import { COLOR, FAMILY, SIZE } from "../theme/typography";
import axios from "axios";
import { useSelector } from "react-redux";
import { showMessage } from "../helper/showAlert";
const RatingModal = ({ isVisible, onClose ,userID,riderID}) => {
    // console.log(userID,">>>>>>>",riderID);
    const { user } = useSelector((state) => state.session);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const handleRating = (value) => {
    setRating(value);
  };

  const handleReviewChange = (text) => {
    setReview(text);
  };

//   const handleSubmitRating = () => {
//     // Handle submitting the rating and review to your backend or local storage
//     console.log(`User rated ${rating} stars with review: ${review}`);
//     onClose();
//   };
  const handleSubmitRating = async () => {
    try {
      const resp = await axios.post(
        `https://api.serveonroute.com/v1/rating-review`,
        {
        rating: rating,
        review: review,
        rider: riderID,
        user: userID
      },
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        }
      );
      // console.log("resp",JSON.stringify(resp.data,null,2));
      showMessage("success", `Review successfully submited`);
    } catch (err) {
      // console.log("ERROR===>dd", );
      showMessage("error", "Review not submited");
    }
    onClose();
};

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} style={styles.modal}>
      <View style={styles.container}>
        <Text style={styles.title}>Rate This User</Text>
        {/* <StarRating
          disabled={false}
          maxStars={5}
          rating={rating}
          selectedStar={(rating) => handleRating(rating)}
          fullStarColor={COLOR.PRIMARY}
          starSize={40}
        /> */}
        <TextInput
          placeholder="Write a review..."
          style={styles.reviewInput}
          onChangeText={(text) => handleReviewChange(text)}
          value={review}
          multiline={true}
        />
        <TouchableOpacity onPress={handleSubmitRating} style={styles.submitButton}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    // padding: 30,
    paddingHorizontal:50,
    paddingVertical:20
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color:COLOR.PRIMARY
  },
  reviewInput: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    minHeight: 100, // Adjust the minimum height as needed
  },
  submitButton: {
    backgroundColor: COLOR.PRIMARY,
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  submitText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
export default RatingModal;
