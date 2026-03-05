import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export function useDatetime() {
  function formatDate(value, title = true) {
    if (!value) return ''
    const d = dayjs.utc(value).local()
    if (title) {
      return d.format('dddd, D MMM')
    }
    return d.format('D MMMM YYYY') + ' at ' + d.format('h:mm A')
  }

  function hasPostedToday(lastPostDate) {
    if (!lastPostDate) return false
    const today = dayjs().local()
    const last = dayjs.utc(lastPostDate).local()
    return (
      last.date() === today.date() &&
      last.month() === today.month() &&
      last.year() === today.year()
    )
  }

  return { formatDate, hasPostedToday }
}
