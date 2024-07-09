import { Text, StyleSheet, TouchableOpacity } from 'react-native'

interface Props {
  onSave: () => void
}

const Save = (props: Props): JSX.Element => {
  const handleSave = props.onSave
  return (
    <TouchableOpacity style={styles.saveHeader} onPress={handleSave}>
      <Text style={styles.saveText}>保存</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  saveHeader: {
    height: 48,
    width: 72,
    justifyContent: 'center',
    alignItems: 'center'
  },
  saveText: {
    fontSize: 18,
    lineHeight: 24
  }
})

export default Save
