export function getTableDataFromResponse(res) {
  return res.data.data || []
}

export function getTotalPageFromResponse(res) {
  return res.data.total || 0
}
