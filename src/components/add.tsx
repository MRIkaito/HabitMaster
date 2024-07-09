import { StyleSheet, TouchableOpacity } from 'react-native'
import Icon from './icon'

interface Props {
  onAdd: () => void
}

const Add = (props: Props): JSX.Element => {
  const handleAdd = props.onAdd
  return (
    <TouchableOpacity style={styles.add} onPress={handleAdd}>
      <Icon iconName="Add" iconColor="#000000"/>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  add: {
    height: 48,
    width: 48
  }
})

export default Add
