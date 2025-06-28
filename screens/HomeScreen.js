import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

export default function CreateBillScreen({ navigation }) {
  const [billName, setBillName] = useState('');
  const [participant, setParticipant] = useState('');
  const [participants, setParticipants] = useState([]);

  const addParticipant = () => {
    if (participant.trim()) {
      setParticipants([...participants, participant.trim()]);
      setParticipant('');
    }
  };

  const goToNext = () => {
    if (!billName || participants.length === 0) {
      alert('Please enter bill name and at least one participant');
      return;
    }

    
    navigation.navigate('AddItemsScreen', {
      billName,
      participants,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Bill</Text>
      <TextInput
        style={styles.input}
        placeholder="Bill name (e.g. Pizza Night)"
        value={billName}
        onChangeText={setBillName}
      />

      <TextInput
        style={styles.input}
        placeholder="Add participant (name or email)"
        value={participant}
        onChangeText={setParticipant}
      />
      <Button title="Add Participant" onPress={addParticipant} />

      <FlatList
        data={participants}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.participant}>{item}</Text>}
        ListHeaderComponent={<Text style={styles.listTitle}>Participants:</Text>}
      />

      <Button title="Continue to Add Items" onPress={goToNext} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#aaa',
    marginBottom: 15,
    padding: 8,
    fontSize: 16,
  },
  listTitle: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  participant: {
    fontSize: 16,
    paddingVertical: 4,
  },
});
