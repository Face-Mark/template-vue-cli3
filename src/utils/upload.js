/* 1.获取临时秘钥data 2.初始化 3.判断上传文件的类型 4.判断文件大小 是否需要分片上传*/
import COS from 'cos-js-sdk-v5'
import {
  Message
} from 'element-ui'
const hostUrl = process.env.VUE_APP_PIC_DOMURL
const videoHostUrl = process.env.VUE_APP_VIDEO_DOMURL
const Bucket = process.env.VUE_APP_PIC_BUCKET // 存储桶名称
const ENV = process.env.NODE_ENV
const Region = 'ap-shanghai'
var cos = new COS({
  SecretId: 'AKIDc7PVQ9evynQt9B0c0A6pMgmdFbhX7QSE',
  SecretKey: 'Ypqa3HFzWs0ua3HJ8i5DAsOgjZAXgcLq'
})

// 上传
export function putObject(file, fileName, callback, getProgress) {
  // 获取上传文件类型
  const type = file.type.substring(0, 5)
  const size = file.size
  if (type === 'video' || type === 'audio') {
    if (size / (1024 * 2024) < 50) {
      cos.putObject({
        Bucket: Bucket, // 存储桶名称
        Region: Region, // 地区
        Key: fileName, // 视频名称
        StorageClass: 'STANDARD',
        Body: file, // 上传文件对象
        onHashProgress: function(progressData) {
        },
        onProgress: function(progressData) {
          getProgress && getProgress(progressData.percent)
        }
      },
      function(err, data) {
        if (err) {
          Message({
            message: '文件上传失败,请重新上传',
            type: 'error'
          })
        } else {
          const fileUrl = 'https://' + data.Location
          // const reg = /^http(s)?:\/\/(.*?)\//
          // if (ENV == 'production') {
          //   fileUrl = fileUrl.replace(reg, videoHostUrl)
          // }
          callback(fileUrl)
        }
      }
      )
    } else {
      cos.sliceUploadFile({
        Bucket: Bucket,
        /* 必须 */
        Region: Region,
        /* 存储桶所在地域，必须字段 */
        Key: fileName,
        /* 必须 */
        Body: file,
        onTaskReady: function(taskId) {
          /* 非必须 */
        },
        onHashProgress: function(progressData) {
          /* 非必须 */
        },
        onProgress: function(progressData) {
          getProgress && getProgress(progressData.percent)
        }
      },
      function(err, data) {
        if (err) {
          Message({
            message: '文件上传失败,请重新上传',
            type: 'error'
          })
        } else {
          let fileUrl = 'https://' + data.Location
          const reg = /^http(s)?:\/\/(.*?)\//
          if (ENV == 'production') {
            fileUrl = fileUrl.replace(reg, videoHostUrl)
          }
          callback(fileUrl)
        }
      }
      )
    }
  } else {
    // if (type === 'image')
    cos.putObject({
      Bucket: Bucket, // 存储桶名称
      Region: Region, // 地区
      Key: fileName, // 图片名称
      StorageClass: 'STANDARD',
      Body: file, // 上传文件对象
      onHashProgress: function(progressData) {
        console.log(progressData, '2222')
      },
      onProgress: function(progressData) {
        console.log(progressData)
        getProgress && getProgress(progressData.percent)
      }
    },
    function(err, data) {
      if (err) {
        Message({
          message: '文件上传失败,请重新上传',
          type: 'error'
        })
      } else {
        let fileUrl = 'https://' + data.Location
        const reg = /^http(s)?:\/\/(.*?)\//
        if (ENV == 'production') {
          fileUrl = fileUrl.replace(reg, hostUrl)
        }
        callback(fileUrl)
      }
    }
    )
  }
}

export function deleteObject(file, fileName, callback) {
  const type = file.type.substring(0, 5)
  if (type === 'video') {
    cos.deleteObject({
      Bucket: Bucket,
      /* 必须 */
      Region: Region,
      /* 存储桶所在地域，必须字段 */
      Key: fileName /* 必须 */
    },
    // eslint-disable-next-line handle-callback-err
    function(err, data) {
      if (data) {
        callback(1)
      }
    }
    )
  } else if (type === 'image') {
    cos.deleteObject({
      Bucket: Bucket,
      /* 必须 */
      Region: Region,
      /* 存储桶所在地域，必须字段 */
      Key: fileName /* 必须 */
    },
    // eslint-disable-next-line handle-callback-err
    function(err, data) {
      if (data) {
        callback(1)
      }
    }
    )
  }
}

export default {
  putObject,
  deleteObject
}
