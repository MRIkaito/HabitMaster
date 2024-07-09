import { type Timestamp } from 'firebase/firestore'

interface Habit {
  habitItemId: string
  habitMission: string
  habitMissionDetail: string
  achievements: Array<{
    year: number
    month: number
    day: number
    dayOfWeek: number
    achievement: boolean
  }>
  updatedAt: Timestamp
}

interface HabitItemAlarm {
  alarmId: string
  alarmTime: AlarmTime
  repeatDayOfWeek: boolean[]
  updatedAt: Timestamp
  alarmIdentifier?: Array<string | null>
}

interface AlarmTime {
  hours: number
  minutes: number
  seconds: number
}

type SetAlarmTime = React.Dispatch<React.SetStateAction<{
  hours: number
  minutes: number
  seconds: number
}>>

type SetRepeatDayOfWeek = React.Dispatch<React.SetStateAction<boolean[]>>

export type { Habit, HabitItemAlarm, AlarmTime, SetAlarmTime, SetRepeatDayOfWeek }
