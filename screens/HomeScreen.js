import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import { API_BASE } from '../apiConfig';

export default function CreateBillScreen({ navigation }) {
  const [billName, setBillName] = useState('');
  const [participant, setParticipant] = useState('');
  const [participants, setParticipants] = useState([]);
  const [userEmail, setUserEmail] = useState('');

 useEffect(() => {
  const fetchUser = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.warn('No user is logged in');
        return;
      }

      const token = await user.getIdToken();
      const res = await axios.get(`${API_BASE}/user-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserEmail(res.data.email);
      console.log('Logged in as:', res.data.email);
    } catch (err) {
      console.error('Error fetching user profile:', err.message);
    }
  };

  fetchUser();
}, []);

  const addParticipant = () => {
    if (participant.trim()) {
      setParticipants([...participants, participant.trim()]);
      setParticipant('');
    }
  };

  const removeParticipant = (indexToRemove) => {
    setParticipants(participants.filter((_, index) => index !== indexToRemove));
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
    <ImageBackground
      source={require('../assets/images/background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Create New Bill</Text>

        {userEmail && (
          <Text style={{ color: '#555', textAlign: 'center', marginBottom: 10 }}>
            Logged in as: {userEmail}
          </Text>
        )}

        <TextInput
          style={styles.input}
          placeholder="Bill name (e.g. Pizza Night)"
          placeholderTextColor="#ccc"
          value={billName}
          onChangeText={setBillName}
        />

        <TextInput
          style={styles.input}
          placeholder="Add participant (name or email)"
          placeholderTextColor="#ccc"
          value={participant}
          onChangeText={setParticipant}
        />

        <TouchableOpacity style={styles.addBtn} onPress={addParticipant}>
          <Text style={styles.btnText}>Add Participant</Text>
        </TouchableOpacity>

        <Text style={styles.listTitle}>Participants:</Text>

        <FlatList
          data={participants}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.participantRow}>
              <Text style={styles.participant}>{item}</Text>
              <TouchableOpacity onPress={() => removeParticipant(index)}>
                <Text style={styles.removeBtn}>❌</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        <TouchableOpacity style={styles.continueBtn} onPress={goToNext}>
          <Text style={styles.btnText}>Continue to Add Items</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    padding: 25,
    backgroundColor: 'rgb(255, 255, 255)', // רקע כהה שקוף
  },
  title: {
    fontSize: 26,
    marginBottom: 20,
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#000',
  },
  addBtn: {
    backgroundColor: '#00C896',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  continueBtn: {
    backgroundColor: '#FF6B6B',
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  btnText: {
    color: '#000',
    fontWeight: 'bold',
  },
  listTitle: {
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
    fontSize: 16,
  },
  participantRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#aaa',
  },
  participant: {
    fontSize: 16,
    color: '#000',
  },
  removeBtn: {
    fontSize: 18,
    color: '#FF6B6B',
    paddingHorizontal: 8,
  },
});
