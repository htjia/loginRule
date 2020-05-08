<template>
  <PageHeaderLayout >
    <div class="">
      <HeaderSearchAdd placeholder-text = "请输入集群名称" @handleSearch="handleSearch" @handleAdd="handleAdd"/>
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
          <el-table-column label="集群名称" align="center">
            <template slot-scope="scope">
              {{ scope.row.content }}
            </template>
          </el-table-column>
          <el-table-column label="url" align="center">
            <template slot-scope="scope">
              {{ scope.row.url }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="300px">
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
        :before-close="handleClose"
        title="添加"
        width="500px">
        <el-form ref="resetForm" :model="resetForm" :rules="rules" label-position="left" status-icon label-width="80px">
          <el-form-item label="集群名称" prop="roleName">
            <el-input v-model="resetForm.roleName" type="text"/>
          </el-form-item>
          <el-form-item label="url" prop="roleName">
            <el-input v-model="resetForm.url" type="text"/>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="resetForms('resetForm')">取 消</el-button>
          <el-button type="primary" @click="submitForm('resetForm')">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="editDialogVisible"
        :before-close="handleClose"
        title="编辑"
        width="500px">
        <el-form ref="resetForm" :model="resetForm" :rules="rules" status-icon label-width="80px" label-position="left">
          <el-form-item label="集群名称" prop="roleName">
            <el-input v-model="resetForm.roleName" type="text"/>
          </el-form-item>
          <el-form-item label="url" prop="roleName">
            <el-input v-model="resetForm.url" type="text"/>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="resetForms('resetForm')">取 消</el-button>
          <el-button type="primary" @click="submitEditForm('resetForm')">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </PageHeaderLayout>
</template>
<script src="./hdfsManager.js"></script>
<style scoped>
</style>
