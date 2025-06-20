import { Feather } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Alert,
  PanResponder,
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
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();

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
        // Hide zoom slider after 2 seconds
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
        const photo = await cameraRef.current.takePictureAsync();
        console.log('Photo taken:', photo.uri);
        Alert.alert(
          'Photo taken',
          'This is where the image would be sent to the backend'
        );
        router.back();
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const handleZoomChange = (value: number) => {
    setZoom(value);
    setShowZoomSlider(true);
    // Hide slider after interaction
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

        {zoom > 0 && (
          <View style={styles.zoomIndicator}>
            <Text style={styles.zoomText}>{(1 + zoom * 4).toFixed(1)}x</Text>
          </View>
        )}

        {/* Camera frame overlay */}
        <View style={styles.cameraOverlay}>
          <View style={styles.frameCornerTopLeft} />
          <View style={styles.frameCornerTopRight} />
          <View style={styles.frameCornerBottomLeft} />
          <View style={styles.frameCornerBottomRight} />
        </View>

        {showZoomSlider && (
          <View style={styles.zoomSliderContainer}>
            <View style={styles.zoomSliderTrack}>
              <View
                style={[styles.zoomSliderFill, { width: `${zoom * 100}%` }]}
              />
              <View
                style={[styles.zoomSliderThumb, { left: `${zoom * 100}%` }]}
              />
            </View>
            <View style={styles.zoomLabels}>
              <Text style={styles.zoomLabel}>1x</Text>
              <Text style={styles.zoomLabel}>5x</Text>
            </View>
          </View>
        )}

        <View style={styles.zoomButtonsContainer}>
          <TouchableOpacity
            style={styles.zoomButton}
            onPress={() => handleZoomChange(0)}
          >
            <Text
              style={[styles.zoomButtonText, zoom === 0 && styles.activeZoom]}
            >
              1x
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.zoomButton}
            onPress={() => handleZoomChange(0.5)}
          >
            <Text
              style={[styles.zoomButtonText, zoom === 0.5 && styles.activeZoom]}
            >
              3x
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.zoomButton}
            onPress={() => handleZoomChange(1)}
          >
            <Text
              style={[styles.zoomButtonText, zoom === 1 && styles.activeZoom]}
            >
              5x
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomControls}>
          <TouchableOpacity onPress={toggleCamera} style={styles.flipButton}>
            <Feather name='refresh-ccw' size={24} color='black' />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSnap} style={styles.captureButton}>
            <View style={styles.captureButtonInner}>
              <Feather name='camera' size={28} color='#FF0000' />
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
    backdropFilter: 'blur(10px)',
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
  zoomSliderContainer: {
    position: 'absolute',
    bottom: 180,
    left: 40,
    right: 40,
    height: 60,
  },
  zoomSliderTrack: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'visible',
  },
  zoomSliderFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 2,
  },
  zoomSliderThumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    top: -8,
    marginLeft: -10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  zoomLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  zoomLabel: {
    color: 'white',
    fontSize: 12,
    opacity: 0.8,
  },
  zoomButtonsContainer: {
    position: 'absolute',
    bottom: 120,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    padding: 4,
  },
  zoomButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  zoomButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.7,
  },
  activeZoom: {
    opacity: 1,
    fontWeight: '700',
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
  captureButtonInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
