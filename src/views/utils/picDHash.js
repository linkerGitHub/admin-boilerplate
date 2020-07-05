export function compressImg (imgSrc, imgWidth =  9, imgHeight = 8) {
  return new Promise((resolve, reject) => {
    if (imgSrc === '') {
      reject('imgSrc can not be empty!')
    }
    const canvas = document.createElement('canvas')
    canvas.setAttribute('id', 'rgb')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = function () {
      canvas.width = imgWidth
      canvas.height = imgHeight
      ctx?.drawImage(img, 0, 0, imgWidth, imgHeight)
      const data = ctx?.getImageData(0, 0, imgWidth, imgHeight)
      resolve(data)
    }
    img.src = imgSrc
  })
}

// 根据 RGBA 数组生成 ImageData
export function createImgData (imgDataArr, imgWidth = 9, imgHeight = 8) {
  const canvas = document.createElement('canvas')
  canvas.setAttribute('id', 'gray')
  canvas.setAttribute('width', imgWidth.toString())
  canvas.setAttribute('height', imgHeight.toString())
  const ctx = canvas.getContext('2d')
  const newImageData = ctx?.createImageData(imgWidth, imgHeight)
  const dataDetail = imgDataArr;
  for (let i = 0; i < dataDetail.length; i += 4) {
    let R = dataDetail[i]
    let G = dataDetail[i + 1]
    let B = dataDetail[i + 2]
    let Alpha = dataDetail[i + 3]

    newImageData.data[i] = R
    newImageData.data[i + 1] = G
    newImageData.data[i + 2] = B
    newImageData.data[i + 3] = Alpha
  }
  ctx.putImageData(newImageData, 0, 0)
  return newImageData
}

export function createGrayscale (imgData) {
  const newData = Array(imgData.data.length)
  newData.fill(0)
  imgData.data.forEach((_data, index) => {
    if ((index + 1) % 4 === 0) {
      const R = imgData.data[index - 3]
      const G = imgData.data[index - 2]
      const B = imgData.data[index - 1]

      const gray = ~~((R + G + B) / 3)
      newData[index - 3] = gray
      newData[index - 2] = gray
      newData[index - 1] = gray
      newData[index] = 255 // Alpha 值固定为255
    }
  })
  return createImgData(newData)
}

export function chunk(arr, size){
  return Array.apply(null, {
    length: Math.ceil(arr.length / size)
  }).map((item, index) => {
    return arr.slice(index * size, (index + 1) * size);
  });
}

export function picDHash(imgSrc) {
  return new Promise(resolve => {
    compressImg(imgSrc).then(data => {
      const grayScale  = createGrayscale(data)
      const grayArr = []
      grayScale.data.forEach((item, idx, arr) => {
        if((idx + 1) % 4 === 0) {
          grayArr.push(arr[idx - 1])
        }
      })

      const grayMatrix = chunk(grayArr, 9)

      const dHashVal = grayMatrix.map((row) => {
        let markVal = row[0]
        return row.slice(1).map(elem => {
          const tmpRet = elem > markVal ? '1' : '0'
          markVal = elem
          return tmpRet;
        }).join('')
      }).join('')

      resolve(dHashVal)
    })
  })
}
