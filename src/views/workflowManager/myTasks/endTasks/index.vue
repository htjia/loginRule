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
        <el-table-column label="流程名称" align="center" prop="flowName"/>
        <el-table-column label="到达时间" align="center" prop="startTime"/>
        <el-table-column label="完成时间" align="center" prop="endTime"/>
        <el-table-column label="持续时间" align="center" prop="duration"/>
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <el-tooltip placement="top">
              <div slot="content">
                <span v-if="scope.row.reason !== 'completed'" v-text="scope.row.reason"/>
                <span v-if="scope.row.reason === 'completed'">正常</span>
              </div>
              <div :class="scope.row.status === '终止'? 'text-red' : ''" v-text="scope.row.status"/>
            </el-tooltip>
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
              v-if="scope.row.complete === 1"
              size="mini"
              type="danger"
              @click="revocation(scope.row)"
            ><svg-icon icon-class="revocation"/> 撤回</el-button>
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
        <el-table-column label="执行人" align="center" prop="transactor">
          <template slot-scope="scope">
            <el-tooltip placement="top">
              <div slot="content">
                <span v-if="scope.row.reason !== 'completed'" v-text="scope.row.reason"/>
                <span v-if="scope.row.reason === 'completed'">正常</span>
              </div>
              <div v-text="scope.row.transactor"/>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./endTasks.js"></script>

<style scoped>
  .workDialog>>>.el-dialog__body {
    padding: 15px;
    text-align: center;
  }
  .text-red{
    color: #ff3f3f;
  }
</style>

