import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

export default function AddItemsScreen({ route, navigation }) {
  const { billName, participants } = route.params;
  const [receiptImage, setReceiptImage] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});

  const apiKey = '2rqKmKZfOihs863X+zoLHQ==gl1pnJH4omROsJmT';

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      base64: false,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      setReceiptImage(imageUri);
      await extractItemsFromImage(imageUri);
    }
  };

  const extractItemsFromImage = async (uri) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const response = await fetch('https://api.api-ninjas.com/v1/imagetotext', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': apiKey,
        },
        body: JSON.stringify({
          image: base64.replace(/^data:image\/[a-z]+;base64,/, '')
        }),
      });

      const data = await response.json();

      if (response.ok && Array.isArray(data)) {
        const lines = data.map(line => line.text.trim()).filter(Boolean);
        if (lines.length > 0) {
          setItems(lines);
        } else {
          alert('No items found in receipt.');
        }
      } else {
        console.error(data);
        alert(data.error || 'Failed to extract text from image.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to process image.');
    }
  };

  const toggleItemForParticipant = (participant, item) => {
    setSelectedItems((prev) => {
      const current = prev[participant] || [];
      const updated = current.includes(item)
        ? current.filter(i => i !== item)
        : [...current, item];
      return { ...prev, [participant]: updated };
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bill: {billName}</Text>

      <Button title="Upload Receipt Image" onPress={pickImage} />
      {receiptImage && <Image source={{ uri: receiptImage }} style={styles.image} />}

      <FlatList
        data={items}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={<Text style={styles.listTitle}>Select Items:</Text>}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Text style={styles.itemText}>{item}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {participants.map((p) => (
                <TouchableOpacity
                  key={p}
                  onPress={() => toggleItemForParticipant(p, item)}
                  style={[
                    styles.choiceBtn,
                    selectedItems[p]?.includes(item) && styles.selectedBtn,
                  ]}
                >
                  <Text style={styles.btnText}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 15,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  itemRow: {
    marginBottom: 15,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 5,
  },
  choiceBtn: {
    backgroundColor: '#ccc',
    padding: 6,
    marginRight: 5,
    marginBottom: 5,
    borderRadius: 8,
  },
  selectedBtn: {
    backgroundColor: '#00C896',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
