import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { doc, setDoc } from 'firebase/firestore'
import { db, auth } from '../utils/config'
import { Entypo } from '@expo/vector-icons'

interface Props {
  habitItemId?: string
  achievementsIndex?: number
  achievementLog?: boolean
  achievements?: Array<{
    year: number
    month: number
    day: number
    dayOfWeek: number
    achievement: boolean
  }>
}

const handlePressTransition = (
  habitItemId: string,
  achievementsIndex: number,
  achievementLog: boolean,
  achievements: Array<{
    year: number
    month: number
    day: number
    dayOfWeek: number
    achievement: boolean
  }>
): void => {
  if (auth.currentUser === null) { return }
  const refToUserHabitsItemId = doc(db, `users/${auth.currentUser.uid}/habits`, habitItemId)
  const remoteAchievements = [...achievements]

  achievementLog = (!achievementLog)
  remoteAchievements[achievementsIndex].achievement = achievementLog
  setDoc(
    refToUserHabitsItemId,
    {
      achievements: remoteAchievements
    },
    { merge: true }
  )
    .catch((error: string) => { console.log(error) })
}

const DayCheckButton = (props: Props): JSX.Element => {
  const { habitItemId, achievementsIndex, achievementLog, achievements } = props

  if (
    (habitItemId === undefined) ||
    (achievementsIndex === undefined) ||
    (achievementLog === undefined) ||
    (achievements === undefined)) {
    return (
      <View style={styles.noLogStatus} >
        <Text></Text>
      </View>
    )
  }

  if (achievementLog) {
    return (
      // スタイリングはまだ直していない．
      <TouchableOpacity style={styles.logStatus} onPress={() => { handlePressTransition(habitItemId, achievementsIndex, achievementLog, achievements) }}>
          <Entypo name='circle' size={24} color='#22F200'/>
      </TouchableOpacity>
    )
  } else {
    return (
      <TouchableOpacity style={styles.logStatus} onPress={() => { handlePressTransition(habitItemId, achievementsIndex, achievementLog, achievements) }}>
        <Entypo name='cross' size={32} color='#FF0000' />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  noLogStatus: {
    backgroundColor: '#C0C0C0',
    height: 32,
    width: 48,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logStatus: {
    backgroundColor: '#FFFFFF',
    height: 32,
    width: 48,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default DayCheckButton
