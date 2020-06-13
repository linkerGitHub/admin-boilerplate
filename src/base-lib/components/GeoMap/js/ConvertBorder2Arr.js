export function convertBorder(border) {
  if(border && border.length > 0) {
    return border.split(';').map(po => {
      return po.split(',')
    })
  }
  return []
}
