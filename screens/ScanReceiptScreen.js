import React, { useState } from 'react';
import { View, Text, Button, Image, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const API_KEY = '2rqKmKZfOihs863X+zoLHQ==gl1pnJH4omROsJmT';

export default function ScanReceiptScreen() {
  const [imageUri, setImageUri] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.IMAGE,
      quality: 1,
      base64: true,
    });

    if (!result.cancelled) {
      setImageUri(result.assets[0].uri);
      sendToApi(result.assets[0]);
    }
  };

  const sendToApi = async (image) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', {
        uri: image.uri,
        name: 'receipt.jpg',
        type: 'image/jpeg',
      });

      const response = await axios.post('https://api.api-ninjas.com/v1/imagetotext', formData, {
        headers: {
          'X-Api-Key': API_KEY,
          'Content-Type': 'multipart/form-data',
        },
      });

      const texts = response.data.map(block => block.text).join('\n');
      setExtractedText(texts);
    } catch (error) {
      console.error('API error:', error);
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
