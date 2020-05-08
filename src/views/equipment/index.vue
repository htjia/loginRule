<template>
  <PageHeaderLayout>
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
        <el-table-column label="设备名称" align="center">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="IP地址" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.toIP }}</span>
          </template>
        </el-table-column>
        <el-table-column label="端口号" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.toport }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="totalPage>10"
        :current-page="pageNum"
        :page-sizes="[10, 20, 30, 40]"
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
      :before-close="handleClose"
      title="添加"
      width="500px">
      <el-form ref="facilityForm" :model="facilityForm" :rules="rules" status-icon label-width="80px" label-position="left">
        <el-form-item label="设备名称" prop="facilityName">
          <el-input v-model="facilityForm.facilityName" type="text"/>
        </el-form-item>
        <el-form-item label="IP" prop="ip">
          <el-input v-model="facilityForm.ip" type="text"/>
        </el-form-item>
        <el-form-item label="端口" prop="port">
          <el-input v-model="facilityForm.port" type="text"/>
        </el-form-item>
        <!--<el-form-item label="工厂">--><!--<el-input v-model="facilityForm.factoryCode" type="text"/>-->
        <!--</el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('facilityForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('facilityForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      :before-close="handleClose"
      title="编辑"
      width="500px">
      <el-form ref="facilityForm" :model="facilityForm" :rules="rules" status-icon label-width="80px" label-position="left">
        <el-form-item label="设备名称" prop="facilityName">
          <el-input v-model="facilityForm.facilityName" type="text"/>
        </el-form-item>
        <el-form-item label="IP" prop="ip">
          <el-input v-model="facilityForm.ip" type="text"/>
        </el-form-item>
        <el-form-item label="端口" prop="port">
          <el-input v-model="facilityForm.port" type="text"/>
        </el-form-item>
        <!--<el-form-item label="工厂">--><!--<el-input v-model="facilityForm.factoryCode" type="text"/>-->
        <!--</el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('facilityForm')">取 消</el-button>
        <el-button type="primary" @click="submitEditForm('facilityForm')">确 定</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>
<script src="./equipment.js"></script>

