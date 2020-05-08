<template>
  <PageHeaderLayout >
    <HeaderSearchAdd placeholder-text = "请输入表单名" @handleSearch="handleSearch" @handleAdd="handleAdd"/>
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
        <el-table-column label="表单名称" align="center" prop="name"/>
        <el-table-column label="备注" align="center" prop="remark"/>
        <!--<el-table-column label="密码" align="center"><template slot-scope="scope"><span>{{ scope.row.password }}</span></template></el-table-column>-->
        <el-table-column label="操作" align="center" width="400px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-view"
              @click="handleView(scope.row)">预览</el-button>
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
      @close="handleClose('formInfo')">
      <el-form ref="formInfo" :model="formInfo" :rules="rules" status-icon label-width="80px" label-position="left">
        <el-form-item label="表单名称" prop="name">
          <el-input v-model="formInfo.name" type="text" placeholder="请输入表单名称" maxlength="200"/>
        </el-form-item>
        <el-form-item label="表单内容" prop="content">
          <el-input v-model="formInfo.content" type="textarea" placeholder="请输入表单内容"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formInfo.remark" type="textarea" placeholder="请输入备注" maxlength="200"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="isDisable" type="primary" @click="submitForm('formInfo')">确 定</el-button>
        <el-button @click="resetForm('formInfo')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="编辑"
      width="500px"
      @close="handleClose('formInfo')">
      <el-form ref="formInfo" :model="formInfo" :rules="rules" status-icon label-width="80px" label-position="left">
        <el-form-item label="表单名称" prop="name">
          <el-input v-model="formInfo.name" type="text" placeholder="请输入表单名称" maxlength="200"/>
        </el-form-item>
        <el-form-item label="表单内容" prop="content">
          <el-input v-model="formInfo.content" type="textarea" placeholder="请输入表单内容"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formInfo.remark" type="textarea" placeholder="请输入备注" maxlength="200"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEditForm('formInfo')">确 定</el-button>
        <el-button @click="resetForm('formInfo')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="viewDialogVisible"
      title="预览表单内容">
      <div class="setcenter" v-html="viewHtml">123</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="thisClose('formInfo')">关 闭</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./formManage.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 0px;
    }
    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }
  .setcenter{
    overflow: auto;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    word-break: break-all;
  }
  .el-button--danger:focus{
    background: #f56c6c;
    border-color: #f56c6c;
    color: #fff;
  }
  .el-button--success:focus{
    color: #fff;
    background-color: #67c23a;
    border-color: #67c23a;
  }
</style>
