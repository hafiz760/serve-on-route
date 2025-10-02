
import moment from 'moment'

const getFormat = format => {
  if (format === 'DATE-TIME') {
    return 'D MMM YYYY hh:mm A'
  }

  return 'D MMM YYYY'
}
const format = (date, format = 'DEFAULT') => moment(date).format(getFormat(format))

const formatTs = (date, format = 'DEFAULT') => moment(date, 'X').format(getFormat(format))

const formatFull = (date, format = 'DATE-TIME') => moment(date).format(getFormat(format))

export default {
  format,
  formatTs,
  formatFull
}
