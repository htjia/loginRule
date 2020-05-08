<template>
  <PageHeaderLayout>
    <div>
      <div class="header-search-add">
        <el-input v-model="searchkey" placeholder="请输入流程发起人" size="medium" class="searchInput" clearable>
          <template slot="append"><el-button type="primary" icon="el-icon-search" @click="handleSearch">搜 索</el-button></template>
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
          <el-table-column label="标题" align="center" prop="name"/>
          <el-table-column label="流程环节" align="center" prop="nodeName"/>
          <el-table-column label="到达时间" align="center" prop="createTime"/>
          <el-table-column label="发起人" align="center" prop="startUser"/>
          <el-table-column align="center" label="状态" width="95">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 1">正常</span>
              <span v-if="scope.row.status === 2">挂起</span>
            </template>
          </el-table-column>
          <!--<el-table-column label="密码" align="center"><template slot-scope="scope"><span>{{ scope.row.password }}</span></template></el-table-column>-->
          <el-table-column label="操作" align="center" width="450px">
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
                icon="el-icon-circle-close"
                @click="handleDelete(scope.row)"
              >终止</el-button>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-info"
                @click="handleFlow(scope.row)"
              >详情</el-button>
              <el-button
                v-if="scope.row.status === 1"
                size="mini"
                type="warning "
                icon="el-icon-caret-right"
                @click="handleJump(scope.row)"
              >跳过</el-button>
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
      title="详情"
      width="800px"
      class="config-dialog"
    >
      <div class="data-origin imgcenter">
        <img :src="imgUrl" alt="">
      </div>
      <div style="padding-bottom: 15px;">
        <el-table
          v-loading="listLoading"
          :data="imgDate"
          element-loading-text="拼命加载中"
          border
          fit
          stripe
          max-height="300">
          <el-table-column align="center" label="序号" width="60">
            <template slot-scope="scope">
              {{ scope.$index+1 }}
            </template>
          </el-table-column>
          <el-table-column label="环节名称" align="center" prop="currentNode" width="200" show-overflow-tooltip/>
          <el-table-column label="开始时间" align="center" prop="createTime" show-overflow-tooltip/>
          <el-table-column label="结束时间" align="center" prop="endTime" show-overflow-tooltip/>
          <el-table-column label="执行人" align="center" prop="transactor" show-overflow-tooltip/>
        </el-table>
        <el-pagination
          v-if="imgTotalPage>15"
          :current-page="imgPageNum"
          :page-sizes="[15, 30, 40]"
          :page-size="imgPageSize"
          :total="imgTotalPage"
          class="pagination"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="imgSizeChange"
          @current-change="imgCurrentChange"
        />
      </div>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="deleteDialogVisible"
      title="终止"
      width="400px"
    >
      <div style="width:100%;text-align:center;">
        <div>此操作将终止该任务, 是否继续?</div>
        <el-checkbox v-model="deleteFlag" style="margin: 10px;">保留该流程历史数据</el-checkbox>
        <br><el-input v-model="reason" type="textarea" placeholder="请输入终止原因" maxlength="1000"/>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="isDisable" type="primary" @click="confirmDelete()">确 定</el-button>
        <el-button @click="resetForm()">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="jumpDialogVisible"
      title="跳过"
      width="400px"
    >
      <div style="width:100%;text-align:center;">
        <div>此操作将跳过当前任务环节, 是否继续?</div>
        <br><el-input v-model="reason" type="textarea" placeholder="请输入跳过原因" maxlength="1000"/>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="isDisable" type="primary" @click="confirmJump()">确 定</el-button>
        <el-button @click="resetForm()">关 闭</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./folwMonitor.js"></script>

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
.imgcenter{
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
  .el-button--warning:focus{
    color: #fff;
    background-color: #e6a23c;
    border-color: #e6a23c;
  }
</style>
