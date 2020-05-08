<template>
  <PageHeaderLayout >
    <HeaderSearchAdd placeholder-text = "请输入流程名称" @handleSearch="handleSearch" @handleAdd="handleAdd"/>
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
        <el-table-column label="流程名称" align="center" prop="name"/>
        <el-table-column label="流程编号" align="center" prop="key"/>
        <el-table-column label="创建时间" align="center" prop="createTime"/>
        <el-table-column label="更新时间" align="center" prop="lastUpdateTime"/>
        <el-table-column label="分类" align="center" prop="category"/>
        <el-table-column label="部署标识" align="center" prop="deploymentId"/>
        <el-table-column label="版本" align="center" prop="version"/>
        <el-table-column label="操作" align="center" width="400px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit-outline"
              @click="showModeler(scope.row)">设计</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)">删除</el-button>
            <el-button
              size="mini"
              type="success"
              icon="el-icon-printer"
              @click="handlePush(scope.row)">发布</el-button>
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
      @close="handleClose('flowForm')">
      <el-form ref="flowForm" :model="flowForm" :rules="rules" status-icon label-width="80px" label-position="left">
        <el-form-item label="流程名称" prop="name">
          <el-input v-model="flowForm.name" type="text" placeholder="请输入流程名称" maxlength="200"/>
        </el-form-item>
        <el-form-item label="流程分类" prop="category">
          <el-select v-model="flowForm.category" placeholder="请选择流程分类" style="width: 380px;">
            <el-option
              v-for="item in mamangeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('flowForm')">确 定</el-button>
        <el-button @click="resetForm('flowForm')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="编辑"
      width="500px"
      @close="handleClose('flowForm')">
      <el-form ref="flowForm" :model="flowForm" :rules="rules" status-icon label-width="80px" label-position="left">
        <el-form-item label="流程名称" prop="name">
          <el-input v-model="flowForm.name" type="text" placeholder="请输入流程名称" maxlength="200"/>
        </el-form-item>
        <el-form-item label="流程分类" prop="category">
          <el-select v-model="flowForm.category" placeholder="请选择流程分类" style="width: 380px;">
            <el-option
              v-for="item in mamangeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="isDisable" type="primary" @click="submitEditForm('flowForm')">确 定</el-button>
        <el-button @click="resetForm('flowForm')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      id="iframst"
      :close-on-click-modal="false"
      :visible.sync="showDialogVisible"
      :before-close="handleClose1"
      title="设计"
      width="100%"
      height="100%">
      <iframe :src="iframeUrl" class="iframest" frameborder="0">12</iframe>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./flowChartManage.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .el-icon-close:focus{
    color: #fff;
  }
  #iframst{
    width: calc(100vw + 5px);
  }
  #iframst :first-child{
    margin-top: 0px !important;
    :first-child{
      color:#fff;
    }
    :nth-child(2){
      padding: 0px;
    }
  }
  #iframst .iframest{
    width: 100%;
    height: calc(100vh - 40px);
  }
  .dashboard {
    &-container {
      margin: 0px;
    }
    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }
  #discd :first-child{
    padding-left: 38px !important;
  }
  #discd :nth-child(2){
    margin-left: 0px !important;
    float: right;
    :first-child{
      padding-left: 15px !important;
      width: 378px;
      margin-left: -15px;
    }
  }
   #discd1 :first-child{
    padding-left: 38px !important;
  }
  #discd1 :nth-child(2){
    margin-left: 0px !important;
    float: right;
    :first-child{
      padding-left: 15px !important;
      width: 378px;
      margin-left: -15px;
    }
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
