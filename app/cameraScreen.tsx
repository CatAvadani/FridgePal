import CameraZoomControls from '@/components/CameraZoomControls';
import { useAlert } from '@/hooks/useCustomAlert';
import { analyzeImageWithAI } from '@/services/aiAnalysisApi'; // Import both
import { Feather } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  PanResponder,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [zoom, setZoom] = useState(0);
  const [showZoomSlider, setShowZoomSlider] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const { showAlert } = useAlert();
  const params = useLocalSearchParams();

  const isFromTakePhoto = params.from === 'takePhoto';
  const isFromAddProduct = params.from === 'addProduct';

  console.log('Camera Screen Params:', params);
  console.log('isFromTakePhoto:', isFromTakePhoto);
  console.log('isFromAddProduct:', isFromAddProduct);

  // Pinch to zoom handler
  const pinchGesture = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt) =>
        evt.nativeEvent.touches.length === 2,
      onMoveShouldSetPanResponder: (evt) =>
        evt.nativeEvent.touches.length === 2,
      onPanResponderGrant: () => {
        setShowZoomSlider(true);
      },
      onPanResponderMove: (evt) => {
        if (evt.nativeEvent.touches.length === 2) {
          const touch1 = evt.nativeEvent.touches[0];
          const touch2 = evt.nativeEvent.touches[1];
          const distance = Math.sqrt(
            Math.pow(touch2.pageX - touch1.pageX, 2) +
              Math.pow(touch2.pageY - touch1.pageY, 2)
          );
          // Normalize distance to zoom value (0-1)
          const normalizedZoom = Math.min(
            Math.max((distance - 100) / 200, 0),
            1
          );
          setZoom(normalizedZoom);
        }
      },
      onPanResponderRelease: () => {
        setTimeout(() => setShowZoomSlider(false), 2000);
      },
      onShouldBlockNativeResponder: () => true,
    })
  ).current;

  if (!permission) return <View style={styles.container} />;
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCamera = () =>
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));

  const handleSnap = async () => {
    if (cameraRef.current) {
      try {
        console.log('Taking picture...');
        console.log('Flow check - isFromTakePhoto:', isFromTakePhoto);
        console.log('Flow check - isFromAddProduct:', isFromAddProduct);

        const photo = await cameraRef.current.takePictureAsync({
          base64: false,
          quality: 0.7,
          skipProcessing: true,
        });

        let usableUri = photo.uri;
        console.log('Original photo URI:', usableUri);

        // On Android, copy to cache
        if (Platform.OS === 'android') {
          const cacheUri =
            FileSystem.cacheDirectory + `photo_${Date.now()}.jpg`;
          await FileSystem.copyAsync({ from: usableUri, to: cacheUri });
          console.log('Copied photo to:', cacheUri);
          usableUri = cacheUri;
        }

        // Test if file exists before proceeding
        const fileInfo = await FileSystem.getInfoAsync(usableUri);
        console.log('File info:', fileInfo);

        if (isFromTakePhoto) {
          console.log('Triggering AI Analysis flow');
          await handleAIAnalysis(usableUri);
        } else {
          console.log('Triggering Manual flow');
          router.push({
            pathname: '/addProduct',
            params: {
              photoUri: usableUri,
              fromCamera: 'true',
            },
          });
        }
      } catch (error) {
        console.log('Camera snap error:', error);
        showAlert({
          title: 'Error',
          message: 'Failed to take picture. Please try again.',
        });
      }
    }
  };

  const handleAIAnalysis = async (imageUri: string) => {
    try {
      setIsAnalyzing(true);

      console.log('Starting AI analysis for image:', imageUri);

      const analysisResult = await analyzeImageWithAI(imageUri);

      console.log('AI Analysis result:', analysisResult);

      // Navigate to AddProduct with prefilled data
      router.push({
        pathname: '/addProduct',
        params: {
          photoUri: imageUri,
          fromAI: 'true',
          productName: analysisResult.productName,
          quantity: analysisResult.quantity.toString(),
          categoryId: analysisResult.categoryId.toString(),
          expirationDate: analysisResult.expirationDate,
        },
      });
    } catch (error) {
      console.error('AI Analysis error:', error);

      showAlert({
        title: 'Analysis Failed',
        message:
          'Could not analyze the image automatically. You can fill in the details manually.',
      });

      router.push({
        pathname: '/addProduct',
        params: {
          photoUri: imageUri,
          fromCamera: 'true',
        },
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleZoomChange = (value: number) => {
    setZoom(value);
    setShowZoomSlider(true);
    setTimeout(() => setShowZoomSlider(false), 2000);
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing={facing}
        zoom={zoom}
      />

      <View style={StyleSheet.absoluteFillObject} {...pinchGesture.panHandlers}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.glassButton}
            onPress={() => router.back()}
          >
            <Feather name='arrow-left' size={24} color='white' />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.glassButton}
            onPress={() => router.back()}
          >
            <Feather name='x' size={24} color='white' />
          </TouchableOpacity>
        </View>

        {isAnalyzing && (
          <View style={styles.analyzingContainer}>
            <ActivityIndicator size='large' color='white' />
            <Text style={styles.analyzingText}>Analyzing image...</Text>
          </View>
        )}

        {/* Camera frame overlay */}
        <View style={styles.cameraOverlay}>
          <View style={styles.frameCornerTopLeft} />
          <View style={styles.frameCornerTopRight} />
          <View style={styles.frameCornerBottomLeft} />
          <View style={styles.frameCornerBottomRight} />
        </View>

        <CameraZoomControls
          zoom={zoom}
          onZoomChange={handleZoomChange}
          showZoomSlider={showZoomSlider}
        />

        <View style={styles.bottomControls}>
          <TouchableOpacity onPress={toggleCamera} style={styles.flipButton}>
            <Feather name='refresh-ccw' size={24} color='black' />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSnap}
            style={[
              styles.captureButton,
              isAnalyzing && styles.captureButtonDisabled,
            ]}
            disabled={isAnalyzing}
          >
            <View style={styles.captureButtonInner}>
              {isAnalyzing ? (
                <ActivityIndicator size={28} color='#FF0000' />
              ) : (
                <Feather name='camera' size={28} color='#FF0000' />
              )}
            </View>
          </TouchableOpacity>

          <View style={{ width: 36 }} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  permissionText: {
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
    paddingHorizontal: 24,
    fontSize: 16,
  },
  permissionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  permissionButtonText: {
    color: 'black',
    fontWeight: '600',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  glassButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  analyzingContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 20,
    marginHorizontal: 40,
    borderRadius: 12,
    transform: [{ translateY: -50 }],
  },
  analyzingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  frameCornerTopLeft: {
    position: 'absolute',
    top: '30%',
    left: '15%',
    width: 50,
    height: 50,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: 'white',
  },
  frameCornerTopRight: {
    position: 'absolute',
    top: '30%',
    right: '15%',
    width: 50,
    height: 50,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: 'white',
  },
  frameCornerBottomLeft: {
    position: 'absolute',
    bottom: '30%',
    left: '15%',
    width: 50,
    height: 50,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: 'white',
  },
  frameCornerBottomRight: {
    position: 'absolute',
    bottom: '30%',
    right: '15%',
    width: 50,
    height: 50,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: 'white',
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  flipButton: {
    width: 36,
    height: 36,
    backgroundColor: 'white',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    backgroundColor: 'white',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FF0000',
  },
  captureButtonDisabled: {
    opacity: 0.7,
  },
  captureButtonInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
