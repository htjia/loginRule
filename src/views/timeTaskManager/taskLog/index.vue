<template>
  <PageHeaderLayout :has_back = "true">
    <div class="">
      <div class="header-search-add">
        <el-input v-model="searchkey" placeholder="任务名称关键字" size="medium" class="searchInput" clearable/>
        <el-radio v-model="issucess" label="-1" class="radiostyle">不限</el-radio>
        <el-radio v-model="issucess" label="0" class="radiostyle">成功</el-radio>
        <el-radio v-model="issucess" label="1" class="radiostyle">失败</el-radio>
        <el-button size="medium" style="margin-left: 20px" type="primary" icon="el-icon-search" @click="handleSearch" >搜 索</el-button>
        <el-button
          style="margin-left: 10px;background: #5268A5;border-color: #5268A5 "
          size="medium"
          class="float-right-btn"
          type="primary"
          icon="el-icon-plus"
          @click="clearall"><svg-icon icon-class="clear"/> &nbsp;&nbsp;清空所有</el-button>
      </div>
      <div class="app-container relations-table">
        <div id="tableTop" style="margin-bottom: 15px"/>
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
          <el-table-column label="任务名称" align="center" prop="jobName"/>
          <el-table-column label="错误代码" align="center" prop="code"/>
          <el-table-column label="执行状态" align="center" prop="issucess">
            <template slot-scope="scope">
              <span v-if="scope.row.issucess === 0"><label style="color: #009688">成功</label></span>
              <span v-if="scope.row.issucess === 1"><label style="color: #E05C5C">失败</label></span>
            </template>
          </el-table-column>
          <el-table-column label="创建日期" align="center" prop="createTime"/>
          <el-table-column label="操作" align="center" width="400">
            <template slot-scope="scope">
              <el-button
                size="mini"
                icon="el-icon-search"
                type="primary"
                @click="handleDetail(scope.row)">详情</el-button>
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
        :visible.sync="detailVisible"
        title="任务详情"
        width="550px"
        @close="handleClose('jobForm')">
        <el-form ref="jobForm" :model="jobForm" :rules="rules" label-position="left" status-icon label-width="100px">
          <el-form-item label="任务名称：" prop="jobName">
            <span v-text="jobForm.jobName" />
          </el-form-item>
          <el-form-item label="错误代码：" prop="code">
            <span v-text="jobForm.code" />
          </el-form-item>
          <el-form-item label="创建日期：" prop="createTime">
            <span v-text="jobForm.createTime" />
          </el-form-item>
          <el-form-item label="执行状态：" prop="issucess">
            <template slot-scope="scope">
              <span v-if="scope.jobForm.issucess === '0'">成功</span>
              <span v-if="scope.jobForm.issucess === '1'">失败</span>
            </template>
          </el-form-item>
          <el-form-item label="日志详情：" prop="logContent">
            <div class="item-box" v-text="jobForm.logContent" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="resetForm('jobForm')">关闭</el-button>
        </span>
      </el-dialog>
    </div>
  </PageHeaderLayout>
</template>
<script src="./taskLog.js"></script>
<style scoped>
  .item-box{
    width:375px;
    word-wrap:break-word
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
  .relations-table{
    padding-top: 0;
  }
  .hint{
    font-size: 20px;
    width: 20px;
    margin: 40px auto 0;
  }
</style>
