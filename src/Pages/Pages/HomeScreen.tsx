import { Button, StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, Dimensions, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import Pdf from 'react-native-pdf';
import storage from '@react-native-firebase/storage'

export default function HomeScreen({ navigation }) {


    
    const [genModalVisible, setGenModalVisible] = useState(false);
    const [cardioModalVisible, setCardioModalVisible] = useState(false);
    const [orthoModalVisible, setOrthoModalVisible] = useState(false);
    const [maxilloModalVisible, setMaxilloModalVisible] = useState(false);
    const [ophthalModalVisible, setOphthalModalVisible] = useState(false);
    const [entModalVisible, setEntModalVisible] = useState(false);

    const [pdfUrl, setPdfUrl] = useState(''); // 1 Store the PDF URL here

    // Fetch PDF URL when modal is opened
    useEffect(() => {
        if (genModalVisible) {
            storage()
                .ref('General Surgery/Gen surg Roaster.pdf')
                .getDownloadURL()
                .then((url) => {
                    setPdfUrl(url);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [genModalVisible]);

    //const pag = storage().ref('gs://rnlist-2d1a5.appspot.com/General Surgery/Gen surg Roaster.pdf').getDownloadURL();
       
       
    return (
        <View>
            <View style={styles.Heading}>
                <Text style={styles.Headingtext}>Welcome Dr. Rutsate</Text>
            </View>

            <View>
                <Text style={styles.headingText}>November Roaster</Text>
                <ScrollView horizontal={true}>
                    <View style={[styles.card, styles.cardElevated]}>
                        <TouchableOpacity onPress={() => setGenModalVisible(true)}>
                            <Text>General Surgery</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.card, styles.cardElevated]}>
                        <TouchableOpacity onPress={() => setCardioModalVisible(true)}>
                            <Text>Cardiothoracic Surgery</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.card, styles.cardElevated]}>
                        <TouchableOpacity onPress={() => setOrthoModalVisible(true)}>
                            <Text>Orthopedic Surgery</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.card, styles.cardElevated]}>
                        <TouchableOpacity onPress={() => setMaxilloModalVisible(true)}>
                            <Text>Maxillofacial Surgery</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.card, styles.cardElevated]}>
                        <TouchableOpacity onPress={() => setOphthalModalVisible(true)}>
                            <Text>Opthalmology</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.card, styles.cardElevated]}>
                        <TouchableOpacity onPress={() => setEntModalVisible(true)}>
                            <Text>Ear, Nose & Throat</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>

            <View style={styles.optionsBox}>
                <View style={styles.Options}>
                    <Button title="Post List" 
                    onPress={() => navigation.navigate('Selection')} />
                </View>
                <View style={styles.Options}>
                    <Button title="Update List"
                     onPress={() => navigation.navigate('Update')} />
                </View>
                <View style={styles.Options}>
                    <Button title="Check List" 
                    onPress={() => navigation.navigate('plist')}
                    />
                </View>
            </View>

            <Modal visible={genModalVisible} transparent={true} animationType="slide">
            <View style={styles.modalView}>
                <View style={styles.container}>
                    {pdfUrl ? ( // Render the Pdf component only if pdfUrl is available
                        <Pdf
                        trustAllCerts={false}
                            source={{ uri: pdfUrl, cache: true }} // Provide the resolved URL
                            onLoadComplete={(numberOfPages, filePath) => {
                                console.log(`Number of pages: ${numberOfPages}`);
                            }}
                            onPageChanged={(page, numberOfPages) => {
                                console.log(`Current page: ${page}`);
                            }}
                            onError={(error) => {
                                console.log(error);
                            }}
                            onPressLink={(uri) => {
                                console.log(`Link pressed: ${uri}`);
                            }}
                            style={styles.pdf}
                        />
                    ) : (
                        <View>
                            <Text>Loading PDF...</Text>
                        </View>
                    )}
                </View>
                <Button title="Close" onPress={() => setGenModalVisible(false)} />
            </View>
        </Modal>

            {/* Additional Modals */}
            <Modal visible={cardioModalVisible} transparent={true} animationType="slide">
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Cardiothoracic Surgery Details</Text>
                    <Button title="Close" onPress={() => setCardioModalVisible(false)} />
                </View>
            </Modal>

            <Modal visible={orthoModalVisible} transparent={true} animationType="slide">
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Orthopedic Surgery Details</Text>
                    <Button title="Close" onPress={() => setOrthoModalVisible(false)} />
                </View>
            </Modal>

            <Modal visible={maxilloModalVisible} transparent={true} animationType="slide">
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Maxillofacial Surgery Details</Text>
                    <Button title="Close" onPress={() => setMaxilloModalVisible(false)} />
                </View>
            </Modal>

            <Modal visible={ophthalModalVisible} transparent={true} animationType="slide">
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Ophthalmology Details</Text>
                    <Button title="Close" onPress={() => setOphthalModalVisible(false)} />
                </View>
            </Modal>

            <Modal visible={entModalVisible} transparent={true} animationType="slide">
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Ear, Nose & Throat Details</Text>
                    <Button title="Close" onPress={() => setEntModalVisible(false)} />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    optionsBox: {
        alignItems: 'center',
    },
    Options: {
        margin: 10,
        width: 200,
        borderRadius: 0,
    },
    Headingtext: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    Heading: {
        marginBottom: 30,
        marginTop: 20,
    },
    headingText: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingHorizontal: 18,
    },
    card: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        width: 100,
        height: 100,
        paddingHorizontal: 8,
        margin: 8,
    },
    cardElevated: {
        backgroundColor: '#CAD5E2',
        elevation: 5,
        shadowOffset: {
            width: 1,
            height: 1,
        },
        shadowColor: '#333',
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
        backgroundColor: 'white',
        padding: 35,
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    modalText: {
        fontSize: 18,
        marginBottom: 15,
        textAlign: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});
