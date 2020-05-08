<template>
  <PageHeaderLayout >
    <div class="">
      <HeaderSearchAdd placeholder-text = "请输入采集参数名称" @handleSearch="handleSearch" @handleAdd="handleAdd"/>
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
          <el-table-column label="参数名称" align="center" prop="paramName"/>
          <el-table-column label="参数类型" align="center" prop="paramType"/>
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
        @close="handleClose('paramForm')">
        <el-form ref="paramForm" :model="paramForm" :rules="rules" label-position="left" status-icon label-width="120px">
          <el-form-item label="参数名称" prop="paramName">
            <el-input v-model="paramForm.paramName" maxlength="20" type="text"/>
          </el-form-item>
          <el-form-item label="参数类型" prop="paramType">
            <el-select v-model="paramForm.paramType" placeholder="请选择参数类型" style="width: 340px">
              <el-option
                v-for="item in typeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('paramForm')">确 定</el-button>
          <el-button @click="resetForm('paramForm')">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="editDialogVisible"
        title="编辑"
        width="500px"
        @close="handleClose('paramForm')">
        <el-form ref="paramForm" :model="paramForm" :rules="rules" status-icon label-width="120px" label-position="left">
          <el-form-item label="参数名称" prop="paramName">
            <el-input v-model="paramForm.paramName" maxlength="20" type="text"/>
          </el-form-item>
          <el-form-item label="参数类型" prop="paramType">
            <el-select v-model="paramForm.paramType" placeholder="请选择参数类型" style="width: 340px">
              <el-option
                v-for="item in typeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitEditForm('paramForm')">确 定</el-button>
          <el-button @click="resetForm('paramForm')">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </PageHeaderLayout>
</template>
<script src="./collectParam.js"></script>
<style scoped>
</style>
