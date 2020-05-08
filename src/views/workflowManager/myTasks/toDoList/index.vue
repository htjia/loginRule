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
        <el-table-column label="到达时间" align="center" prop="createTime"/>
        <el-table-column label="发起人" align="center" prop="startUser"/>
        <el-table-column label="状态" align="center" prop="username">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1">正常</span>
            <span v-if="scope.row.status === 2">挂起</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="400">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status !== 2"
              size="mini"
              icon="el-icon-edit"
              @click="transact(scope.row)"
            >办理</el-button>
            <el-button
              v-if="scope.row.status !== 2"
              size="mini"
              type="danger"
              icon="el-icon-back"
              @click="rollback(scope.row)"
            >回退</el-button>
            <el-button
              v-if="scope.row.status !== 2"
              size="mini"
              type="primary"
              @click="handleTurn(scope.row)"
            ><svg-icon icon-class="zhuan-ban"/> 转办</el-button>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-search"
              @click="viewDetails(scope.row)"
            >详情</el-button>
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
      :visible.sync="trunVisible"
      title="转办"
      width="480px"
      @close="handleClose('turnForm')">
      <el-form ref="turnForm" :model="turnForm" :rules="rules" label-position="left" status-icon label-width="100px">
        <el-form-item label="转办人" prop="person">
          <el-select v-model="turnForm.person" placeholder="请选择转办人" style="width: 340px">
            <el-option
              v-for="item in workerOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('turnForm')">确 定</el-button>
        <el-button @click="resetForm('turnForm')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="transactVisible"
      title="办理"
      width="600px"
    >
      <form id="taskFrom" label-position="left" v-html="taskFrom">&nbsp;
      </form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitCompleteForm()">确 定</el-button>
        <el-button @click="resetCompleteForm">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="backDialogVisible"
      title="回退"
      width="400px"
    >
      <div style="width:100%;text-align:center;">
        <div>此操作将回退该任务, 是否继续?</div>
        <br><el-input v-model="reason" type="textarea" placeholder="请输入回退原因" maxlength="1000"/>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmDelete()">确 定</el-button>
        <el-button @click="resetCompleteForm">关 闭</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./toDoList.js"></script>

<style scoped>
  .workDialog>>>.el-dialog__body {
    padding: 15px;
    text-align: center;
  }
</style>
