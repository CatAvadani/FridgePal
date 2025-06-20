import { Feather } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();

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

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing={facing}
      >
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

        {/* Camera frame overlay */}
        <View style={styles.cameraOverlay}>
          <View style={styles.frameCornerTopLeft} />
          <View style={styles.frameCornerTopRight} />
          <View style={styles.frameCornerBottomLeft} />
          <View style={styles.frameCornerBottomRight} />
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

          <View style={{ width: 56 }} />
        </View>
      </CameraView>
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
    borderRadius: 22,
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
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    backgroundColor: 'white',
    borderRadius: 40,
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
