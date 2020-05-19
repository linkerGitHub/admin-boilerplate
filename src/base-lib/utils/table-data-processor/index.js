export default {
  constructor(tableData) {
    this.targetData = tableData
  },

  /**
     * 获取某一列
     * @param columnName {string}
     * @param targetData {[{}]}
     * @returns {[]}
     */
  getColumn(columnName, targetData = this.targetData) {
    const ret = []
    for (const item of targetData) {
      ret.push(item[columnName])
    }
    return ret
  },

  /**
     * 获取多列，返回一个对象数组
     * @param columnNames {[string]}
     * @param targetData {[{}]}
     * @returns {[{}]}
     */
  getColumns(columnNames, targetData = this.targetData) {
    const ret = []
    for (const item of targetData) {
      const dealItem = {}
      for (const columnName of columnNames) {
        dealItem[columnName] = item[columnName]
      }
      ret.push(dealItem)
    }
    return ret
  },

  /**
     * 将某一列的值拼接
     * @param columnName {string}
     * @param joinMark {string}
     * @param targetData {[{}]}
     * @returns {string}
     */
  concatColumn(columnName, joinMark, targetData = this.targetData) {
    const columnArray = this.getColumn(columnName, targetData)
    return columnArray.join(joinMark)
  },

  /**
     * 求两个表数据table data中各一列之间相比较的差，保留leftTableData
     * @param leftTableData {[{}]}
     * @param leftColumnName {string}
     * @param rightTableData {[{}]}
     * @param rightColumnName {string}
     * @param keepRight {Boolean}
     * @returns {[]}
     */
  diffByColumn(leftTableData, leftColumnName, rightTableData, rightColumnName, keepRight = false) {
    if (keepRight) {
      const leftColumnSet = new Set(this.getColumn(leftColumnName, leftTableData))
      return rightTableData.filter(row => {
        return !leftColumnSet.has(row[rightColumnName])
      })
    }
    const rightColumnSet = new Set(this.getColumn(rightColumnName, rightTableData))
    return leftTableData.filter(row => {
      return !rightColumnSet.has(row[leftColumnName])
    })
  },

  /**
     * 修改某一列的值
     * @param columnName {string} 需要修改列的名称或者索引
     * @param newVal {*} 需要修改的值
     * @param tableData {[{}]} 可选，默认为新建对象时传入的table data
     * @returns {*}
     */
  changeColumnValue(columnName, newVal, tableData = this.targetData) {
    if (newVal.constructor !== 'Array') {
      tableData.forEach(function (item, index, array) {
        array[index][columnName] = newVal
      })
    } else {
      tableData.forEach(function (item, index, array) {
        array[index][columnName] = newVal[index]
      })
    }
    return tableData
  },

  /**
     * 选取一个对象数组中的一列值作为键，一列作为值，可深度查找
     * @param keyColumn {string} 深度键可以使用'.'
     * @param valColumn {string, {string: string}, Boolean } 选取需要取出作为值的键，可以是字符串指定值的键或者对象（键是指定值的键，值是取出后的更名），使用任意布尔值来取出一整行
     * @param tableData {[{}]}
     * @returns {{}}
     */
  convert2KeyValPlain(keyColumn, valColumn, tableData = this.targetData) {
    const ret = {}
    tableData.forEach(function (item, index, array) {

      let tempVal = {}
      // 只取一列，取得一个列对应的值
      if (valColumn.constructor === 'String') {
        const valPathArr = valColumn.split('.')
        let layerVal = array[index]
        for (const layerName of valPathArr) {
          layerVal = layerVal[layerName]
        }
        tempVal = layerVal
      }// 取相应的列，返回一个对象
      else if (valColumn.constructor === 'Object') {
        for (const reserveKey in valColumn) {
          const reserveKeyArr = reserveKey.split('.')
          let layer = array[index]
          for (const layerName of reserveKeyArr) {
            layer = layer[layerName]
          }
          tempVal[valColumn[reserveKey]] = layer
        }
      }// 取所有，返回一个对象
      else {
        tempVal = array[index]
      }

      const keyPathArr = keyColumn.split('.')
      let layerKey = array[index]
      for (const layerName of keyPathArr) {
        layerKey = layerKey[layerName]
      }
      const tempKey = layerKey

      ret[tempKey] = tempVal
    })
    return ret
  },

  /**
     *
     * @param condition {Function}
     * @param tableData {[]}
     * @returns {[]}
     */
  searchTableData(condition, tableData = this.targetData) {
    const ret = []
    tableData.forEach((elem) => {
      if (condition(elem)) {
        ret.push(elem)
      }
    })
    return ret
  }
}
