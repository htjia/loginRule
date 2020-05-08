<template>
  <PageHeaderLayout>
    <div>
      <div class="header-search-add">
        <el-input
          v-model="searchkey"
          placeholder="请输入流程名称"
          size="medium"
          class="searchInput"
          clearable
        >
          <template slot="append">
            <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜 索</el-button>
          </template>
        </el-input>
      </div>
      <div class="app-container">
        <el-table
          v-loading="listLoading"
          :data="list"
          element-loading-text="拼命加载中"
          border
          fit
          stripe
        >
          <el-table-column align="center" label="序号" width="95">
            <template slot-scope="scope">{{ scope.$index+1 }}</template>
          </el-table-column>
          <el-table-column label="流程名称" align="center" prop="name"/>
          <el-table-column label="流程编号" align="center" prop="key"/>
          <el-table-column label="部署标识" align="center" prop="deploymentId"/>
          <el-table-column label="版本" align="center" prop="version"/>
          <el-table-column align="center" label="状态" width="95">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 1">正常</span>
              <span v-if="scope.row.status === 2">挂起</span>
            </template>
          </el-table-column>
          <!--<el-table-column label="密码" align="center"><template slot-scope="scope"><span>{{ scope.row.password }}</span></template></el-table-column>-->
          <el-table-column label="操作" align="center" width="400px">
            <template slot-scope="scope">
              <el-button v-if="scope.row.status === 1" size="mini" icon="el-icon-sold-out" @click="handleHang(scope.row)">挂起</el-button>
              <el-button
                v-if="scope.row.status === 2"
                size="mini"
                type="success"
                icon="el-icon-setting"
                @click="handleActive(scope.row)"
              >激活</el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >删除</el-button>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-picture"
                @click="handleFlow(scope.row)"
              >流程图</el-button>
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
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="addDialogVisible"
      title="流程图"
    >
      <div style="width:100%;text-align:center;overflow-y:auto">
        <img :src="imgUrl">
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm()">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="deleteDialogVisible"
      title="删除"
      width="400px"
    >
      <div style="width:100%;text-align:center;">
        <div>此操作将永久删除该流程, 是否继续?</div>
        <el-checkbox v-model="deleteFlag" style="margin: 10px;">保留该流程历史数据</el-checkbox>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="isDisable" type="primary" @click="confirmDelete()">确 定</el-button>
        <el-button @click="resetForm()">关 闭</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./flowList.js"></script>

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
.config-dialog >>> .el-dialog__body {
  padding: 16px;
  text-align: center
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
