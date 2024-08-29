import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

type SubmitFeedbackProps = {
  onSubmit: () => void; // Function to handle submit action
};

export default function SubmitFeedback({ onSubmit }: SubmitFeedbackProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onSubmit}>
       <Text style={styles.text}>Update Status</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
  },
})
