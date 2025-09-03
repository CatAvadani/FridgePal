import { Feather } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface PermissionRequestProps {
  onRequest: () => void;
}

export const PermissionRequest = ({ onRequest }: PermissionRequestProps) => (
  <View style={styles.permissionContainer}>
    <Text style={styles.permissionText}>
      We need your permission to show the camera
    </Text>
    <TouchableOpacity style={styles.permissionButton} onPress={onRequest}>
      <Text style={styles.permissionButtonText}>Grant Permission</Text>
    </TouchableOpacity>
  </View>
);

interface CameraHeaderProps {
  onClose: () => void;
}

export const CameraHeader = ({ onClose }: CameraHeaderProps) => (
  <View style={styles.header}>
    <TouchableOpacity style={styles.glassButton} onPress={onClose}>
      <Feather name='x' size={24} color='white' />
    </TouchableOpacity>
  </View>
);

export const AnalyzingOverlay = () => (
  <View style={styles.analyzingContainer}>
    <ActivityIndicator size='large' color='white' />
    <Text style={styles.analyzingText}>Analyzing image...</Text>
  </View>
);

export const CameraFrameOverlay = () => (
  <View style={styles.cameraOverlay}>
    <View style={styles.frameCornerTopLeft} />
    <View style={styles.frameCornerTopRight} />
    <View style={styles.frameCornerBottomLeft} />
    <View style={styles.frameCornerBottomRight} />
  </View>
);

interface CameraControlsProps {
  onCapture: () => void;
  isAnalyzing: boolean;
}

export const CameraControls = ({
  onCapture,
  isAnalyzing,
}: CameraControlsProps) => (
  <View style={styles.bottomControls}>
    <TouchableOpacity
      onPress={onCapture}
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
  </View>
);

const styles = StyleSheet.create({
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
    justifyContent: 'flex-end',
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
    shadowOffset: { width: 0, height: 2 },
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
    top: '20%',
    left: '15%',
    width: 50,
    height: 50,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: 'white',
  },
  frameCornerTopRight: {
    position: 'absolute',
    top: '20%',
    right: '15%',
    width: 50,
    height: 50,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: 'white',
  },
  frameCornerBottomLeft: {
    position: 'absolute',
    bottom: '40%',
    left: '15%',
    width: 50,
    height: 50,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: 'white',
  },
  frameCornerBottomRight: {
    position: 'absolute',
    bottom: '40%',
    right: '15%',
    width: 50,
    height: 50,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: 'white',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
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
