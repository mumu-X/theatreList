import { StyleSheet, Text, TouchableOpacity, View, Switch } from 'react-native';
import React, { useState, useEffect } from 'react';

type PtProps = {
  name: string;
  surName: string;
  procedure: string;
  bednu: string;
  age: number;
  NotReady: () => void;
  Ready: () => void;
  isPatientReady: boolean;
  isPatientDone: boolean;
  onToggleChange: (value: boolean) => void;
};

export default function AnaeRender({
  name,
  surName,
  procedure,
  bednu,
  age,
  NotReady,
  Ready,
  isPatientReady,
  isPatientDone,
  onToggleChange,
}: PtProps) {
  const [showToggle, setShowToggle] = useState(isPatientReady || isPatientDone);

  useEffect(() => {
    // Update the visibility of the toggle based on patient readiness and done state
    if (isPatientReady || isPatientDone) {
      setShowToggle(true);
    } else {
      setShowToggle(false);
    }
  }, [isPatientReady, isPatientDone]);

  const handleReadyPress = () => {
    setShowToggle(true);
    Ready();
  };

  const handleToggleChange = (value: boolean) => {
    // Call the parent function to update the patient status based on toggle value
    onToggleChange(value);
  };

  return (
    <View style={styles.V}>
      {!showToggle && (
        <>
          <TouchableOpacity style={styles.NotReadyButton} onPress={NotReady}>
            <Text>Not Ready</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ReadyButton} onPress={handleReadyPress}>
            <Text>Patient Ready</Text>
          </TouchableOpacity>
        </>
      )}

      {showToggle && (
        <View style={styles.ToggleContainer}>
          <Text>{isPatientDone ? 'Done' : 'Not Yet Done'}</Text>
          <Switch
            value={isPatientDone}
            onValueChange={handleToggleChange}
            thumbColor={isPatientDone ? '#019031' : '#FF0000'}
          />
        </View>
      )}

      <View style={styles.V0}>
        <View style={styles.V1}>
          <View style={styles.V4}>
            <Text style={styles.V4Text}>Name: {name}</Text>
          </View>
          <View>
            <Text>Surname: {surName}</Text>
          </View>
        </View>
        <View>
          <Text style={styles.V2}>Procedure: {procedure}</Text>
        </View>
        <View style={styles.V2}>
          <Text>Age: {age}</Text>
        </View>
        <View>
          <Text style={styles.V2}>Bed No. {bednu}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  V: {
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 15,
  },
  V0: {
    marginTop: 5,
    marginBottom: 10,
    marginHorizontal: 8,
    borderColor: '#0A3D62',
    borderWidth: 2,
    borderRadius: 5,
    width: '80%',
  },
  V1: {
    flexDirection: 'row',
    margin: 5,
  },
  V2: {
    margin: 5,
    justifyContent: 'flex-start',
  },
  V4: {
    width: '50%',
  },
  V4Text: {
    textAlign: 'left',
  },
  NotReadyButton: {
    position: 'absolute',
    bottom: -15,
    left: 40,
    backgroundColor: '#FF0000',
    padding: 5,
  },
  ReadyButton: {
    position: 'absolute',
    bottom: -15,
    right: 40,
    backgroundColor: '#019031',
    padding: 5,
  },
  ToggleContainer: {
    position: 'absolute',
    bottom: -15,
    left: 40,
    right: 40,
    backgroundColor: '#D3D3D3',
    padding: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
