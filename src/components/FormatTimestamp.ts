import { FunctionalComponent } from 'vue'

const dateFormatter = Intl.DateTimeFormat('en-US', {
  dateStyle: 'short',
  timeStyle: 'medium',
})

const FormatTimestamp: FunctionalComponent<{ value: string }> = (props) => {
  const date = new Date(props.value)
  const formatted = dateFormatter.format(date)
  return formatted
}

export default FormatTimestamp
