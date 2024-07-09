import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { LayoutAnimation, Platform, ScrollView, StyleSheet, UIManager, View, useWindowDimensions, Text, TouchableOpacity, Alert } from 'react-native'
import { TimerPicker } from 'react-native-timer-picker'
import { router, useNavigation, useLocalSearchParams } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import * as Notifications from 'expo-notifications'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import Save from '../../components/Save'
import { db, auth } from '../../utils/config'
import type { AlarmTime } from '../../types/habit'

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true)
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false
  })
})

enum dayOfWeek { Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday }

const weekdayScheduleNotificationAsync = async (hours: number, minutes: number, repeatDayOfWeek: boolean[], habitMission: string): Promise<Array<string | null>> => {
  const identifier = new Array<string | null>(7).fill(null)

  if (repeatDayOfWeek[0]) {
    identifier[0] = await Notifications.scheduleNotificationAsync({
      content: {
        body: habitMission
      },
      trigger: {
        hour: hours,
        minute: minutes,
        weekday: 1,
        repeats: true
      }
    })
  }

  if (repeatDayOfWeek[1]) {
    identifier[1] = await Notifications.scheduleNotificationAsync({
      content: {
        body: habitMission
      },
      trigger: {
        hour: hours,
        minute: minutes,
        weekday: 2,
        repeats: true
      }
    })
  }

  if (repeatDayOfWeek[2]) {
    identifier[2] = await Notifications.scheduleNotificationAsync({
      content: {
        body: habitMission
      },
      trigger: {
        hour: hours,
        minute: minutes,
        weekday: 3,
        repeats: true
      }
    })
  }

  if (repeatDayOfWeek[3]) {
    identifier[3] = await Notifications.scheduleNotificationAsync({
      content: {
        body: habitMission
      },
      trigger: {
        hour: hours,
        minute: minutes,
        weekday: 4,
        repeats: true
      }
    })
  }

  if (repeatDayOfWeek[4]) {
    identifier[4] = await Notifications.scheduleNotificationAsync({
      content: {
        body: habitMission
      },
      trigger: {
        hour: hours,
        minute: minutes,
        weekday: 5,
        repeats: true
      }
    })
  }

  if (repeatDayOfWeek[5]) {
    identifier[5] = await Notifications.scheduleNotificationAsync({
      content: {
        body: habitMission
      },
      trigger: {
        hour: hours,
        minute: minutes,
        weekday: 6,
        repeats: true
      }
    })
  }

  if (repeatDayOfWeek[6]) {
    identifier[6] = await Notifications.scheduleNotificationAsync({
      content: {
        body: habitMission
      },
      trigger: {
        hour: hours,
        minute: minutes,
        weekday: 7,
        repeats: true
      }
    })
  }

  return identifier
}

const requestPermissionsAsync = async (): Promise<void> => {
  const { granted } = await Notifications.getPermissionsAsync()
  if (granted) { return }

  await Notifications.requestPermissionsAsync()
}

const handleSaveAsync = async (alarmTime: AlarmTime, repeatDayOfWeek: boolean[], habitItemId: string, habitMission: string): Promise<void> => {
  if (auth.currentUser === null) { return } // currentUserがnullの場合は保存しない

  const refToUserHabitsAlarms = collection(db, `users/${auth.currentUser.uid}/habits/${habitItemId}/alarms`)
  await addDoc(refToUserHabitsAlarms, {
    alarmTime,
    repeatDayOfWeek,
    updatedAt: Timestamp.fromDate(new Date()),
    alarmIdentifier: await weekdayScheduleNotificationAsync(alarmTime.hours, alarmTime.minutes, repeatDayOfWeek, habitMission)
  })
    .then(() => {
      router.back()
    })

    .catch((error: string) => {
      Alert.alert('保存できませんでした')
      console.log(error)
    })
}

const handlePressRepeatDayOfWeek = (repeatDayOfWeek: boolean[], dayOfWeek: dayOfWeek, setRepeatDayOfWeek: React.Dispatch<React.SetStateAction<any[]>>): void => {
  const updatedRepeatDayOfWeek: boolean[] = [...repeatDayOfWeek]
  updatedRepeatDayOfWeek[dayOfWeek] = (!repeatDayOfWeek[dayOfWeek])
  setRepeatDayOfWeek(updatedRepeatDayOfWeek)
}

const AddAlarm = (): JSX.Element => {
  const [alarmTime, setAlarmTime] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [repeatDayOfWeek, setRepeatDayOfWeek] = useState<boolean[]>(new Array(7).fill(false))
  const { width: windowWidth } = useWindowDimensions()
  const refScrollView = useRef(null)
  const headerNavigation = useNavigation()
  const habitItemId = String(useLocalSearchParams().habitItemId)
  const habitMission = String(useLocalSearchParams().habitMission)

  useEffect(() => {
    requestPermissionsAsync()
      .then(() => {})
      .catch(() => {})
  }, [])

  useEffect(() => {
    headerNavigation.setOptions({
      headerRight: () => { return <Save onSave={() => { handleSaveAsync(alarmTime, repeatDayOfWeek, habitItemId, habitMission) }}/> }
    })
  }, [alarmTime, repeatDayOfWeek])

  const onMomentumScrollEnd = useCallback(
    () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    }, [windowWidth]
  )

  const renderExample = useMemo(() => {
    return (
      <View style={[styles.alarmTimeScrollViewSection, { width: windowWidth }]}>
        <TimerPicker
          onDurationChange={
            (timer) => {
              setAlarmTime({ hours: timer.hours, minutes: timer.minutes, seconds: 0 })
            }
          }
          hideSeconds={true}
          padWithNItems={2}
          hourLabel = "時"
          minuteLabel = "分"
          LinearGradient={LinearGradient}
          styles={{
            theme: 'light',
            backgroundColor: '#E0F6FF',
            pickerItem: {
              fontSize: 28
            },
            pickerLabel: {
              fontSize: 26,
              marginTop: 0
            },
            pickerContainer: {
              marginRight: 6
            }
          }}
        />
      </View>
    )
  }, [windowWidth, alarmTime])

  return (
    <View style={styles.container}>

      <View style={styles.alarmTimeSection}>
       <ScrollView
          ref={refScrollView}
          horizontal
          pagingEnabled
          onMomentumScrollEnd={onMomentumScrollEnd}>
          {renderExample}
        </ScrollView>
      </View>

      <View style={styles.repeatDaySection}>
        <Text style={styles.repeatDayText}>くり返し</Text>

        <View style = {styles.repeatDay}>
          <TouchableOpacity onPress={() => { handlePressRepeatDayOfWeek(repeatDayOfWeek, dayOfWeek.Sunday, setRepeatDayOfWeek) }}>
            <View style={ repeatDayOfWeek[0] ? styles.onRepeatDay : styles.offRepeatDay }>
              <Text style={ styles.dayText }>日</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { handlePressRepeatDayOfWeek(repeatDayOfWeek, dayOfWeek.Monday, setRepeatDayOfWeek) }}>
            <View style={ repeatDayOfWeek[1] ? styles.onRepeatDay : styles.offRepeatDay }>
              <Text style={styles.dayText}>月</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { handlePressRepeatDayOfWeek(repeatDayOfWeek, dayOfWeek.Tuesday, setRepeatDayOfWeek) }}>
            <View style={ repeatDayOfWeek[2] ? styles.onRepeatDay : styles.offRepeatDay }>
              <Text style={styles.dayText}>火</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { handlePressRepeatDayOfWeek(repeatDayOfWeek, dayOfWeek.Wednesday, setRepeatDayOfWeek) }}>
            <View style={ repeatDayOfWeek[3] ? styles.onRepeatDay : styles.offRepeatDay }>
              <Text style={styles.dayText}>水</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { handlePressRepeatDayOfWeek(repeatDayOfWeek, dayOfWeek.Thursday, setRepeatDayOfWeek) }}>
            <View style={ repeatDayOfWeek[4] ? styles.onRepeatDay : styles.offRepeatDay }>
              <Text style={styles.dayText}>木</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { handlePressRepeatDayOfWeek(repeatDayOfWeek, dayOfWeek.Friday, setRepeatDayOfWeek) }}>
            <View style={ repeatDayOfWeek[5] ? styles.onRepeatDay : styles.offRepeatDay }>
              <Text style={styles.dayText}>金</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { handlePressRepeatDayOfWeek(repeatDayOfWeek, dayOfWeek.Saturday, setRepeatDayOfWeek) }}>
            <View style={ repeatDayOfWeek[6] ? styles.onRepeatDay : styles.offRepeatDay }>
              <Text style={styles.dayText}>土</Text>
            </View>
          </TouchableOpacity>
        </View>

      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F6FF'
  },
  alarmSection: {
    height: 152,
    width: 384,
    marginTop: 104,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  repeatDaySection: {
    paddingLeft: 27,
    paddingRight: 27,
    justifyContent: 'center',
    alignItems: 'center'
  },
  repeatDayText: {
    fontSize: 24,
    lineHeight: 24,
    textAlign: 'left',
    width: '100%'
  },
  repeatDay: {
    flexDirection: 'row'
  },
  onRepeatDay: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    height: 32,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center'
  },
  offRepeatDay: {
    backgroundColor: '#C0C0C0',
    borderWidth: 1,
    height: 32,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dayText: {
    fontSize: 24,
    lineHeight: 30,
    textAlign: 'center'
  },
  alarmTimeScrollViewSection: {
    backgroundColor: '#E0F6FF',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  alarmTimeSection: {
    backgroundColor: '#E0F6FF'
  }
})

export default AddAlarm
