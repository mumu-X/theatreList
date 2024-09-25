import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';

export default function ElevatedCards() {
  return (
    <View>
      <Text style={styles.headingText}>November Roaster</Text>
      <ScrollView horizontal={true} style= {styles.container}>
        <View style={[styles.card, styles.cardElevated]}>
            <Text>
                Tap
            </Text>
        </View>
        <View style={[styles.card, styles.cardElevated]}>
            <Text>
                me
            </Text>
        </View>
        <View style={[styles.card, styles.cardElevated]}>
            <Text>
                To
            </Text>
        </View>
        <View style={[styles.card, styles.cardElevated]}>
            <Text>
                Scroll
            </Text>
        </View>
        <View style={[styles.card, styles.cardElevated]}>
            <Text>
                and
            </Text>
        </View>
        <View style={[styles.card, styles.cardElevated]}>
            <Text>
                find
            </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    headingText: {
        fontSize:24,
        fontWeight: 'bold',
        paddingHorizontal: 18},

        card:{
                flex : 1,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 4,
                width:100,
            height: 100,
            paddingHorizontal: 8,
            margin: 8,

        },
        cardElevated : {
            backgroundColor: '#CAD5E2',
            elevation: 5,
            shadowOffset: {
                width:1,
                height:1,
            },
            shadowColor: '#333',
        },
        container : {
            padding : 8,


        },


});
