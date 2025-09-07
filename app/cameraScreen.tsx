import {
  AnalyzingOverlay,
  CameraControls,
  CameraFrameOverlay,
  CameraHeader,
  PermissionRequest,
} from '@/components/camera/CameraComponents';
import { useAlert } from '@/hooks/useCustomAlert';
import { analyzeImageWithAI } from '@/services/openaiAnalysisService';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import { PanResponder, Platform, StyleSheet, Text, View } from 'react-native';

// Constants
const ZOOM_SENSITIVITY = 200;
const ZOOM_HIDE_DELAY = 2000;
const PHOTO_QUALITY = 0.8;

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [zoom, setZoom] = useState(0);
  const [showZoomIndicator, setShowZoomIndicator] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const { showAlert } = useAlert();
  const params = useLocalSearchParams();

  // Check if this is for AI analysis (from takePhoto button)
  const isFromTakePhoto = params.from === 'takePhoto';

  // Pinch to zoom handler
  const pinchGesture = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt) =>
        evt.nativeEvent.touches.length === 2,
      onMoveShouldSetPanResponder: (evt) =>
        evt.nativeEvent.touches.length === 2,
      onPanResponderGrant: () => setShowZoomIndicator(true),
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
        setTimeout(() => setShowZoomIndicator(false), ZOOM_HIDE_DELAY);
      },
      onShouldBlockNativeResponder: () => true,
    })
  ).current;

  if (!permission) return <View style={styles.container} />;
  if (!permission.granted)
    return <PermissionRequest onRequest={requestPermission} />;

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
      console.log('Error processing image for Android:', error);
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
      console.log('Camera snap error:', error);
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
      console.log('AI Analysis error:', error);

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

  const handleBack = () => {
    if (isFromTakePhoto) {
      router.replace('/');
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style='light' translucent={true} />
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing='back'
        zoom={zoom}
      />

      <View style={StyleSheet.absoluteFillObject} {...pinchGesture.panHandlers}>
        <CameraHeader onClose={handleBack} />

        {isAnalyzing && <AnalyzingOverlay />}

        <CameraFrameOverlay />

        {/* Zoom indicator - shows when pinching */}
        {showZoomIndicator && zoom > 0 && (
          <View style={styles.zoomIndicator}>
            <Text style={styles.zoomText}>{(1 + zoom * 4).toFixed(1)}x</Text>
          </View>
        )}

        <CameraControls onCapture={handleSnap} isAnalyzing={isAnalyzing} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  zoomIndicator: {
    position: 'absolute',
    top: 120,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  zoomText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
