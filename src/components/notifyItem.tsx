import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Link, router } from 'expo-router'
import Icon from './Icon'

const handlePress = (): void => {
  console.log('test')
  router.push('../app/habit/addAlarm')
}

const NotifyItem = (): JSX.Element => {
  return (
    <View style={styles.notifySection}>
      {/* 通知ヘッダ・通知追加 */}
      <View style={styles.notifyDescriptionHeader}>
        <Text style={styles.notifyDescription}>通知</Text>
        <TouchableOpacity style={styles.circleButton} onPress={handlePress}>
          <Text style={styles.circleButtonLabel}>＋</Text>
        </TouchableOpacity>
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
    </View>
  )
}

const styles = StyleSheet.create({
  notifySection: {
    paddingLeft: 24,
    paddingRight: 24
  },
  notifyDescriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center'
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
export default NotifyItem
