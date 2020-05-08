import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { deviceList, add, update, remove, config, getConfig } from '@/api/commonSet/collectDevice'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    const validateName = (rule, value, callback) => {
      const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
      if (value.trim().length === 0) {
        callback(new Error('请输入设备名称'))
      } else {
        if (value.trim().length > 20) {
          callback(new Error('设备名称长度不能大于20'))
        } else if (pattern.test(value)) {
          callback(new Error('设备名称不能包含特殊字符'))
        } else {
          callback()
        }
      }
    }
    const validateVersions = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('请输入驱动版本'))
      } else {
        if (value.trim().length > 20) {
          callback(new Error('驱动版本长度不能大于20'))
        } else {
          callback()
        }
      }
    }
    const validateFile = (rule, value, callback) => {
      if (this.$refs.upload.uploadFiles.length === 0) {
        callback(new Error('请选择要上传的文件'))
        this.$message({
          type: 'error',
          message: '请选择要上传的文件!'
        })
      } else {
        console.log(this.$refs.upload.uploadFiles[0])
        // var regx = new RegExp('(.xlsx)$|(.doc)$|(.docx)$|(.xls)$')
        var regx = new RegExp('(.dll)$|(.dlL)$|(.dLl)$|(.dLL)$|(.Dll)$|(.DlL)$|(.DLl)$|(.DLL)$')
        if (!regx.test(this.$refs.upload.uploadFiles[0].name)) {
          callback(new Error('文件格式只支持dll'))
          this.$message({
            type: 'error',
            message: '文件格式只支持dll!'
          })
        }
        if (this.$refs.upload.uploadFiles[0].size / 1024 / 1024 > 1) {
          callback(new Error('文件大小必须小于1Mb'))
          this.$message({
            type: 'error',
            message: '文件大小必须小于1Mb!'
          })
        }
        callback()
      }
    }
    const validateFileType = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('请输入文件类型'))
      } else {
        if (value.trim().length > 10) {
          callback(new Error('文件类型长度不能大于10'))
        } else {
          callback()
        }
      }
    }
    return {
      routers: [],
      routerValues: [],
      searchkey: '',
      checkAll: false,
      isIndeterminate: true,
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      editSerialPortVisible: false,
      fileParsingVisible: false,
      internetAccessVisible: false,
      list: [],
      fileList: [],
      pageSize: 15,
      pageNum: 1,
      communication: '1',
      totalPage: 0,
      name: '',
      deviceForm: {
        collectType: '',
        deviceName: '',
        versions: '',
        file: []
      },
      rules: {
        deviceName: [{ required: true, validator: validateName, trigger: 'blur' }],
        versions: [{ required: true, validator: validateVersions, trigger: 'blur' }],
        collectType: [{ required: true, message: '请选择采集类型', trigger: 'blur' }],
        file: [{ required: true, validator: validateFile, trigger: 'change' }]
      },
      typeOptions: [
        {
          id: '0',
          name: '串口'
        },
        {
          id: '1',
          name: '文件解析'
        },
        {
          id: '2',
          name: '网口'
        }
      ],
      serialPortForm: {
        serialPort: '0',
        overTime: '3000',
        btl: '9600',
        check: '2',
        txfs: '0',
        sjw: '0',
        tzw: '0'
      },
      fileForm: {
        fileType: '.csv',
        action: '0'
      },
      internetForm: {
        ipAddress: '127.0.0.1',
        portNumber: '50001',
        timeInterval: '10000',
        iDeviceId: '0'
      },
      internetRules: {
        ipAddress: [{ required: true, message: '请输入IP地址', trigger: 'blur' }],
        portNumber: [{ required: true, message: '请输入端口号', trigger: 'blur' }],
        timeInterval: [{ required: true, message: '请输入超时时间', trigger: 'blur' }],
        iDeviceId: [{ required: true, message: '请输入I设备ID', trigger: 'blur' }]
      },
      fileRules: {
        fileType: [{ required: true, validator: validateFileType, trigger: 'blur' }]
      },
      serialPortRules: {
        overTime: [{ required: true, message: '请输入超时时间', trigger: 'blur' }],
        serialPort: [{ required: true, message: '请选择串口', trigger: 'change' }],
        btl: [{ required: true, message: '请选择波特率', trigger: 'change' }],
        check: [{ required: true, message: '请选择校验规则', trigger: 'change' }]
      },
      serialPortOptions: [
        { id: '0', name: 'COM1' },
        { id: '1', name: 'COM2' },
        { id: '2', name: 'COM3' },
        { id: '3', name: 'COM4' },
        { id: '4', name: 'COM5' },
        { id: '5', name: 'COM6' },
        { id: '6', name: 'COM7' },
        { id: '7', name: 'COM8' },
        { id: '8', name: 'COM9' },
        { id: '9', name: 'COM10' }
      ],
      btlOptions: [
        { id: '110', name: '110' },
        { id: '300', name: '300' },
        { id: '600', name: '600' },
        { id: '1200', name: '1200' },
        { id: '2400', name: '2400' },
        { id: '4800', name: '4800' },
        { id: '9600', name: '9600' },
        { id: '14400', name: '14400' },
        { id: '19200', name: '19200' },
        { id: '28800', name: '28800' },
        { id: '33600', name: '33600' },
        { id: '38400', name: '38400' },
        { id: '56000', name: '56000' },
        { id: '57600', name: '57600' },
        { id: '115200', name: '115200' },
        { id: '128000', name: '128000' },
        { id: '256000', name: '256000' }
      ],
      checkOptions: [
        { id: '0', name: '无校验' },
        { id: '1', name: '奇校验' },
        { id: '2', name: '偶校验' },
        { id: '3', name: '标志校验' },
        { id: '4', name: '空格校验' }
      ],
      fileUrl: process.env.BASE_API + '/collect-type/upload',
      fileName: '',
      isEditDeleted: false,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json'
      },
      currentId: ''
    }
  },
  watch: {
  },
  created() {
    this.fetchData()
  },
  mounted() {
  },
  methods: {
    submitUpload() {
      this.$refs.upload.submit()
    },
    onSuccess(res, file, fileList) {
      this.fileName = res.data.name
    },
    handleRemove(file, fileList) {
      this.$refs.upload.uploadFiles = fileList
      this.isEditDeleted = true
      // this.$refs.deviceForm.validateField('file')
    },
    uploadChange(file, fileList) {
      console.log(fileList)
      this.$refs.upload.uploadFiles = fileList
      this.$refs.deviceForm.validateField('file')
    },
    getConfigFun(type, deviceId) {
      const requestParams = {
        type,
        deviceId
      }
      getConfig(requestParams).then(res => {
        if (type === 0) {
          this.serialPortForm.serialPort = res.data.serialPortType
          this.serialPortForm.overTime = res.data.communicationTimeout
          this.serialPortForm.txfs = res.data.communicationMode
          this.serialPortForm.btl = res.data.baudRate
          this.serialPortForm.sjw = res.data.dataBit
          this.serialPortForm.tzw = res.data.stopBit
          this.serialPortForm.check = res.data.parityCheck
        } else if (type === 1) {
          this.fileForm.fileType = res.data.fileType
          this.fileForm.action = res.data.monitoringAction
        } else {
          this.internetForm.portNumber = res.data.portNumber
          this.internetForm.ipAddress = res.data.ipAddress
          this.internetForm.timeInterval = res.data.timeInterval
          this.internetForm.iDeviceId = res.data.ideviceId
        }
      })
    },
    // 串口配置
    editSerialPort(row) {
      this.getConfigFun(0, row.id)
      this.currentId = row.id
      this.editSerialPortVisible = true
    },
    // 文件解析
    fileParsing(row) {
      this.getConfigFun(1, row.id)
      this.currentId = row.id
      this.fileParsingVisible = true
    },
    // 网口配置
    editInternetAccess(row) {
      this.getConfigFun(2, row.id)
      this.currentId = row.id
      this.internetAccessVisible = true
    },
    // 每页数量改变
    sizeChange(pageSize) {
      this.pageSize = pageSize
      this.fetchData()
    },
    // 当前页数改变
    currentChange(pageNum) {
      this.pageNum = pageNum
      this.fetchData()
    },
    handleSearch(data) {
      this.pageNum = 1
      this.searchkey = data
      this.fetchData()
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const requestParams = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        searchkey: this.searchkey
      }
      deviceList(requestParams).then(res => {
        if (res.code === 0) {
          this.list = res.data.list
          this.totalPage = parseInt(res.data.total)
          this.listLoading = false
        }
      })
    },
    // 添加
    handleAdd() {
      this.fileName = ''
      this.deviceForm.collectType = ''
      this.deviceForm.deviceName = ''
      this.deviceForm.versions = ''
      this.addDialogVisible = true
      // setTimeout(() => {
      //   this.$refs.deviceForm.resetFields()
      // }, 10)
    },
    // 关闭
    handleClose(formName) {
      this.fileList = []
      this.$refs[formName].resetFields()
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$refs.upload.submit()
          setTimeout(() => {
            if (this.fileName !== '' && this.fileName !== undefined) {
              const params = {
                collectType: this.deviceForm.collectType,
                deviceName: this.deviceForm.deviceName,
                driveProgramName: this.fileName,
                driveProgramVersion: this.deviceForm.versions
              }
              add(params).then(res => {
                if (res.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '添加成功!'
                  })
                  this.$refs[formName].resetFields()
                  this.addDialogVisible = false
                  this.fetchData()
                }
              })
            } else {
              this.$message({
                type: 'error',
                message: '文件上传失败!'
              })
            }
          }, 1000)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    submitEditSerialPortForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const model = {
            deviceId: this.currentId,
            serialPortType: this.serialPortForm.serialPort,
            communicationTimeout: this.serialPortForm.overTime,
            communicationMode: this.serialPortForm.txfs,
            baudRate: this.serialPortForm.btl,
            dataBit: this.serialPortForm.sjw,
            stopBit: this.serialPortForm.tzw,
            parityCheck: this.serialPortForm.check
          }
          const params = {
            type: 0,
            model
          }
          config(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '配置成功!'
              })
              this.$refs[formName].resetFields()
              this.editSerialPortVisible = false
              this.fetchData()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    submitEditFileForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const model = {
            deviceId: this.currentId,
            fileType: this.fileForm.fileType,
            monitoringAction: this.fileForm.action
          }
          const params = {
            type: 1,
            model
          }
          config(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '配置成功!'
              })
              this.$refs[formName].resetFields()
              this.fileParsingVisible = false
              this.fetchData()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    submitEditInternetForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const model = {
            deviceId: this.currentId,
            portNumber: this.internetForm.portNumber,
            ipAddress: this.internetForm.ipAddress,
            timeInterval: this.internetForm.timeInterval,
            iDeviceId: this.internetForm.iDeviceId
          }
          const params = {
            type: 2,
            model
          }
          config(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '配置成功!'
              })
              this.$refs[formName].resetFields()
              this.internetAccessVisible = false
              this.fetchData()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 编辑提交
    submitEditForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isEditDeleted) {
            this.$refs.upload.submit()
            if (this.fileName !== '' && this.fileName !== undefined) {
              setTimeout(() => {
                const params = {
                  id: this.currentId,
                  collectType: this.deviceForm.collectType,
                  deviceName: this.deviceForm.deviceName,
                  driveProgramName: this.fileName,
                  driveProgramVersion: this.deviceForm.versions
                }
                update(params).then(res => {
                  if (res.code === 0) {
                    this.$message({
                      type: 'success',
                      message: '编辑成功!'
                    })
                    this.$refs[formName].resetFields()
                    this.editDialogVisible = false
                    this.fetchData()
                  }
                })
              }, 1000)
            } else {
              this.$message({
                type: 'error',
                message: '文件上传失败!'
              })
            }
          } else {
            this.fileName = this.$refs.upload.uploadFiles[0].name
            const params = {
              id: this.currentId,
              collectType: this.deviceForm.collectType,
              deviceName: this.deviceForm.deviceName,
              driveProgramName: this.fileName,
              driveProgramVersion: this.deviceForm.versions
            }
            update(params).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '编辑成功!'
                })
                this.$refs[formName].resetFields()
                this.editDialogVisible = false
                this.fetchData()
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 取消
    resetForm(formName) {
      this.editDialogVisible = false
      this.addDialogVisible = false
      this.editSerialPortVisible = false
      this.fileParsingVisible = false
      this.internetAccessVisible = false
      this.$refs[formName].resetFields()
    },
    // 编辑
    handleEdit(row) {
      this.currentId = row.id
      this.deviceForm.collectType = row.collectType
      this.deviceForm.deviceName = row.deviceName
      this.deviceForm.versions = row.driveProgramVersion
      this.fileList = [{ name: row.driveProgramName, url: '' }]
      this.fileName = row.driveProgramName
      this.editDialogVisible = true
      this.isEditDeleted = false
    },
    // 删除
    handleDelete(row) {
      this.$confirm('此操作将永久删除该设备, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: row.id
        }
        remove(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.editDialogVisible = false
            this.fetchData()
          }
        })
      }).catch(() => {
      })
    }
  }
}
