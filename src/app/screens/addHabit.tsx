import { useEffect, useState } from 'react'
import { Text, TextInput, View, StyleSheet, Alert } from 'react-native'
import { router, useNavigation } from 'expo-router'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import Save from '../../components/Save'
import { db, auth } from '../../utils/config'

const handleSave = (habitMission: string, habitMissionDetail: string): void => {
  if (auth.currentUser === null) { return } // currentUserがnullの場合は保存しない

  const refToUserHabits = collection(db, `users/${auth.currentUser.uid}/habits`)

  const date: Date = new Date()
  const year: number = date.getFullYear()
  const month: number = date.getMonth() + 1
  const day: number = date.getDate()
  const dayOfWeek: number = date.getDay()

  addDoc(refToUserHabits, {
    habitMission,
    habitMissionDetail,
    achievements: [
      {
        year,
        month,
        day,
        dayOfWeek,
        achievement: false
      }
    ],
    updatedAt: Timestamp.fromDate(new Date())
  })
    .then(() => {
      router.back()
    })
    .catch((error) => {
      Alert.alert('追加できませんでした')
      console.log(error)
    })
}

const AddHabit = (): JSX.Element => {
  const [habitMission, setHabitMission] = useState('')
  const [habitMissionDetail, setHabitMissionDetail] = useState('')
  const headerNavigation = useNavigation()

  useEffect(() => {
    headerNavigation.setOptions({
      headerRight: () => { return <Save onSave= {() => { handleSave(habitMission, habitMissionDetail) }}/> }
    })
  }, [habitMission, habitMissionDetail])

  return (
  <View style = {styles.container}>
    <View style={styles.habitMissionSection}>
      <Text style={styles.habitMissionDescription}>習慣化したいことはなんですか？</Text>
      <TextInput
        onChangeText = {(mission) => { setHabitMission(mission) }}
        value = { habitMission }
        placeholder=" 例)毎日15分ランニング！"
        maxLength={16}
        editable = {true}
        style = {styles.habitMissionTextInput}
      />
    </View>

    <View style={styles.habitMissionDetailSection}>
      <Text style={styles.habitMissionDetailDescription}>詳細</Text>
      <TextInput
        onChangeText = {(missionDetail) => { setHabitMissionDetail(missionDetail) }}
        placeholder = "例)仕事から帰ってきたらすぐに走りに行く！"
        maxLength={70}
        editable = { true }
        multiline = { true }
        numberOfLines = { 4 }
        style = {styles.habitMissionDetailTextInput}
      />
    </View>

    {/* 後々リリース予定の機能 */}
    {/* <View style={styles.notifySection}>
      <View style={styles.notifyDescriptionHeader}>
        <Text style={styles.notifyDescription}>通知</Text>
        <Link href={{ pathname: './addTempAlarm', params: { habitMission, habitMissionDetail } }}>
          <View style={styles.circleButton}>
            <Text style={styles.circleButtonLabel}>＋</Text>
          </View>
        </Link>
      </View>

      <Link href='/habit/alarm' asChild>
        <TouchableOpacity style={styles.notifyItem}>
          <View>
            <Text style={styles.notifyTime}>10:15</Text>
            <Text style={styles.notifyAlarm}>くり返し：(月)(金)</Text>
          </View>
          <TouchableOpacity style={{ marginRight: 16 }}>
            <Icon iconName='DeleteNotify' iconColor='#D9D9D9' />
          </TouchableOpacity>
        </TouchableOpacity>
      </Link>
    </View> */}
  </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#E0F6FF'
  },
  habitMissionSection: {
    flexDirection: 'column',
    width: 390,
    height: 80,
    paddingLeft: 24,
    paddingRight: 24,
    marginBottom: 16
  },
  habitMissionDescription: {
    fontSize: 24,
    lineHeight: 28
  },
  habitMissionTextInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 10,
    height: 48,
    width: 336,
    lineHeight: 24,
    fontSize: 24
  },
  habitMissionDetailSection: {
    paddingLeft: 24,
    paddingRight: 24,
    marginBottom: 16
  },
  habitMissionDetailDescription: {
    alignItems: 'center',
    fontSize: 24,
    lineHeight: 28
  },
  habitMissionDetailTextInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 10,
    height: 136,
    width: 336,
    lineHeight: 24,
    fontSize: 24
  },
  notifySection: {
    paddingLeft: 24,
    paddingRight: 24
  },
  notifyDescriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  notifyDescription: {
    lineHeight: 40,
    fontSize: 24,
    marginRight: 16
  },
  notifyItem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 10,
    height: 80,
    width: 336,
    paddingLeft: 8,
    marginBottom: 16,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  notifyTime: {
    lineHeight: 56,
    fontSize: 44
  },
  notifyAlarm: {
    lineHeight: 24,
    fontSize: 20
  },
  circleButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderColor: '#0085ff',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  circleButtonLabel: {
    color: '#0085ff',
    fontSize: 24,
    fontWeight: '700'
  }
})

export default AddHabit
