<template>
  <PageHeaderLayout >
    <div class="">
      <HeaderSearchAdd placeholder-text = "请输入设备名称" @handleSearch="handleSearch" @handleAdd="handleAdd"/>
      <div class="app-container">
        <el-table
          v-loading="listLoading"
          :data="list"
          element-loading-text="拼命加载中"
          border
          fit
          stripe
          highlight-current-row>
          <el-table-column align="center" label="序号" width="95">
            <template slot-scope="scope">
              {{ scope.$index+1 }}
            </template>
          </el-table-column>
          <el-table-column label="设备名称" align="center" prop="deviceName"/>
          <el-table-column label="采集类型" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.collectType === '0'" style="cursor: pointer;color: #009494" @click="editSerialPort(scope.row)">串口</div>
              <div v-if="scope.row.collectType === '1'" style="cursor: pointer;color: #009494" @click="fileParsing(scope.row)">文件解析</div>
              <div v-if="scope.row.collectType === '2'" style="cursor: pointer;color: #009494" @click="editInternetAccess(scope.row)">网口</div>
            </template>
          </el-table-column>
          <el-table-column label="驱动程序" align="center" prop="driveProgramName" />
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                icon="el-icon-edit"
                @click="handleEdit(scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-if="totalPage>15"
          :current-page="pageNum"
          :page-sizes="[15, 30, 40]"
          :page-size="pageSize"
          :total="totalPage"
          class="pagination"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="sizeChange"
          @current-change="currentChange"
        />
      </div>
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="addDialogVisible"
        title="添加"
        width="500px"
        @close="handleClose('deviceForm')">
        <el-form ref="deviceForm" :model="deviceForm" :rules="rules" label-position="left" status-icon label-width="120px">
          <el-form-item label="设备名称：" prop="deviceName">
            <el-input v-model="deviceForm.deviceName" maxlength="20" type="text"/>
          </el-form-item>
          <el-form-item label="采集类型：" prop="collectType">
            <el-select v-model="deviceForm.collectType" placeholder="请选择参数类型" style="width: 340px">
              <el-option
                v-for="item in typeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="驱动程序：" prop="file" class="file-item">
            <el-upload
              ref="upload"
              :on-remove="handleRemove"
              :file-list="fileList"
              :auto-upload="false"
              :limit="1"
              :on-change="uploadChange"
              :on-success="onSuccess"
              :action="fileUrl"
              accept=".dll"
              class="upload-demo"
            >
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <!--<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>-->
              <span slot="tip" class="el-upload__tip" style="margin-left: 15px;">只能上传 dll 文件，且只能上传一份</span>
            </el-upload>
          </el-form-item>
          <el-form-item label="驱动版本：" prop="versions">
            <el-input v-model="deviceForm.versions" maxlength="20" type="text"/>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('deviceForm')">确 定</el-button>
          <el-button @click="resetForm('deviceForm')">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="editDialogVisible"
        title="编辑"
        width="500px"
        @close="handleClose('deviceForm')">
        <el-form ref="deviceForm" :model="deviceForm" :rules="rules" label-position="left" status-icon label-width="120px">
          <el-form-item label="设备名称：" prop="deviceName">
            <el-input v-model="deviceForm.deviceName" maxlength="20" type="text"/>
          </el-form-item>
          <el-form-item label="采集类型：" prop="collectType">
            <el-select v-model="deviceForm.collectType" placeholder="请选择参数类型" style="width: 340px">
              <el-option
                v-for="item in typeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="驱动程序：" prop="file" class="file-item">
            <el-upload
              ref="upload"
              :on-remove="handleRemove"
              :file-list="fileList"
              :auto-upload="false"
              :limit="1"
              :on-change="uploadChange"
              :on-success="onSuccess"
              :action="fileUrl"
              accept=".dll"
              class="upload-demo">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <!--<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>-->
              <span slot="tip" class="el-upload__tip" style="margin-left: 15px;">只能上传 dll 文件，且只能上传一份</span>
            </el-upload>
          </el-form-item>
          <el-form-item label="驱动版本：" prop="versions">
            <el-input v-model="deviceForm.versions" maxlength="20" type="text"/>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitEditForm('deviceForm')">确 定</el-button>
          <el-button @click="resetForm('deviceForm')">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="editSerialPortVisible"
        title="串口配置"
        width="500px"
        @close="handleClose('serialPortForm')">
        <el-form ref="serialPortForm" :model="serialPortForm" :rules="serialPortRules" label-position="left" status-icon label-width="100px">
          <el-form-item label="串口：" prop="serialPort">
            <el-select v-model="serialPortForm.serialPort" style="width: 360px">
              <el-option
                v-for="item in serialPortOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="波特率：" prop="btl">
            <el-select v-model="serialPortForm.btl" style="width: 360px">
              <el-option
                v-for="item in btlOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="奇偶校验：" prop="check">
            <el-select v-model="serialPortForm.check" style="width: 360px">
              <el-option
                v-for="item in checkOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="通信超时：" prop="overTime">
            <el-input v-model="serialPortForm.overTime" maxlength="20" type="text"/>
          </el-form-item>
          <el-form-item label="通信方式：">
            <el-radio-group v-model="serialPortForm.txfs">
              <el-radio label="0">Rs232</el-radio>
              <el-radio label="1">Rs422</el-radio>
              <el-radio label="2">Rs485</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="数据位：">
            <el-radio-group v-model="serialPortForm.sjw">
              <el-radio label="0">7</el-radio>
              <el-radio label="1">8</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="停止位：">
            <el-radio-group v-model="serialPortForm.tzw">
              <el-radio label="0">1</el-radio>
              <el-radio label="1">2</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitEditSerialPortForm('serialPortForm')">确 定</el-button>
          <el-button @click="resetForm('serialPortForm')">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="fileParsingVisible"
        title="文件解析"
        width="500px"
        @close="handleClose('fileForm')">
        <el-form ref="fileForm" :model="fileForm" :rules="fileRules" label-position="left" status-icon label-width="100px">
          <el-form-item label="文件类型：" prop="fileType">
            <el-input v-model="fileForm.fileType" maxlength="10" type="text"/>
          </el-form-item>
          <el-form-item label="监控动作：">
            <el-radio-group v-model="fileForm.action">
              <el-radio label="0">新增</el-radio>
              <el-radio label="1">修改</el-radio>
              <el-radio label="2">删除</el-radio>
              <el-radio label="3">重命名</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitEditFileForm('fileForm')">确 定</el-button>
          <el-button @click="resetForm('fileForm')">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="internetAccessVisible"
        title="网口配置"
        width="500px"
        @close="handleClose('internetForm')">
        <el-form ref="internetForm" :model="internetForm" :rules="internetRules" label-position="left" status-icon label-width="100px">
          <el-form-item label="IP地址：" prop="ipAddress">
            <el-input v-model="internetForm.ipAddress" maxlength="20" type="text"/>
          </el-form-item>
          <el-form-item label="端口号：" prop="portNumber">
            <el-input v-model="internetForm.portNumber" maxlength="20" type="text"/>
          </el-form-item>
          <el-form-item label="时间间隔：" prop="timeInterval">
            <el-input v-model="internetForm.timeInterval" maxlength="20" type="text"/>
          </el-form-item>
          <el-form-item label="I设备ID：" prop="iDeviceId">
            <el-input v-model="internetForm.iDeviceId" maxlength="20" type="text"/>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitEditInternetForm('internetForm')">确 定</el-button>
          <el-button @click="resetForm('internetForm')">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </PageHeaderLayout>
</template>
<script src="./deviceSet.js"></script>
<style scoped>
  .file-item>>>.el-form-item__error{
    display: none;
  }
</style>
