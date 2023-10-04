import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import {AppScreenWidth} from '../constants/sacling';
import Modal from 'react-native-modal';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Disk from '../assets/images/Disk.svg';
import {textStyles} from '../styles';
import {colors, fonts} from '../constants/theme';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
const UpLoadComponent = ({
  wdt = AppScreenWidth - scale(10),
  filepath,
  setFilePath,
  is_profile_image = false,
  title = 'Upload Document',
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const Pickimage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      mediaType: 'photo',
      includeBase64: true,
    })
      .then(image => {
        setFilePath({
          path: image.path,
          name: image.path.split('/').pop(),
          ext: image.mime,
          base64: image.data,
        });
        setIsModalVisible(false);
      })
      .catch(err => {
        console.log(err);
        setIsModalVisible(false);
      });
  };

  const Pickfromcamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
    })
      .then(image => {
        console.log('[==================Image====================]', image);
        setFilePath({
          path: image.path,
          name: image.path.split('/').pop(),
          ext: image.mime,
          base64: image.data,
        });
        setIsModalVisible(false);
      })
      .catch(err => {
        console.log(err);
        setIsModalVisible(false);
      });
  };

  const pickDocument = async () => {
    try {
      const pickerResult = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory',
      });

      setFilePath({
        path: pickerResult.fileCopyUri,
        name: pickerResult.name,
        ext: pickerResult.type,
      });
      setIsModalVisible(false);
    } catch (e) {
      console.log(e);
      setIsModalVisible(false);
    }
  };

  return (
    <View
      style={{
        ...styles.mainView,
        marginVertical: is_profile_image ? 0 : scale(10),
        width: wdt,
      }}>
      {!is_profile_image && <Text style={styles.text}>{title}</Text>}
      {!is_profile_image && (
        <TouchableOpacity
          onPress={() => {
            setIsModalVisible(true);
          }}
          style={{...styles.Row, width: wdt}}>
          <Text
            ellipsizeMode={'middle'}
            numberOfLines={1}
            style={{...styles.textplaceholder, width: wdt - scale(45)}}>
            {filepath?.path === null
              ? 'Click here to choose file'
              : filepath?.name}{' '}
          </Text>
          <View
            style={{
              width: scale(25),
              alignItems: 'center',
              justifyContent: 'center',
              height: scale(25),
            }}>
            <Entypo
              size={scale(20)}
              name={'attachment'}
              color={colors.dark_primary_color}
            />
          </View>
        </TouchableOpacity>
      )}
      {is_profile_image && (
        <TouchableOpacity
          onPress={() => {
            setIsModalVisible(true);
          }}
          style={{
            position: 'absolute',
            right: widthPercentageToDP(32),
            top: heightPercentageToDP(-6),
          }}>
          <Entypo
            name="camera"
            style={{backgroundColor: '#0008', padding: 5, borderRadius: 100}}
            color={colors.dark_primary_color}
            size={scale(22)}
          />
        </TouchableOpacity>
      )}
      <Modal
        style={{
          justifyContent: 'flex-end',
          margin: 0,
        }}
        useNativeDriver={true}
        hideModalContentWhileAnimating={true}
        backdropTransitionOutTiming={0}
        animationInTiming={500}
        animationOutTiming={500}
        isVisible={isModalVisible}
        onBackdropPress={() => setIsModalVisible(false)}>
        <View style={styles.main_view}>
          <Text style={styles.upLoadText}>Click Here to Upload</Text>

          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => {
              Pickfromcamera();
            }}>
            <Entypo
              name="camera"
              color={colors.dark_primary_color}
              size={scale(20)}
            />
            <Text
              style={{...styles.upLoadText, color: colors.text_primary_color}}>
              Camera
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => {
              Pickimage();
            }}>
            <FontAwesome size={scale(20)} name="image" color={'#0090FF'} />
            <Text
              style={{...styles.upLoadText, color: colors.text_primary_color}}>
              Gallery
            </Text>
          </TouchableOpacity>

          {!is_profile_image && (
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => {
                pickDocument();
              }}>
              <Disk width={scale(20)} height={scale(20)} />
              <Text
                style={{
                  ...styles.upLoadText,
                  color: colors.text_primary_color,
                }}>
                Pick File
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.cancel_button}
            onPress={() => setIsModalVisible(false)}>
            <Text style={{...styles.upLoadText, color: colors.delete_icon}}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};
export default UpLoadComponent;

const styles = StyleSheet.create({
  mainView: {
    alignSelf: 'center',
    marginVertical: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    ...textStyles.smallheading,
    fontSize: scale(12),
    color: colors.dark_primary_color,
    backgroundColor: '#0000',
    alignSelf: 'flex-start',
    textAlign: 'left',
  },
  textplaceholder: {
    ...textStyles.smallheading,
    fontSize: scale(12),
    color: colors.text_primary_color,
    backgroundColor: '#0000',

    includeFontPadding: false,
    textAlign: 'left',
  },
  Row: {
    borderWidth: 1,
    borderRadius: scale(5),
    borderColor: colors.divide_color,
    paddingHorizontal: scale(10),
    height: scale(40),
    alignItems: 'center',
    marginTop: scale(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  main_view: {
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
  },
  upLoadText: {
    ...textStyles.smallheading,
    padding: scale(10),
    alignSelf: 'center',
    color: colors.dark_primary_color,
    textAlign: 'center',
  },
  cancel_button: {
    marginTop: verticalScale(8),
    marginBottom: verticalScale(16),
    borderRadius: scale(14),
    height: verticalScale(34),
    alignItems: 'center',
    width: 250,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonStyle: {
    borderColor: colors.divide_color,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: scale(10),
    width: AppScreenWidth,
    borderRadius: scale(5),
    height: verticalScale(40),
  },
});
