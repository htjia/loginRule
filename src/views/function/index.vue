<template>
  <PageHeaderLayout >
    <HeaderSearchAdd placeholder-text = "请输入功能名称" @handleSearch="handleSearch" @handleAdd="handleAdd"/>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="95">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="功能名称" align="center" prop="name"/>
        <el-table-column label="功能标识" align="center" prop="key"/>
        <el-table-column label="操作" align="center" max-width="550px">
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
      width="400px"
      @close="handleClose('functionForm')">
      <el-form ref="functionForm" :model="functionForm" :rules="rules" status-icon label-width="100px" label-position="left">
        <el-form-item label="功能名称" prop="name">
          <el-input v-model="functionForm.name" type="text" placeholder="请输入功能名称"/>
        </el-form-item>
        <el-form-item label="功能标识" prop="name">
          <el-input v-model="functionForm.key" type="text" placeholder="请输入功能标识"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('functionForm')">确 定</el-button>
        <el-button @click="resetForm('functionForm')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="编辑"
      width="400px"
      @close="handleClose('functionForm')">
      <el-form ref="functionForm" :model="functionForm" :rules="rules" status-icon label-width="100px" label-position="left">
        <el-form-item label="功能名称" prop="name">
          <el-input v-model="functionForm.name" type="text" placeholder="请输入功能名称"/>
        </el-form-item>
        <el-form-item label="功能标识" prop="name">
          <el-input v-model="functionForm.key" type="text" placeholder="请输入功能标识"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEditForm('functionForm')">确 定</el-button>
        <el-button @click="resetForm('functionForm')">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./function.js"></script>

<style scoped>
</style>
