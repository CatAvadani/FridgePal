import {
  AnalyzingOverlay,
  CameraControls,
  CameraFrameOverlay,
  CameraHeader,
  PermissionRequest,
} from '@/components/camera/CameraComponents';
import CameraZoomControls from '@/components/camera/CameraZoomControls';
import { useAlert } from '@/hooks/useCustomAlert';
import { analyzeImageWithAI } from '@/services/aiAnalysisApi';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { PanResponder, Platform, StyleSheet, View } from 'react-native';

// Constants
const ZOOM_SENSITIVITY = 200;
const ZOOM_HIDE_DELAY = 2000;
const PHOTO_QUALITY = 0.8;

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

  // Pinch to zoom handler
  const pinchGesture = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt) =>
        evt.nativeEvent.touches.length === 2,
      onMoveShouldSetPanResponder: (evt) =>
        evt.nativeEvent.touches.length === 2,
      onPanResponderGrant: () => setShowZoomSlider(true),
      onPanResponderMove: (evt) => {
        if (evt.nativeEvent.touches.length === 2) {
          const [touch1, touch2] = evt.nativeEvent.touches;
          const distance = Math.sqrt(
            Math.pow(touch2.pageX - touch1.pageX, 2) +
              Math.pow(touch2.pageY - touch1.pageY, 2)
          );
          const normalizedZoom = Math.min(
            Math.max((distance - 100) / ZOOM_SENSITIVITY, 0),
            1
          );
          setZoom(normalizedZoom);
        }
      },
      onPanResponderRelease: () => {
        setTimeout(() => setShowZoomSlider(false), ZOOM_HIDE_DELAY);
      },
      onShouldBlockNativeResponder: () => true,
    })
  ).current;

  if (!permission) return <View style={styles.container} />;
  if (!permission.granted)
    return <PermissionRequest onRequest={requestPermission} />;

  const toggleCamera = () =>
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));

  const processImageForAndroid = async (
    originalUri: string
  ): Promise<string> => {
    if (Platform.OS !== 'android') return originalUri;

    try {
      const timestamp = Date.now();
      const filename = `photo_${timestamp}.jpg`;
      const processedUri = `${FileSystem.documentDirectory}${filename}`;

      await FileSystem.copyAsync({ from: originalUri, to: processedUri });

      const fileInfo = await FileSystem.getInfoAsync(processedUri);
      if (!fileInfo.exists) {
        throw new Error('Failed to process image file');
      }

      return processedUri;
    } catch (error) {
      console.error('Error processing image for Android:', error);
      return originalUri;
    }
  };

  const handleSnap = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        base64: false,
        quality: PHOTO_QUALITY,
        skipProcessing: false,
        exif: false,
      });

      const usableUri = await processImageForAndroid(photo.uri);

      // Verify file accessibility
      const fileInfo = await FileSystem.getInfoAsync(usableUri);
      if (!fileInfo.exists) {
        throw new Error('Image file is not accessible');
      }

      if (isFromTakePhoto) {
        await handleAIAnalysis(usableUri);
      } else {
        navigateToAddProduct(usableUri, { fromCamera: 'true' });
      }
    } catch (error) {
      console.error('Camera snap error:', error);
      showAlert({
        title: 'Error',
        message: 'Failed to take picture. Please try again.',
      });
    }
  };

  const handleAIAnalysis = async (imageUri: string) => {
    setIsAnalyzing(true);

    try {
      const analysisResult = await analyzeImageWithAI(imageUri);

      navigateToAddProduct(imageUri, {
        fromAI: 'true',
        productName: analysisResult.productName,
        quantity: analysisResult.quantity.toString(),
        categoryId: analysisResult.categoryId.toString(),
        expirationDate: analysisResult.expirationDate,
      });
    } catch (error) {
      console.error('AI Analysis error:', error);

      showAlert({
        title: 'Analysis Failed',
        message:
          'Could not analyze the image automatically. You can fill in the details manually.',
      });

      navigateToAddProduct(imageUri, { fromCamera: 'true' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const navigateToAddProduct = (
    photoUri: string,
    additionalParams: Record<string, string>
  ) => {
    router.push({
      pathname: '/addProduct',
      params: { photoUri, ...additionalParams },
    });
  };

  const handleZoomChange = (value: number) => {
    setZoom(value);
    setShowZoomSlider(true);
    setTimeout(() => setShowZoomSlider(false), ZOOM_HIDE_DELAY);
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
        <CameraHeader onClose={() => router.back()} />

        {isAnalyzing && <AnalyzingOverlay />}

        <CameraFrameOverlay />

        <CameraZoomControls
          zoom={zoom}
          onZoomChange={handleZoomChange}
          showZoomSlider={showZoomSlider}
        />

        <CameraControls
          onFlip={toggleCamera}
          onCapture={handleSnap}
          isAnalyzing={isAnalyzing}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});
