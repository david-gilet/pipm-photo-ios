import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
  Alert,
} from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { FormScreen } from './FormScreen';

export default function App() {
  // -----------------------
  // États globaux
  // -----------------------
  const [hasPermission, setHasPermission] = useState(false);
  const [mode, setMode] = useState<'form' | 'camera'>('form');
  const [projet, setProjet] = useState('');
  const [equipement, useEquipement] = useState('');
  const [zoom, setZoom] = useState(1);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoCount, setPhotoCount] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);

  // Animation pour la miniature photo
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Référence caméra
  const cameraRef = useRef<Camera>(null);

  // Récupération des devices caméra
  const devices = useCameraDevices();
  const device = useMemo(() => devices.back, [devices]);

  // Zoom natifs disponibles
  const zoomLevels = useMemo(() => [0.6, 1, 2, 3], []);

  // -----------------------
  // useEffect : demande permission caméra au démarrage
  // -----------------------
  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  // -----------------------
  // Fonction takePhoto : prise rapide et affichage immédiat de la miniature
  // -----------------------
  const takePhoto = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePhoto({ flash: 'off' });
      setPhotoUri('file://' + photo.path);
      setPhotoCount((c) => c + 1);

      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } catch (e) {
      console.error('Erreur prise photo:', e);
    }
  };

  // -----------------------
  // Fonction onStart : validation formulaire et passage en mode caméra
  // -----------------------
  const onStart = () => {
    if (!projet.trim()) {
      Alert.alert('Erreur', 'Merci de saisir un nom de projet');
      return;
    }
    if (!equipement.trim()) {
      Alert.alert('Erreur', 'Merci de saisir un nom d’équipement');
      return;
    }
    setPhotoCount(1);
    setPhotoUri(null);
    setMode('camera');
  };

  // -----------------------
  // Fonction onFinish : fin de session photo, retour formulaire
  // -----------------------
  const onFinish = () => {
    useEquipement('');
    setPhotoUri(null);
    setPhotoCount(1);
    setMode('form');
  };

  // -----------------------
  // Fonction onResetAll : ouvrir modale confirmation réinitialisation
  // -----------------------
  const onResetAll = () => {
    setModalVisible(true);
  };

  // -----------------------
  // Fonction handleConfirmReset : confirmation réinitialisation complète
  // -----------------------
  const handleConfirmReset = () => {
    setProjet('');
    useEquipement('');
    setPhotoUri(null);
    setPhotoCount(1);
    setMode('form');
    setModalVisible(false);
  };

  // -----------------------
  // Fonction handleCancelReset : annuler réinitialisation
  // -----------------------
  const handleCancelReset = () => {
    setModalVisible(false);
  };

  // -----------------------
  // Composant ConfirmResetModal : modale personnalisée pour la réinitialisation
  // -----------------------
  const ConfirmResetModal = () => {
    if (!modalVisible) return null;
    return (
      <View style={modalStyles.modalOverlay}>
        <View style={modalStyles.modalContent}>
          <Text style={modalStyles.modalMessage}>
            Voulez-vous vraiment réinitialiser tous les champs ?
          </Text>
          <View style={modalStyles.modalButtons}>
            <TouchableOpacity style={modalStyles.btnCancel} onPress={handleCancelReset}>
              <Text style={modalStyles.btnText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={modalStyles.btnConfirm} onPress={handleConfirmReset}>
              <Text style={modalStyles.btnText}>Confirmer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // -----------------------
  // Rendu principal : caméra toujours montée et contrôle des modes formulaire/caméra
  // -----------------------
  return (
    <View style={styles.container}>
      {device && hasPermission ? (
        <Camera
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={mode === 'camera'}
          zoom={zoom}
          photo={true}
        />
      ) : (
        <Text style={styles.loadingText}>
          {hasPermission ? 'Chargement caméra...' : 'Permission caméra refusée'}
        </Text>
      )}

      {mode === 'form' && (
        <View style={styles.formOverlay}>
          <FormScreen
            projet={projet}
            setProjet={setProjet}
            equipement={equipement}
            setEquipement={useEquipement}
            onStart={onStart}
            onResetAll={onResetAll}
          />
        </View>
      )}

      {mode === 'camera' && (
        <>
          {/* Zoom natifs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.zoomScroll}
          >
            {zoomLevels.map((level) => (
              <TouchableOpacity
                key={level}
                style={[styles.zoomButton, zoom === level && styles.zoomButtonActive]}
                onPress={() => setZoom(level)}
              >
                <Text style={styles.zoomText}>{level}x</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Bouton prise photo */}
          <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
            <View style={styles.innerCircle} />
          </TouchableOpacity>

          {/* Miniature photo */}
          {photoUri && (
            <Animated.View style={[styles.previewContainer, { opacity: fadeAnim }]}>
              <Image source={{ uri: photoUri }} style={styles.previewImage} />
            </Animated.View>
          )}

          {/* Bouton Fin */}
          <TouchableOpacity style={styles.finishButton} onPress={onFinish}>
            <Text style={styles.finishButtonText}>Fin</Text>
          </TouchableOpacity>
        </>
      )}

      <ConfirmResetModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  formOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    zIndex: 20,
  },
  loadingText: {
    flex: 1,
    textAlign: 'center',
    marginTop: 40,
    fontSize: 18,
    color: '#888',
  },
  zoomScroll: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    position: 'absolute',
    bottom: 120,
    width: '100%',
    zIndex: 30,
  },
  zoomButton: {
    backgroundColor: '#444',
    marginHorizontal: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 25,
  },
  zoomButtonActive: {
    backgroundColor: '#00aaff',
  },
  zoomText: {
    color: 'white',
    fontWeight: 'bold',
  },
  captureButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 30,
  },
  innerCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
  },
  previewContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 70,
    height: 100,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'black',
    zIndex: 30,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  finishButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#00aaff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 30,
  },
  finishButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

// Modale confirmation (inchangée)
const modalStyles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalMessage: {
    fontSize: 18,
    marginBottom: 25,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  btnCancel: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  btnConfirm: {
    backgroundColor: '#00aaff',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
