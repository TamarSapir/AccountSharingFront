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
    mediaTypes: [ImagePicker.MediaType.Images],
    allowsEditing: false,
    quality: 1,
    base64: false,
  });

  if (!result.canceled && result.assets && result.assets.length > 0) {
    const imageUri = result.assets[0].uri;
    setReceiptImage(imageUri);

    const filename = imageUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename ?? '');
    const type = match ? `image/${match[1]}` : `image`;

    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      name: filename,
      type,
    });

    try {
      const res = await fetch('http://192.168.1.21:5000/scan-receipt', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await res.json();
      if (data.items && Array.isArray(data.items)) {
        setItems(data.items); //save items from server
      } else {
        alert('No items found in receipt.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to scan receipt. Please try again.');
    }
  }
};

const uploadImageToServer = async (imageUri) => {
  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    name: 'receipt.jpg',
    type: 'image/jpeg',
  });

  try {
    const response = await fetch('http://192.168.1.21:5000/scan-receipt', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    const result = await response.json();
    if (response.ok) {
      setItems(result.items); // show items recognized
    } else {
      alert('Error: ' + result.error);
    }
  } catch (err) {
    console.error('Upload error:', err);
    alert('Something went wrong');
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
        'X-Api-Key': '2rqKmKZfOihs863X+zoLHQ==gl1pnJH4omROsJmT', // שימי את המפתח שלך
      },
      body: JSON.stringify({
        image: base64.replace(/^data:image\/[a-z]+;base64,/, '')
      }),
    });

    const data = await response.json();

    if (response.ok && Array.isArray(data)) {
      const lines = data.map(line => line.text.trim()).filter(Boolean);
      setItems(lines);
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
