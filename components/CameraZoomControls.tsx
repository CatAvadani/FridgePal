import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CameraZoomControlsProps {
  zoom: number;
  onZoomChange: (value: number) => void;
  showZoomSlider?: boolean;
}

export default function CameraZoomControls({
  zoom,
  onZoomChange,
  showZoomSlider,
}: CameraZoomControlsProps) {
  return (
    <>
      {zoom > 0 && (
        <View style={styles.zoomIndicator}>
          <Text style={styles.zoomText}>{(1 + zoom * 4).toFixed(1)}x</Text>
        </View>
      )}

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
          onPress={() => onZoomChange(0)}
        >
          <Text
            style={[styles.zoomButtonText, zoom === 0 && styles.activeZoom]}
          >
            1x
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.zoomButton}
          onPress={() => onZoomChange(0.5)}
        >
          <Text
            style={[styles.zoomButtonText, zoom === 0.5 && styles.activeZoom]}
          >
            3x
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.zoomButton}
          onPress={() => onZoomChange(1)}
        >
          <Text
            style={[styles.zoomButtonText, zoom === 1 && styles.activeZoom]}
          >
            5x
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
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
});
