import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {downloadFile} from '../../helpers';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {scale, verticalScale} from 'react-native-size-matters';
import {useSelector} from 'react-redux';
import {timeSheetDetailsById} from '../../api';
import CustomHeader from '../../components/CustomHeader';
import DrawLine from '../../components/DrawLine';
import Spacer from '../../components/Spacer';
import CustomStatusBar from '../../components/StatusBar';
import {AppScreenWidth} from '../../constants/sacling';
import {colors} from '../../constants/theme';
import {commonStyles, textStyles} from '../../styles';
import CommentsBox from './CommentsBox';
import WeeklySummary from './Summary';
import TimeSheetItem from './TimeSheetItem';
const DetailsSheetScreen = ({navigation, route}) => {
  const {user} = useSelector(state => state.LoginReducer);
  const [loading, setLoading] = useState(true);
  const [time_sheet_details, setTimeSheetDetails] = useState(null);
  const [logs, setLogs] = useState([]);
  const [time_types, setTimeTypes] = useState([]);
  const [error, setError] = useState(false);
  const [ext, setExt] = useState(null);
  const [filepath, setFilePath] = useState({
    path: null,
    ext: null,
    name: null,
  });
  let item = route.params.item;
  const status = item.module_status_name;
  const getFileExtention = fileUrl => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
  };
  useEffect(() => {
    timeSheetDetailsById(item.time_sheet_id, user.account_id)
      .then(response => {
        if (response.status === 200) {
          console.log('[response]', response);
          if (response.data.data.document_file !== null) {
            setFilePath({
              ...filepath,
              path: response.data?.data?.document_file,
              // path: `https://storage.googleapis.com/recruitbpm-document/ghauritech/${response.data.data.document_file}`,
              name: response.data.data.document_title,
            });
          }

          let data = groupBy(response.data.logs, 'type');
          console.log(data, 'dddddd');
          setTimeSheetDetails(response.data.data);
          setTimeTypes(response.data.time_types);
          setLogs(Object.entries(data));
          setLoading(false);
          let ext1 = getFileExtention(
            'https://storage.googleapis.com/recruitbpm-document/production/' +
              response.data?.data?.document_file,
          );

          setExt(ext1);
        } else {
          console.log('errr', response.status);
          setError(true);
        }
      })
      .catch(err => {
        console.log(err);
        setError(true);
      });
  }, []);

  function groupBy(arr, property) {
    return arr.reduce(function (memo, x) {
      if (!memo[x[property]]) {
        memo[x[property]] = [];
      }
      memo[x[property]].push(x);
      return memo;
    }, {});
  }

  let getMonday = d => {
    d = new Date(d);
    var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff)).toDateString();
  };
  const handleClick = title => {};
  if (loading || time_sheet_details === null) {
    return (
      <SafeAreaProvider>
        <CustomStatusBar />
        <View style={commonStyles.container}>
          <CustomHeader
            show_backButton={true}
            isdrawer={false}
            onPress={() => navigation.goBack()}
            title={'Details TimeSheet'}
          />
          <Spacer height={AppScreenWidth} />
          <ActivityIndicator size={'large'} color={colors.dark_primary_color} />
        </View>
      </SafeAreaProvider>
    );
  }
  if (error) {
    return (
      <SafeAreaProvider>
        <CustomStatusBar />
        <View style={commonStyles.container}>
          <CustomHeader
            show_backButton={true}
            isdrawer={false}
            onPress={() => navigation.goBack()}
            title={'Details TimeSheet'}
          />
          <Spacer height={AppScreenWidth / 2} />
          <Image
            source={require('../../assets/images/error.gif')}
            style={{
              width: verticalScale(150),
              height: verticalScale(150),
              resizeMode: 'contain',
            }}
          />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <CustomStatusBar />
      <SafeAreaView style={commonStyles.container}>
        <CustomHeader
          show_backButton={true}
          isdrawer={false}
          onPress={() => navigation.goBack()}
          title={'TimeSheet Detail'}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          <TimeSheetItem
            time={
              item.time_sheet_view == 'Week'
                ? 'Week Starts at ' + getMonday(item.log_date)
                : 'Day ' + new Date(item.log_date).toDateString()
            }
            // time={`${item.time_sheet_view} Starts At ${item?.log_date}`}
            name={`${item.job_title} - ${time_sheet_details?.company_name}`}
            submittedto={`Time Approver Manager - ${item?.u_approver_name}`}
            // contactname={`Contact Manager - ${time_sheet_details?.contact_name}`}
            status={item.module_status_name}
            status_style={item.status_colour_code}
            onPress={() => {}}
          />

          <WeeklySummary
            editable={status === 'Draft' ? true : false}
            logs={logs}
            time_types={time_types}
          />

          <View style={{width: AppScreenWidth}}>
            <Text style={{...textStyles.smallheading, color: '#0090FF'}}>
              Comments
            </Text>
            <DrawLine marginTop={scale(5)} />
            <DrawLine marginTop={scale(1)} />
            <CommentsBox
              title={'Approver Comment'}
              name={'Approver'}
              disable={true}
              comment={
                time_sheet_details.approver_comments === ''
                  ? null
                  : time_sheet_details.approver_comments
              }
            />
            <CommentsBox
              title={'Submitter Comment'}
              disable={true}
              name={time_sheet_details.comments}
              comment={time_sheet_details.comments}
            />

            {/* <CommentsBox
              title={'Document Attached'}
              disable={false}
              comment={time_sheet_details.document_title}
              onPress={() => handleClick(time_sheet_details.document_title)}
            /> */}
            <TouchableOpacity
              disabled={!time_sheet_details?.document_file}
              style={{width: 200, height: 50}}
              onPress={() => {
                if (
                  ext == 'png' ||
                  ext == 'jpg' ||
                  ext == 'gif' ||
                  ext == 'jpeg' ||
                  ext == 'webp'
                ) {
                  navigation.navigate('Preview', {
                    file:
                      'https://storage.googleapis.com/recruitbpm-document/' +
                      'production' +
                      '/' +
                      time_sheet_details.document_file,
                  });
                } else {
                  if (
                    ext == 'doc' ||
                    ext == 'docx' ||
                    ext == 'pdf' ||
                    ext == 'rtf'
                  ) {
                    let url =
                      'https://storage.googleapis.com/recruitbpm-document/' +
                      'production' +
                      '/' +
                      time_sheet_details.document_file;

                    Alert.alert(
                      'Attention!',
                      'Do you want to download the file?',
                      [
                        {
                          text: 'Cancel',
                          onPress: () => {},
                          style: 'cancel',
                        },
                        {
                          text: 'Download',
                          onPress: () => {
                            downloadFile(url);
                          },
                        },
                      ],
                    );
                  } else {
                    null;
                  }
                }
              }}>
              {ext == 'pdf' ? (
                <AntDesign
                  name={'pdffile1'}
                  color={'red'}
                  size={30}
                  style={{margin: 6}}
                />
              ) : ext == 'doc' ||
                ext == 'docx' ||
                ext == 'rtf' ||
                ext == 'txt' ? (
                <AntDesign
                  name={'wordfile1'}
                  color={'blue'}
                  size={30}
                  style={{margin: 6}}
                />
              ) : ext == 'png' ||
                ext == 'jpg' ||
                ext == 'gif' ||
                ext == 'jpeg' ||
                ext == 'webp' ? (
                <Image
                  style={styles.imageStyle}
                  source={{
                    uri:
                      'https://storage.googleapis.com/recruitbpm-document/' +
                      'production' +
                      '/' +
                      time_sheet_details.document_file,
                  }}
                />
              ) : (
                <Text>No attachment availabe!</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default DetailsSheetScreen;
const styles = StyleSheet.create({
  imageStyle: {
    width: 50,
    height: 50,
  },
});
