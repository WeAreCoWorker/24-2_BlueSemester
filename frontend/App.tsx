import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, TextInput, Vibration, Switch } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import Tts from 'react-native-tts';
import { request, check, PERMISSIONS } from 'react-native-permissions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Voice from '@react-native-voice/voice';

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
    Tts.speak('DigitalEye에 오신걸 환영합니다.');
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
  const [isConnected, setIsConnected] = useState(false);

  const requestPermissions = async () => {
    const cameraPermission = await request(PERMISSIONS.ANDROID.CAMERA);
    const micPermission = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
    
    if (cameraPermission === 'granted' && micPermission === 'granted') {
      navigation.navigate('Camera');
    } else {
      Alert.alert('Permissions not granted');
    }
  };

  const checkServerConnection = async () => {
    try{
      const response = await fetch('http://digital-eye-beanstalk-env-1.eba-imdxjn2k.ap-northeast-2.elasticbeanstalk.com/init-test');
      const res = await response.json();
      console.log(res);
      if(response.ok && res != null) {
        setIsConnected(true);
        Tts.speak("서버와 연결되었습니다.");
        Tts.speak(res["message"], res["currentTime"], res["weather"]);
      }else{
        throw new Error('Server unreachable');
      } 
    } catch(error) {
      setIsConnected(false);
      Tts.speak("서버와의 연결에 실패했습니다. 우측 하단의 버튼을 눌러 다시 연결을 시도해주세요.");
    }
  };

  useEffect(() => {
    checkServerConnection();
  }, []);

  const handlePress = () => {
    if(isConnected) {
      Tts.speak("서버와 연결된 상태입니다.");
    } else {
      checkServerConnection();
    }
  };

  return (
    <View style={styles.homeContainer}>
      <TouchableOpacity style={styles.button} onPress={requestPermissions}>
        <Icon
          name = "camera"
          size = {120}
          color = "black"
          />
        <Text style={styles.buttonText}>시작</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TextInputScreen')}>
        <Icon
          name = "tune"
          size = {120}
          color = "black"
          />
        <Text style={styles.buttonText}>설정</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.statusButton} onPress={handlePress}>
        <Icon
          name={isConnected ? "wifi" : "wifi-off"}
          size = {30}
          color="white"
          />
      </TouchableOpacity>
    </View>
  );
};

const CameraScreen: React.FC<{ navigation: CameraNavigationProp }> = ({ navigation }) => {
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [recording, setRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState<string>('');
  const [audioText, setAudioText] = useState('');
  const cameraRef = useRef<Camera>(null);
  const device = useCameraDevice('back');

  /*useEffect(() => {
    Voice.onSpeechResults = (event) => {
      /*if (e.value && e.value.length > 0) {
        setTranscribedText(e.value[0]); // 첫 번째 결과를 텍스트로 설정
      }
      const recognizedText = event.value[0];
      setAudioText(recognizedText);
    };

    Voice.onSpeechError = (e) => {
      console.error('음성 인식 오류:', e);
      Alert.alert('음성 인식 오류');
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);
  */
  const _onSpeechStart = () => {
    console.log('onSpeechStart');
    setTranscribedText('');
  };

  const _onSpeechEnd = () => {
    console.log('onSpeechEnd');
  };

  const _onSpeechResults = (event) => {
    console.log('onSpeechResults');
    setTranscribedText(event.value[0]);
  };

  const _onSpeechError = (event) => {
    console.log('_onSpeechError');
    console.log(event.error);
  };

  const _onRecordVoice = () => {
    if(recording) {
      Voice.stop();
    } else {
      Voice.start('ko-KR');
    }
  };

  useEffect(() => {
    Voice.onSpeechStart = _onSpeechStart;
    Voice.onSpeechEnd = _onSpeechEnd;
    Voice.onSpeechResults = _onSpeechResults;
    Voice.onSpeechError = _onSpeechError;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  if (device == null) return <ActivityIndicator size="large" color="#00ff00" />;

  const startRecording = async () => {
    try {
      setRecording(true);
      await Voice.start('ko-KR'); // 한국어로 음성 인식 시작
    } catch (error) {
      console.error('음성 인식 시작 오류:', error);
      Alert.alert('음성 인식 시작 오류');
      setRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setRecording(false);
    } catch (error) {
      console.error('음성 인식 중단 오류:', error);
      Alert.alert('음성 인식 중단 오류');
    }
  };

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

  const recordAndCapture = async () => {
    if (recording) {
      // 녹음 중지 및 이미지 촬영
      await stopRecording();
    } else {
      // 녹음 시작
      await startRecording();
    }

    console.log(audioText);

    if (!cameraRef.current || !device) {
      return;
    }

    try {
      setIsTakingPhoto(true);
      const photo = await cameraRef.current.takeSnapshot();
      console.log(photo);
      

      if (photo.path) {
        await uploadData(photo.path, audioText);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsTakingPhoto(false);
    }
  }

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

  const uploadData = async (imagePath: string, text: string) => {
    setUploading(true);
    setStatusMessage('업로드 중...');

    const formData = new FormData();
    formData.append('image', {
      uri: `file://${imagePath}`,
      type: 'image/jpeg',
      name: 'photo.jpg',
    });
    formData.append('text', text);

    try {
      const response = await fetch('https://digitaleye.loca.lt/ai-form', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept-Language': 'ko',
        },
      });

      const result = await response.json();
      console.log(result);
      setStatusMessage(result.message);
      Tts.speak(result.message); // 음성으로 결과 출력
    } catch (error) {
      console.error(error);
      setStatusMessage('데이터 업로드 실패');
      Tts.speak('데이터 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  /*const handleRecordingButtonPress = async () => {
    if (recording) {
      // 녹음 중지 및 이미지 촬영
      await stopRecording();
      await uploadData();
    } else {
      // 녹음 시작
      await startRecording();
    }
  };*/


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
        <Icon
         name = "camera"
         size = {30}
         color = "black"
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.microphoneButton}
        onPress={_onRecordVoice}
        >
          <Icon
          name = {recording ? 'stop-circle-outline' : 'microphone-outline'}
          size = {30}
          color = "black"
          />
      </TouchableOpacity>
      <Text style={styles.statusText}>{statusMessage}</Text>
    </View>
  );
};

// 설정 화면
const TextInputScreen: React.FC<{ navigation: TextInputNavigationProp }> = ({ navigation }) => {
  const [inputText, setInputText] = useState('');
  const [largeText, setLargeText] = useState(false);
  const [vibrationEnabled, setVibrationEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hasVibrationPermission, setHasVibrationPermission] = useState(false);

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

  const checkVibrationPermission = async () => {
    const status = await check(PERMISSIONS.ANDROID.VIBRATE);
    setHasVibrationPermission(status === 'granted');
  };

  const requestVibrationPermission = async () => {
    const status = await request(PERMISSIONS.ANDROID.VIBRATE);
    setHasVibrationPermission(status === 'granted');
  };

  const toggleLargeText = () => {
    setLargeText((prev) => !prev);
    if (soundEnabled) Tts.speak('텍스트 크기 설정이 변경되었습니다.');
  };

  const toggleVibration = async () => {
    if (!hasVibrationPermission) {
      await requestVibrationPermission();
    }

    if (hasVibrationPermission) {
      setVibrationEnabled((prev) => !prev);
      if (soundEnabled) Tts.speak('진동 피드백 설정이 변경되었습니다.');
      if (vibrationEnabled) Vibration.vibrate(100);
    } else {
      Alert.alert('진동 권한이 필요합니다.');
    }
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
    if (!soundEnabled) Tts.speak('알림음이 활성화되었습니다.');
  };

  useEffect(() => {
    checkVibrationPermission();
  }, []);

  return (
    <View style = {styles.textInputContainer}>
      <View style={styles.settingContainer}>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>텍스트 크기 크게</Text>
          <Switch value={largeText} onValueChange={toggleLargeText} />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>진동 피드백 활성화</Text>
          <Switch
            value={vibrationEnabled}
            onValueChange={() => {
              if (vibrationEnabled) setVibrationEnabled(false); // OFF 시 즉시 반영
              else toggleVibration(); // ON 시 권한 확인
            }}
          />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>알림음 활성화</Text>
          <Switch value={soundEnabled} onValueChange={toggleSound} />
        </View>
      </View>
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
    backgroundColor: '#282828',
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
    height: '100%',
  },
  captureButton: {
    //backgroundColor: '#fff',
    //padding: 10,
    //borderRadius: 5,
    //marginTop: 20,
    position: 'absolute',
    bottom: 30,
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 4,
    borderColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    left: '40%',
  },
  microphoneButton: {
    position: 'absolute',
    bottom: 30,
    width: 80,
    height: 80,
    right: 30,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 4,
    borderColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
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
  statusButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    backgroundColor: 'black',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 1,
  },
  largeText: {
    fontSize: 30,
  },
  settingContainer: {
    marginTop: 20,
    padding: 10,
    width: '90%',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
});
