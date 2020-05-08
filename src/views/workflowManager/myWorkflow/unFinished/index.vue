<template>
  <PageHeaderLayout >
    <HeaderSearchAdd :has-add-btn="false" placeholder-text = "请输入流程名称" @handleSearch="handleSearch"/>
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
        <el-table-column label="版本" align="center" prop="version"/>
        <el-table-column label="创建时间" align="center" prop="createTime"/>
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1">正常</span>
            <span v-if="scope.row.status === 2">挂起</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-search"
              type="primary"
              @click="viewDetails(scope.row)"
            >详情</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-circle-close-outline"
              @click="handleEnd(scope.row)"
            >终止</el-button>
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
      :visible.sync="viewDetailsVisible"
      title="详情"
      width="1200px"
      class="workDialog"
      @close="handleClose">
      <img :src="encode" style="max-width: 1160px">
      <el-table
        v-loading="listLoading"
        :data="detailList"
        element-loading-text="拼命加载中"
        max-height="420"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="95">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="环节名称" align="center" prop="currentNode"/>
        <el-table-column label="开始时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.createTime }}
          </template>
        </el-table-column>
        <el-table-column label="结束时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.endTime }}
          </template>
        </el-table-column>
        <el-table-column label="执行人" align="center" prop="transactor"/>
      </el-table>
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
        <el-button @click="resetForm">关 闭</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./unFinished.js"></script>

<style scoped>
  .workDialog>>>.el-dialog__body {
    padding: 15px;
    text-align: center;
  }
</style>
