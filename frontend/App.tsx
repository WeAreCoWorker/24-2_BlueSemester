import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import Tts from 'react-native-tts';
import { request, PERMISSIONS } from 'react-native-permissions';

type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Camera: undefined;
  TextInputScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

type NavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
type CameraNavigationProp = StackNavigationProp<RootStackParamList, 'Camera'>;
type TextInputNavigationProp = StackNavigationProp<RootStackParamList, 'TextInputScreen'>;

const SplashScreen: React.FC<{ navigation: NavigationProp }> = ({ navigation }) => {
  useEffect(() => {
    Tts.speak('Welcome to Digital Eye');
    setTimeout(() => {
      navigation.navigate('Home');
    }, 3000);
  }, [navigation]);

  return (
    <View style={styles.splashContainer}>
      <Text style={styles.splashText}>DigitalEye</Text>
    </View>
  );
};

const HomeScreen: React.FC<{ navigation: NavigationProp }> = ({ navigation }) => {
  const requestPermissions = async () => {
    const cameraPermission = await request(PERMISSIONS.ANDROID.CAMERA);
    const micPermission = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
    
    if (cameraPermission === 'granted' && micPermission === 'granted') {
      navigation.navigate('Camera');
    } else {
      Alert.alert('Permissions not granted');
    }
  };

  return (
    <View style={styles.homeContainer}>
      <TouchableOpacity style={styles.button} onPress={requestPermissions}>
        <Text style={styles.buttonText}>시작</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TextInputScreen')}>
        <Text style={styles.buttonText}>텍스트 전송</Text>
      </TouchableOpacity>
    </View>
  );
};

const CameraScreen: React.FC<{ navigation: CameraNavigationProp }> = ({ navigation }) => {
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const cameraRef = useRef<Camera>(null);
  const device = useCameraDevice('back');

  if (device == null) return <ActivityIndicator size="large" color="#00ff00" />;
  //const devices = useCameraDevices();
  //const device = devices.find((d) => d.position === 'front'); // 후면 카메라 장치를 선택

  const captureAndUploadImage = async () => {
    if (!cameraRef.current || !device) {
      return;
    }

    try {
      setIsTakingPhoto(true);
      const photo = await cameraRef.current.takeSnapshot();
      console.log(photo);
      

      if (photo.path) {
        await uploadImage(photo.path);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsTakingPhoto(false);
    }
  };

  const uploadImage = async (path) => {
    setUploading(true);
    setStatusMessage('Uploading image...');

    const formData = new FormData();
    formData.append('image', {
      uri: `file://${path}`,
      type: 'image/jpeg',
      name: 'photo.jpg',
    });

    try {
      const response = await fetch('https://digitaleye.loca.lt/ai-image', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept-Language': 'ko',
        },
      });

      const result = await response.json();
      console.log(result);
      setStatusMessage(result["message"]);
      Tts.speak(result["message"]);
    } catch (error) {
      console.error(error);
      setStatusMessage('Image upload failed');
      Tts.speak('이미지 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.cameraContainer}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        device={device}
        isActive={true}
        photoQualityBalance="quality"
        photo={true}
      />
      <TouchableOpacity
        style={styles.captureButton}
        onPress={captureAndUploadImage}
        //disabled={isTakingPhoto || uploading}
      >
        <Text style={styles.buttonText}>{isTakingPhoto || uploading ? 'Processing...' : 'Capture & Upload'}</Text>
      </TouchableOpacity>
      <Text style={styles.statusText}>{statusMessage}</Text>
    </View>
  );
};

// 텍스트 입력 화면
const TextInputScreen: React.FC<{ navigation: TextInputNavigationProp }> = ({ navigation }) => {
  const [inputText, setInputText] = useState('');

  const handleTextSubmit = async () => {
    const formData = new FormData();
    //formData.append("text", inputText);

    try {
      const response = await fetch("https://digitaleye.loca.lt/ai-test", {
        method: "POST",
        body: inputText,
        headers: {
          "Content-Type": "text/plain",
        },
      });
      const result = await response.json();  
      console.log(result);
      Alert.alert('전송 성공', result["text"]); 
    } catch (error) {
      console.error(error);
      Alert.alert('텍스트 전송에 실패했습니다.');
    }
  };

  return (
    <View style={styles.textInputContainer}>
      <TextInput
        style={styles.textInput}
        placeholder="텍스트를 입력하세요"
        value={inputText}
        onChangeText={setInputText}
      />
      <TouchableOpacity style={styles.button} onPress={handleTextSubmit}>
        <Text style={styles.buttonText}>텍스트 전송</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Camera" component={CameraScreen} options={{ headerShown: false }} />
        <Stack.Screen name="TextInputScreen" component={TextInputScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  splashText: {
    fontSize: 32,
    color: 'white',
  },
  homeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  button: {
    width: 200,
    height: 200,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 24,
    color: 'black',
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: '100%',
    height: '80%',
  },
  captureButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  textInputContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  textInput: {
    width: '80%',
    height: 60,
    backgroundColor: 'white',
    fontSize: 18,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  statusText: {
    marginTop: 10,
    color: 'white',
  },
});
