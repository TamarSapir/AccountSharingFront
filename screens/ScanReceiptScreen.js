import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  Image,
  ActivityIndicator,
  StyleSheet,
  ScrollView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { API_BASE } from '../apiConfig';

export default function ScanReceiptScreen() {
  const [imageUri, setImageUri] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      quality: 1,
      base64: false,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const image = result.assets[0];
      setImageUri(image.uri);
      await sendToApi(image.uri);
    }
  };

  const sendToApi = async (uri) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('image', {
        uri,
        name: 'receipt.jpg',
        type: 'image/jpeg',
      });

      const response = await fetch(`${API_BASE}/scan-receipt`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.items && Array.isArray(data.items)) {
        const text = data.items.join('\n');
        setExtractedText(text);
      } else {
        setExtractedText(data.error || 'Unexpected response.');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setExtractedText('Failed to extract text.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Button title="Upload Receipt Image" onPress={pickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Text style={styles.result}>{extractedText}</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  image: { width: '100%', height: 300, resizeMode: 'contain', marginVertical: 10 },
  result: { marginTop: 20, fontSize: 16 },
});
