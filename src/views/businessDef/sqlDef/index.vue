<template>
  <PageHeaderLayout :has_back = "true">
    <div class="">
      <div class="header-search-add">
        <el-button
          style="margin-left: 10px;background: #5268A5 "
          size="medium"
          class="float-right-btn"
          type="primary"
          icon="el-icon-plus"
          @click="addSQL">添加新SQL</el-button>
      </div>
      <div class="app-container relations-table">
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
          <el-table-column label="表名称" align="center" prop="sqlTable" width="150"/>
          <el-table-column label="sql" align="center" prop="sqlInfo"/>
          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="scope">
              <el-button
                size="mini"
                icon="el-icon-edit"
                type="primary"
                @click="handleEdit(scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="addDialogVisible"
        :before-close="handleClose"
        title="添加新SQL"
        width="600px">
        <el-form ref="sqlForm" :model="sqlForm" :rules="rules" label-position="left" status-icon label-width="180px">
          <el-form-item label="表名：" prop="tablename">
            <el-input v-model="sqlForm.tablename" type="text" placeholder="请输入表名,不大于50字符"/>
          </el-form-item>
          <el-form-item label="参数：" prop="sqlParam">
            <el-input v-model="sqlForm.sqlParam" type="text" placeholder="请输入参数,不大于100字符"/>
          </el-form-item>
          <el-form-item label="SQL：" prop="sql">
            <el-input
              v-model="sqlForm.sql"
              type="textarea"
              placeholder="请输入SQL,不大于2000字符"/>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('sqlForm')">确 定</el-button>
          <el-button @click="resetForm('sqlForm')">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="editDialogVisible"
        title="编辑任务"
        width="600px"
        hight="800px"
        @close="handleClose('sqlForm')">
        <el-form ref="sqlForm" :model="sqlForm" :rules="rules" label-position="left" status-icon label-width="80px">
          <el-form-item label="表名：" prop="tablename">
            <el-input v-model="sqlForm.tablename" type="text" placeholder="请输入表名,不大于50字符"/>
          </el-form-item>
          <el-form-item label="参数：" prop="sqlParam">
            <el-input v-model="sqlForm.sqlParam" type="text" placeholder="请输入参数,不大于100字符"/>
          </el-form-item>
          <el-form-item label="SQL：" prop="sql">
            <el-input
              v-model="sqlForm.sql"
              :autosize="{ minRows: 2, maxRows: 16}"
              type="textarea"/>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitEditForm('sqlForm')">确 定</el-button>
          <el-button @click="resetForm('sqlForm')">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </PageHeaderLayout>
</template>
<script src="./sqlDef.js"></script>
<style scoped>
  .digmodulecotext{
    margin-top: 10px;
  }
  .app-container {
    background: #fff;
  }
  .radiostyle{
    margin-left: 10px;
  }
  .module-content-left{
    float: left;
    width: 63%;
    height: 400px;
    border:0px solid #ebeef5;
  }
  .module-content-right{
    padding-left: 15px;
    float: left;
    width: 35%;
  }
  .label-edit-btn{
    cursor: pointer;
    color: #009494;
  }
  .label-container{
    height: 400px;
    border:1px solid #e2e2e2;
    margin-left: 2%;
    padding: 10px 0;
    overflow: auto;
  }
  .label-item{
    height: 35px;
    line-height: 35px;
    padding-left: 10px;
    cursor: pointer;
  }
  .label-item:hover{
    background: #8bcec7;
  }
  .searchTableInput{
    width: 415px;
  }
  .relations-table>>>.el-table td div{
    line-height: 30px;
  }
  .hint{
    font-size: 20px;
    width: 20px;
    margin: 40px auto 0;
  }
</style>
