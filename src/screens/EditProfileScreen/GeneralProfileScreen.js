import axios from 'axios';
import React, {useEffect, useReducer, useState} from 'react';
import UpLoadComponent from '../../components/Uploadcomponent';
import {
  Alert,
  backgroundColor,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {scale, verticalScale} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import CustomButton from '../../components/Button';
import CreateCertificationItem from '../../components/CreateCertificationItem';
import CreateEducationItem from '../../components/CreateEducationItem';
import CreateExperinceItem from '../../components/CreateExperinceItem';
import RenderHTMLComponent from '../../components/RenderHtmlText';
import CustomTextInput from '../../components/TextInput';
import {colors, fonts} from '../../constants/theme';
import {UpdateData} from '../../store/actions/LoginActions';
import {commonStyles, textStyles} from '../../styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

ExperienceSection = ({data}) => {
  const onDelete = id => {
    let config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: `https://api.recruitbpm.com/experiences/${id}`,
      headers: {
        Authorization: 'Bearer 4545980ce66bd555d903f7dc739f91e631606eb1',
      },
    };

    axios
      .request(config)
      .then(response => {
        Alert.alert('Experience deleted successfuly');
      })
      .catch(error => {
        console.log(error);
      });
  };
  return (
    <View style={{}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',

          marginTop: verticalScale(10),
        }}>
        <Text
          style={{
            fontSize: scale(16),
            fontFamily: fonts.Medium,
            color: '#343434',
          }}>
          Experience
        </Text>
      </View>
      {data.map((item, index) => {
        return (
          <CreateExperinceItem
            key={`${index}`}
            index={`${index}`}
            item={item}
            onDelete={() => onDelete(item.candidate_experience_id)}
          />
        );
      })}
    </View>
  );
};

EducationSection = ({data}) => {
  const onDelete = id => {
    let config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: `https://api.recruitbpm.com/education/${id}`,
      headers: {
        Authorization: 'Bearer 4545980ce66bd555d903f7dc739f91e631606eb1',
      },
    };

    axios
      .request(config)
      .then(response => {
        console.log(JSON.stringify(response.data));
        Alert.alert('Education Deleted successfully');
      })
      .catch(error => {
        console.log(error);
      });
  };
  return (
    <View style={{}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',

          marginTop: verticalScale(10),
        }}>
        <Text
          style={{
            fontSize: scale(16),
            fontFamily: fonts.Medium,
            color: '#343434',
          }}>
          Education
        </Text>
      </View>
      {data.map((item, index) => {
        return (
          <CreateEducationItem
            key={`${index}`}
            onDelete={() => onDelete(item.candidate_education_id)}
            index={`${index}`}
            item={item}
          />
        );
      })}
    </View>
  );
};

CertificationSection = ({data}) => {
  const onDelete = id => {
    let config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: `https://api.recruitbpm.com/certifications/${id}`,
      headers: {
        Authorization: 'Bearer 4545980ce66bd555d903f7dc739f91e631606eb1',
      },
    };

    axios
      .request(config)
      .then(response => {
        Alert.alert('Certificate Deleted');
        console.log(JSON.stringify(response.data));
      })
      .catch(error => {
        console.log(error);
      });
  };
  return (
    <View style={{}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',

          marginTop: verticalScale(10),
        }}>
        <Text
          style={{
            fontSize: scale(16),
            fontFamily: fonts.Medium,
            color: '#343434',
          }}>
          Certifications
        </Text>
      </View>
      {data.map((item, index) => {
        return (
          <CreateCertificationItem
            key={`${index}`}
            index={`${index}`}
            item={item}
            onDelete={() => onDelete(item.candidate_certification_id)}
          />
        );
      })}
    </View>
  );
};
const GeneralProfileScreen = ({navigation}) => {
  const {user} = useSelector(state => state.LoginReducer);

  const [userProfile, setUserProfile] = useState(null);
  // let item = route.params;
  const initialState = {
    firstName: user?.first_name,
    lastName: user?.last_name,
    primaryEmail: user?.email1,
    phone: user?.phone_direct,
    address: user?.address,
    city: user?.state_name,
    profilePicture: user?.profile_picture,
    companyName: user?.company_name,
    // upload_file: {
    //   name: item.document_link,
    //   mime_type: 'application/pdf',
    //   content: '',
    // },
  };
  const [filepath, setFilePath] = useState({
    name: '',
  });
  const [profileData, dispatch] = useReducer(reducer, initialState);
  const dispatch_dd = useDispatch();
  const UpdateDataLocal = data => dispatch_dd(UpdateData(data));
  const [is_Editabe, setisEditable] = useState(false);
  const [experiences, setExperiences] = useState(null);
  const [educations, setEducation] = useState(null);
  const [certifications, setCertifications] = useState(null);
  function reducer(state, action) {
    switch (action.type) {
      case 'firstName':
        return {...state, firstName: action.payload};
      case 'lastName':
        return {...state, lastName: action.payload};
      case 'primaryEmail':
        return {...state, primaryEmail: action.payload};
      case 'phone':
        return {...state, phone: action.payload};
      case 'address':
        return {...state, address: action.payload};
      case 'city':
        return {...state, city: action.payload};
      case 'profilePicture':
        return {...state, profilePicture: action.payload};
      default:
        return initialState;
    }
  }

  useEffect(() => {
    getExperience();
    getEducation();
    getCertificate();
    getProfileInfo();
  }, []);

  const getExperience = () => {
    let config = {
      method: 'get',
      // maxBodyLength: Infinity,
      url: `https://api.recruitbpm.com/experiences?search={"candidate_id":${user?.candidate_id}`,
      headers: {
        Authorization: 'Bearer 4545980ce66bd555d903f7dc739f91e631606eb1',
      },
    };

    axios
      .request(config)
      .then(response => {
        setExperiences(response?.data?._embedded.Experiences);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getProfileInfo = () => {
    let data = new FormData();

    let config = {
      method: 'get',
      url: `https://api.recruitbpm.com/users/${user?.candidate_owner_id}`,
      headers: {
        Authorization: 'Bearer 4545980ce66bd555d903f7dc739f91e631606eb1',
      },
      data: data,
    };

    axios
      .request(config)
      .then(response => {
        console.log('Profile information ======>', response.data);
      })
      .catch(error => {
        console.log('getProfileInfo', error.response);
      });
  };

  const getEducation = () => {
    let config = {
      method: 'get',
      url: `https://api.recruitbpm.com/education?search={"candidate_id":${user?.candidate_id}}`,
      headers: {
        Authorization: 'Bearer 4545980ce66bd555d903f7dc739f91e631606eb1',
      },
    };

    axios
      .request(config)
      .then(response => {
        console.log(response);
        setEducation(response.data._embedded.Education);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getCertificate = () => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://api.recruitbpm.com/certifications?search={"candidate_id":${user?.candidate_id}}`,
      headers: {
        Authorization: 'Bearer 4545980ce66bd555d903f7dc739f91e631606eb1',
      },
    };

    axios
      .request(config)
      .then(response => {
        setCertifications(response.data._embedded.Certifications);
      })
      .catch(error => {
        console.log(error);
      });
  };
  const UpdateUserProfile = () => {
    console.log('[============Profile Image]', filepath);
    let data = {
      candidate_id: user.candidate_id,
      first_name: profileData.firstName,
      last_name: profileData.lastName,
      address: profileData.address,
      city: profileData.city,
      phone_direct: profileData.phone,
      country_name: user.country_name,
      module_status_id: '1',
      state_name: profileData.city,
      zipcode: 46000,
      profile_summary: '',
      profile_picture: {
        name: filepath.name,
        mime_type: `${filepath.ext}`,
        content: filepath.base64,
      },
    };
    let config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: `https://api.recruitbpm.com/candidates/${user?.candidate_id}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer 4545980ce66bd555d903f7dc739f91e631606eb1',
      },
      data: JSON.stringify(data),
    };

    axios
      .request(config)
      .then(response => {
        console.log('[edit profile data]', response.data);
        setUserProfile(
          'https://storage.googleapis.com/recruitbpm-document/' +
            'production/' +
            response.data.data.profile_picture,
        );
        saveProfilePicture(
          // 'https://storage.googleapis.com/recruitbpm-document/' +
          //   'production/' +
          //   response.data.data.profile_picture,
          'https://picsum.photos/200/300',
        );
        UpdateDataLocal({...user, ...data});
        Alert.alert('Profile Updated', response?.data?.message);
        setisEditable(false);
      })
      .catch(error => {
        console.log('[error]', error.response);
        Alert.alert('Profile Update Fialed', JSON.stringify(error.message));
      });
  };

  const saveProfilePicture = image => {
    AsyncStorage.setItem('ProfileImage', image)
      .then(res => {
        console.log('[res]', res);
      })
      .catch(err => {
        console.log('[err]', err);
      });
  };

  useEffect(() => {
    console.log('[userProfile]', userProfile);
  }, [userProfile]);

  if (!is_Editabe) {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
        <View style={commonStyles.container}>
          <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                width: wp(100),
                height: hp(45),
              }}>
              <ImageBackground
                blurRadius={50}
                style={{
                  width: wp(100),
                  height: hp(45),
                }}
                resizeMode={'cover'}
                source={require('../../assets/images/dp.jpg')}>
                <View
                  style={{
                    justifyContent: 'flex-end',
                    flex: 1,
                    padding: 25,
                    paddingBottom: hp(7),
                    alignItems: 'flex-start',
                  }}>
                  <Image
                    style={{
                      width: wp(35),
                      height: wp(35),
                      alignSelf: 'center',

                      marginBottom: wp(5),
                      borderRadius: wp(50),
                    }}
                    resizeMode={'cover'}
                    onError={error => {
                      console.log('[error image]', error);
                    }}
                    source={{
                      uri: !userProfile
                        ? userProfile
                        : 'https://picsum.photos/200/300',
                    }}
                    // source={require('../../assets/images/dp.jpg')}
                  />
                  <Text style={styles.profileInfoText}>
                    Name: {user?.first_name} {user?.last_name}
                  </Text>
                  <Text style={styles.profileInfoText}>
                    Email: {user?.email1}
                  </Text>
                  <Text style={styles.profileInfoText}>
                    Phone: {user?.phone_direct}
                  </Text>
                  <Text style={styles.profileInfoText}>
                    Address: {user?.address}
                  </Text>
                </View>
              </ImageBackground>
            </View>

            <View style={styles.Card}>
              <RenderHTMLComponent htmlData={`${user?.profile_summary}`} />
              <Text
                style={{
                  ...textStyles.Label,
                  textAlign: 'justify',
                  color: colors.secondary_text_color,
                }}></Text>
              {experiences != null && <ExperienceSection data={experiences} />}
              {educations != null && <EducationSection data={educations} />}
              {certifications != null && (
                <CertificationSection data={certifications} />
              )}
            </View>
          </ScrollView>
        </View>
        <TouchableOpacity
          onPress={() => setisEditable(true)}
          style={styles.EditButton}>
          <AntDesign
            name={'edit'}
            size={widthPercentageToDP(8)}
            color={colors.white}
          />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{
        flex: 1,
        paddingTop: wp(10),
        backgroundColor: '#fff',
        marginBottom: wp(10),
      }}>
      <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
        <StatusBar barStyle={'light-content'} />
        <View style={commonStyles.container}>
          <View
            style={{
              alignItems: 'center',
              flex: 1,
            }}>
            {/* <UpLoadComponent is_profile_picture={true} /> */}
            <Image
              style={{
                width: wp(30),
                height: wp(30),
                marginVertical: wp(5),
                // tintColor:colors.dark_primary_color,
                borderRadius: wp(15),
                marginBottom: wp(10),
              }}
              // source={require('../../assets/images/dummy.png')}
              source={filepath}
            />
          </View>
          <CustomTextInput
            placeholder={'First Name *'}
            value={profileData.firstName}
            borderWidth={1}
            lableColor={colors.dark_primary_color}
            borderRadius={scale(5)}
            onChangeText={text => {
              dispatch({type: 'firstName', payload: text});
            }}
            errorMessage={''}
          />
          <CustomTextInput
            placeholder={'Last Name *'}
            value={profileData.lastName}
            borderWidth={1}
            lableColor={colors.dark_primary_color}
            borderRadius={scale(5)}
            onChangeText={text => {
              dispatch({type: 'lastName', payload: text});
            }}
            errorMessage={''}
          />

          <CustomTextInput
            style={styles.inputcolor}
            placeholder={'Primary Email *'}
            value={profileData.primaryEmail}
            // backgroundColor={'#0073B4'}
            backgroundColor={colors.label_color}
            editable={false}
            borderWidth={1}
            lableColor={colors.dark_primary_color}
            borderRadius={scale(5)}
            onChangeText={text => {
              dispatch({type: 'primaryEmail', payload: text});
            }}
            errorMessage={''}
          />

          <CustomTextInput
            placeholder={'Phone (Direct)'}
            value={profileData.phone}
            borderWidth={1}
            lableColor={colors.dark_primary_color}
            borderRadius={scale(5)}
            onChangeText={text => {
              dispatch({type: 'phone', payload: text});
            }}
            errorMessage={''}
          />

          <CustomTextInput
            placeholder={'Address'}
            value={profileData.address}
            borderWidth={1}
            lableColor={colors.dark_primary_color}
            borderRadius={scale(5)}
            onChangeText={text => {
              dispatch({type: 'address', payload: text});
            }}
            errorMessage={''}
          />
          <CustomTextInput
            placeholder={'City'}
            value={profileData.city}
            borderWidth={1}
            lableColor={colors.dark_primary_color}
            borderRadius={scale(5)}
            onChangeText={text => {
              dispatch({type: 'city', payload: text});
            }}
            errorMessage={''}
          />
          <UpLoadComponent
            is_profile_image={false}
            title={'Upload picture'}
            filepath={filepath}
            setFilePath={file => {
              setFilePath(file);
            }}
          />
          <CustomButton
            loading={false}
            loadingText={'Saving'}
            onPress={() => UpdateUserProfile(false)}
            text={'Save'}
          />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default GeneralProfileScreen;

const styles = StyleSheet.create({
  EditButton: {
    alignSelf: 'flex-end',
    backgroundColor: colors.dark_primary_color,
    paddingHorizontal: widthPercentageToDP(2),
    paddingVertical: widthPercentageToDP(2),
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: widthPercentageToDP(14),
    height: widthPercentageToDP(14),
    borderRadius: widthPercentageToDP(10),
    right: widthPercentageToDP(2),
    bottom: widthPercentageToDP(10),
  },
  profileInfoText: {
    ...textStyles.Label,
    fontSize: scale(12),
    color: '#fff',
    width: widthPercentageToDP(88),
    paddingVertical: wp(1),

    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,.2)',
    marginBottom: 2,
  },
  inputcolor: {
    backgroundColor: colors.label_color,
  },
  Card: {
    borderTopLeftRadius: 25,
    elevation: 10,
    borderTopRightRadius: 25,
    backgroundColor: '#fff',
    flex: 1,
    padding: 25,
    width: wp(100),
    marginTop: hp(-5),
  },
  ActionButtonRows: {
    borderTopRightRadius: scale(5),
    overflow: 'hidden',
    borderBottomRightRadius: scale(5),
    justifyContent: 'space-evenly',
    backgroundColor: 'red',
    alignItems: 'center',
    marginVertical: scale(5),
  },
  ActionButton: {
    paddingHorizontal: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#e6a020',
  },
  EducationMainView: {
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,.03)',

    paddingVertical: verticalScale(8),
  },
  ImageView: {
    width: wp(15),
    height: wp(15),
    // tintColor:colors.dark_primary_color,
    borderRadius: wp(15),
  },
  job_tiltetext: {
    fontFamily: fonts.Medium,
    fontSize: scale(14),
    includeFontPadding: false,
    color: '#191919',
  },
  Addresstext: {
    fontFamily: fonts.Medium,
    fontSize: scale(12),
    includeFontPadding: false,
    color: '#191919',
  },
  date: {
    fontFamily: fonts.Medium,
    fontSize: scale(11),
    includeFontPadding: false,
  },
});

// import axios from 'axios';
// import moment from 'moment';
// import React, {useEffect, useReducer, useState} from 'react';
// import {
//   Alert,
//   Image,
//   ImageBackground,
//   KeyboardAvoidingView,
//   Platform,
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import {
//   heightPercentageToDP as hp,
//   widthPercentageToDP,
//   widthPercentageToDP as wp,
// } from 'react-native-responsive-screen';
// import {scale, verticalScale} from 'react-native-size-matters';
// import AntDesign from 'react-native-vector-icons/AntDesign';

// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import {useDispatch, useSelector} from 'react-redux';
// import CustomButton from '../../components/Button';
// import RenderHTMLComponent from '../../components/RenderHtmlText';
// import CustomTextInput from '../../components/TextInput';
// import UpLoadComponent from '../../components/Uploadcomponent';
// import {colors, fonts} from '../../constants/theme';
// import {Login, UpdateData} from '../../store/actions/LoginActions';
// import {commonStyles, textStyles} from '../../styles';

// const CreateExperinceItem = ({item, index}) => {
//   return (
//     <TouchableOpacity key={`${index}`} style={styles.EducationMainView}>
//       <View
//         style={{
//           alignItems: 'center',
//           justifyContent: 'center',
//         }}>
//         <Image
//           style={styles.ImageView}
//           source={require('../../assets/images/job.png')}
//         />
//       </View>
//       <View style={{marginLeft: scale(15), width: '80%'}}>
//         <Text style={styles.job_tiltetext}>{item.job_title}</Text>
//         <Text style={styles.Addresstext}>{item.job_duties}</Text>

//         <Text style={styles.date}>
//           {`${moment(item.experience_start_date).format('MMM YYYY')} -`}
//           {item.is_currently_working === '1'
//             ? 'Present'
//             : `${moment(item.experience_end_date).format('MMM YYYY')}`}
//           {'  •  '}

//           {item.is_currently_working == '1'
//             ? moment(item.experience_start_date).fromNow()
//             : moment([item.experience_start_date]).from(
//                 moment([item.experience_end_date]),
//               )}
//         </Text>
//       </View>
//     </TouchableOpacity>
//   );
// };
// const CreateEducationItem = ({item, index}) => {
//   return (
//     <TouchableOpacity key={`${index}`} style={styles.EducationMainView}>
//       <View
//         style={{
//           alignItems: 'center',
//           justifyContent: 'center',
//         }}>
//         <Image
//           style={styles.ImageView}
//           source={require('../../assets/images/study.png')}
//         />
//       </View>
//       <View style={{marginLeft: scale(15), width: '80%'}}>
//         <Text style={styles.job_tiltetext}>{item.education_title}</Text>
//         <Text style={styles.Addresstext}>{item.education_details}</Text>

//         <Text style={styles.date}>
//           {`${moment(item.education_start_date).format('MMM YYYY')} - `}
//           {item.is_currently_studying === '1'
//             ? 'Present  '
//             : `${moment(item.education_end_date).format('MMM YYYY')}`}

//           {item.is_currently_studying === '1'
//             ? item.is_currently_studying === '1'
//               ? moment().fromNow()
//               : moment([item.education_end_date]).from(
//                   moment([item.education_start_date]),
//                 )
//             : null}
//         </Text>
//       </View>
//     </TouchableOpacity>
//   );
// };
// const CreateCertificationItem = ({item, index}) => {
//   console.log(item);
//   return (
//     <View key={`${index}`} style={styles.EducationMainView}>
//       <View style={styles.ImageView}>
//         <FontAwesome5
//           color={colors.dark_primary_color}
//           name={'medal'}
//           size={scale(40)}
//         />
//       </View>
//       <View style={{marginLeft: scale(15), width: '80%'}}>
//         <Text
//           numberOfLines={1}
//           ellipsizeMode={'middle'}
//           style={styles.job_tiltetext}>
//           {item.certificate_type}
//         </Text>
//         <Text
//           numberOfLines={1}
//           ellipsizeMode={'middle'}
//           style={styles.Addresstext}>
//           {item.certification_name} - {item.certification_no}
//         </Text>
//         <View style={{flexDirection: 'row'}}>
//           <Text style={styles.date}>{item.expiry_date}</Text>
//           <Text style={{...styles.date, marginRight: scale(0)}}>-</Text>
//           <Text
//             style={{
//               ...styles.date,
//               color: '#fff',
//               width: 75,
//               textAlign: 'center',
//               borderRadius: 4,

//               marginLeft: scale(10),
//               backgroundColor: moment().isAfter(moment(item.expiry_date))
//                 ? 'red'
//                 : 'green',
//             }}>
//             {' '}
//             {moment().isAfter(moment(item.expiry_date)) ? 'Expire' : 'Valid'}
//           </Text>
//         </View>
//       </View>
//     </View>
//   );
// };
// CertificationSection = ({data}) => {
//   return (
//     <View style={{}}>
//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',

//           marginTop: verticalScale(10),
//         }}>
//         <Text
//           style={{
//             fontSize: scale(16),
//             fontFamily: fonts.Medium,
//             color: '#343434',
//           }}>
//           Certifications
//         </Text>
//       </View>
//       {data.map((item, index) => {
//         return (
//           <CreateCertificationItem
//             key={`${index}`}
//             index={`${index}`}
//             item={item}
//           />
//         );
//       })}
//     </View>
//   );
// };
// ExperienceSection = ({data}) => {
//   return (
//     <View style={{}}>
//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',

//           marginTop: verticalScale(10),
//         }}>
//         <Text
//           style={{
//             fontSize: scale(16),
//             fontFamily: fonts.Medium,
//             color: '#343434',
//           }}>
//           Experience
//         </Text>
//       </View>
//       {data.map((item, index) => {
//         return (
//           <CreateExperinceItem
//             key={`${index}`}
//             index={`${index}`}
//             item={item}
//           />
//         );
//       })}
//     </View>
//   );
// };

// EducationSection = ({data}) => {
//   return (
//     <View style={{}}>
//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',

//           marginTop: verticalScale(10),
//         }}>
//         <Text
//           style={{
//             fontSize: scale(16),
//             fontFamily: fonts.Medium,
//             color: '#343434',
//           }}>
//           Education
//         </Text>
//       </View>
//       {data.map((item, index) => {
//         return (
//           <CreateEducationItem
//             key={`${index}`}
//             index={`${index}`}
//             item={item}
//           />
//         );
//       })}
//     </View>
//   );
// };
// const GeneralProfileScreen = ({navigation}) => {
//   const {user} = useSelector(state => state.LoginReducer);
//   const initialState = {
//     firstName: user?.first_name,
//     lastName: user?.last_name,
//     primaryEmail: user?.email1,
//     phone: user?.phone_direct,
//     address: user?.address,
//     city: user?.state_name,
//   };
//   const [profileData, dispatch] = useReducer(reducer, initialState);
//   const dispatch_dd = useDispatch();
//   const UpdateDataLocal = data => dispatch_dd(UpdateData(data));
//   const [is_Editabe, setisEditable] = useState(false);
//   const [experiences, setExperiences] = useState(null);
//   const [educations, setEducation] = useState(null);
//   const [certifications, setCertifications] = useState(null);
//   function reducer(state, action) {
//     switch (action.type) {
//       case 'firstName':
//         return {...state, firstName: action.payload};
//       case 'lastName':
//         return {...state, lastName: action.payload};
//       case 'primaryEmail':
//         return {...state, primaryEmail: action.payload};
//       case 'phone':
//         return {...state, phone: action.payload};
//       case 'address':
//         return {...state, address: action.payload};
//       case 'city':
//         return {...state, city: action.payload};
//       default:
//         return initialState;
//     }
//   }

//   useEffect(() => {
//     getExperience();
//     getEducation();
//     getCertificate();
//   }, []);

//   const getExperience = () => {
//     let config = {
//       method: 'get',
//       maxBodyLength: Infinity,
//       url: `https://api.recruitbpm.com/experiences?search={"candidate_id":${user?.candidate_id}}`,
//       headers: {
//         Authorization: 'Bearer 4545980ce66bd555d903f7dc739f91e631606eb1',
//       },
//     };

//     axios
//       .request(config)
//       .then(response => {
//         setExperiences(response.data._embedded.Experiences);
//       })
//       .catch(error => {
//         console.log(error);
//       });
//   };

//   const getEducation = () => {
//     let config = {
//       method: 'get',
//       maxBodyLength: Infinity,
//       url: `https://api.recruitbpm.com/education?search={"candidate_id":${user?.candidate_id}}`,
//       headers: {
//         Authorization: 'Bearer 4545980ce66bd555d903f7dc739f91e631606eb1',
//       },
//     };

//     axios
//       .request(config)
//       .then(response => {
//         setEducation(response.data._embedded.Education);
//       })
//       .catch(error => {
//         console.log(error);
//       });
//   };
//   const getCertificate = () => {
//     let config = {
//       method: 'get',
//       maxBodyLength: Infinity,
//       url: `https://api.recruitbpm.com/certifications`,
//       headers: {
//         Authorization: 'Bearer 4545980ce66bd555d903f7dc739f91e631606eb1',
//       },
//     };

//     axios
//       .request(config)
//       .then(response => {
//         setCertifications(response.data._embedded.Certifications.slice(0, 4));
//       })
//       .catch(error => {
//         console.log(error);
//       });
//   };
//   const UpdateUserProfile = () => {
//     let data = {
//       user_id: user?.candidate_id,
//       account_id: user?.account_id,
//       email1: profileData.primaryEmail,
//       email2: profileData.primaryEmail,
//       first_name: profileData.firstName,
//       last_name: profileData.lastName,
//       address: profileData.address,
//       city: profileData.city,
//       phone_direct: profileData.phone,
//       fax: '534',
//       pay_type_id: 1,
//       tax_term_id: 1,
//       visa_status_id: 1,
//       travel_requirement_id: 1,
//       country_name: user?.country_name,
//       module_status_id: '1',
//       state_name: profileData.city,
//       zipcode: 46000,
//       mobile: '321',
//     };

//     let config = {
//       method: 'put',
//       maxBodyLength: Infinity,
//       url: `https://api.recruitbpm.com/candidates/${user?.candidate_id}`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer 4545980ce66bd555d903f7dc739f91e631606eb1',
//         Cookie: 'PHPSESSID=3cnnslaaklmlqjq1slj3uvp2cl',
//       },
//       data: data,
//     };

//     axios
//       .request(config)
//       .then(response => {
//         UpdateDataLocal(response.data.data);
//         Alert.alert('Profile Updated', response.data.message);
//         setisEditable(false);
//       })
//       .catch(error => {
//         Alert.alert('Profile Update Fialed', JSON.stringify(error.message));
//       });
//   };
//   if (!is_Editabe) {
//     return (
//       <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
//         <View style={commonStyles.container}>
//           <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
//             <View
//               style={{
//                 flex: 1,
//                 alignItems: 'center',
//                 width: wp(100),
//                 height: hp(45),
//               }}>
//               <ImageBackground
//                 blurRadius={50}
//                 style={{
//                   width: wp(100),
//                   height: hp(45),
//                 }}
//                 resizeMode={'cover'}
//                 source={require('../../assets/images/dp.jpg')}>
//                 <View
//                   style={{
//                     justifyContent: 'flex-end',
//                     flex: 1,
//                     padding: 25,
//                     paddingBottom: hp(7),
//                     alignItems: 'flex-start',
//                   }}>
//                   <Image
//                     style={{
//                       width: wp(35),
//                       height: wp(35),
//                       alignSelf: 'center',

//                       marginBottom: wp(5),
//                       borderRadius: wp(50),
//                     }}
//                     resizeMode={'cover'}
//                     source={require('../../assets/images/dp.jpg')}
//                   />
//                   <Text style={styles.profileInfoText}>
//                     Name: {user?.first_name} {user?.last_name}
//                   </Text>
//                   <Text style={styles.profileInfoText}>
//                     Email: {user?.email1}
//                   </Text>
//                   <Text style={styles.profileInfoText}>
//                     Phone: {user?.phone_direct}
//                   </Text>
//                   <Text style={styles.profileInfoText}>
//                     Address: {user?.address}
//                   </Text>
//                 </View>
//               </ImageBackground>
//             </View>

//             <View style={styles.Card}>
//               <RenderHTMLComponent htmlData={`${user?.profile_summary}`} />
//               <Text
//                 style={{
//                   ...textStyles.Label,
//                   textAlign: 'justify',
//                   color: colors.secondary_text_color,
//                 }}></Text>
//               {experiences != null && <ExperienceSection data={experiences} />}
//               {educations != null && <EducationSection data={educations} />}
//               {certifications != null && (
//                 <CertificationSection data={certifications} />
//               )}
//             </View>
//           </ScrollView>
//         </View>
//         <TouchableOpacity
//           onPress={() => setisEditable(true)}
//           style={styles.EditButton}>
//           <AntDesign
//             name={'edit'}
//             size={widthPercentageToDP(8)}
//             color={colors.white}
//           />
//         </TouchableOpacity>
//       </SafeAreaView>
//     );
//   }
//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       style={{
//         flex: 1,
//         paddingTop: wp(10),
//         backgroundColor: '#fff',
//         marginBottom: wp(10),
//       }}>
//       <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
//         <StatusBar barStyle={'light-content'} />
//         <View style={commonStyles.container}>
//           {/* <View
//               style={{
//                 alignItems: 'center',
//                 flex: 1,
//               }}>
//               <Image
//                 style={{
//                   width: wp(30),
//                   height: wp(30),
//                   marginVertical: wp(5),
//                   // tintColor:colors.dark_primary_color,
//                   borderRadius: wp(15),
//                 }}
//                 source={require('../../assets/images/dummy.png')}
//               />
//               <UpLoadComponent is_profile_image={true} />
//             </View> */}
//           <CustomTextInput
//             placeholder={'First Name *'}
//             value={profileData.firstName}
//             borderWidth={1}
//             lableColor={colors.dark_primary_color}
//             borderRadius={scale(5)}
//             onChangeText={text => {
//               dispatch({type: 'firstName', payload: text});
//             }}
//             errorMessage={''}
//           />
//           <CustomTextInput
//             placeholder={'Last Name *'}
//             value={profileData.lastName}
//             borderWidth={1}
//             lableColor={colors.dark_primary_color}
//             borderRadius={scale(5)}
//             onChangeText={text => {
//               dispatch({type: 'lastName', payload: text});
//             }}
//             errorMessage={''}
//           />
//           <CustomTextInput
//             placeholder={'Primary Email *'}
//             value={profileData.primaryEmail}
//             borderWidth={1}
//             lableColor={colors.dark_primary_color}
//             borderRadius={scale(5)}
//             onChangeText={text => {
//               dispatch({type: 'primaryEmail', payload: text});
//             }}
//             errorMessage={''}
//           />
//           <CustomTextInput
//             placeholder={'Phone (Direct)'}
//             value={profileData.phone}
//             borderWidth={1}
//             lableColor={colors.dark_primary_color}
//             borderRadius={scale(5)}
//             onChangeText={text => {
//               dispatch({type: 'phone', payload: text});
//             }}
//             errorMessage={''}
//           />
//           <CustomTextInput
//             placeholder={'Address'}
//             value={profileData.address}
//             borderWidth={1}
//             lableColor={colors.dark_primary_color}
//             borderRadius={scale(5)}
//             onChangeText={text => {
//               dispatch({type: 'address', payload: text});
//             }}
//             errorMessage={''}
//           />
//           <CustomTextInput
//             placeholder={'City'}
//             value={profileData.city}
//             borderWidth={1}
//             lableColor={colors.dark_primary_color}
//             borderRadius={scale(5)}
//             onChangeText={text => {
//               dispatch({type: 'city', payload: text});
//             }}
//             errorMessage={''}
//           />

//           <CustomButton
//             loading={false}
//             loadingText={'Saving'}
//             onPress={() => UpdateUserProfile(false)}
//             text={'Save'}
//           />
//         </View>
//       </SafeAreaView>
//     </KeyboardAvoidingView>
//   );
// };

// export default GeneralProfileScreen;

// const styles = StyleSheet.create({
//   EditButton: {
//     alignSelf: 'flex-end',
//     backgroundColor: colors.dark_primary_color,
//     paddingHorizontal: widthPercentageToDP(2),
//     paddingVertical: widthPercentageToDP(2),
//     position: 'absolute',
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: widthPercentageToDP(14),
//     height: widthPercentageToDP(14),
//     borderRadius: widthPercentageToDP(10),
//     right: widthPercentageToDP(2),
//     bottom: widthPercentageToDP(10),
//   },
//   profileInfoText: {
//     ...textStyles.Label,
//     fontSize: scale(12),
//     color: '#fff',
//     width: widthPercentageToDP(88),
//     paddingVertical: wp(1),

//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(255,255,255,.2)',
//     marginBottom: 2,
//   },
//   Card: {
//     borderTopLeftRadius: 25,
//     elevation: 10,
//     borderTopRightRadius: 25,
//     backgroundColor: '#fff',
//     flex: 1,
//     padding: 25,
//     width: wp(100),
//     marginTop: hp(-5),
//   },
//   ActionButtonRows: {
//     borderTopRightRadius: scale(5),
//     overflow: 'hidden',
//     borderBottomRightRadius: scale(5),
//     justifyContent: 'space-evenly',
//     backgroundColor: 'red',
//     alignItems: 'center',
//     marginVertical: scale(5),
//   },
//   ActionButton: {
//     paddingHorizontal: scale(10),
//     justifyContent: 'center',
//     alignItems: 'center',
//     flex: 1,
//     backgroundColor: '#e6a020',
//   },
//   EducationMainView: {
//     alignItems: 'center',
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(0,0,0,.03)',

//     paddingVertical: verticalScale(8),
//   },
//   ImageView: {
//     width: wp(15),
//     height: wp(15),
//     // tintColor:colors.dark_primary_color,
//     borderRadius: wp(15),
//   },
//   job_tiltetext: {
//     fontFamily: fonts.Medium,
//     fontSize: scale(14),
//     includeFontPadding: false,
//     color: '#191919',
//   },
//   Addresstext: {
//     fontFamily: fonts.Medium,
//     fontSize: scale(12),
//     includeFontPadding: false,
//     color: '#191919',
//   },
//   date: {
//     fontFamily: fonts.Medium,
//     fontSize: scale(11),
//     includeFontPadding: false,
//   },
// });
