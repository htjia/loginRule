<template>
  <PageHeaderLayout :has_back = "true">
    <div class="">
      <div class="header-search-add">
        <el-input v-model="searchkey" placeholder="定时任务名称关键字搜索" size="medium" class="searchInput" clearable/>
        <el-radio v-model="taskType" label="-1" class="radiostyle">不限</el-radio>
        <el-radio v-model="taskType" label="0" class="radiostyle">普通任务</el-radio>
        <el-radio v-model="taskType" label="1" class="radiostyle">Spark任务</el-radio>
        <el-button size="medium" style="margin-left: 20px" type="primary" icon="el-icon-search" @click="handleSearch" >搜 索</el-button>
        <el-button
          style="margin-left: 10px;background: #5268A5;border-color: #5268A5 "
          size="medium"
          class="float-right-btn"
          type="primary"
          icon="el-icon-plus"
          @click="addtask">添加新定时任务</el-button>
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
          <el-table-column label="名称" align="center" prop="jobName"/>
          <el-table-column label="类型" align="center" prop="taskType">
            <template slot-scope="scope">
              <span v-if="scope.row.taskType === 1">spark任务</span>
              <span v-if="scope.row.taskType === 0">普通任务</span>
              <span v-if="scope.row.taskType === -1">http请求</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createTime"/>
          <el-table-column label="操作" align="center" width="400">
            <template slot-scope="scope">
              <el-button
                size="mini"
                icon="el-icon-search"
                @click="handleDetail(scope.row)">详情</el-button>
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
        title="任务添加"
        width="600px"
        @close="handleClose('jobForm')">
        <el-form ref="jobForm" :model="jobForm" :rules="rules" label-position="left" status-icon label-width="180px">
          <el-form-item label="任务名称：" prop="jobName">
            <el-input v-model="jobForm.jobName" type="text" placeholder="请输入任务名称"/>
          </el-form-item>
          <el-form-item label="传入参数：" prop="param">
            <el-input v-model="jobForm.param" type="text" placeholder="请输入任务需要的参数"/>
          </el-form-item>
          <el-form-item label="任务执行超时时间：" prop="timeOut">
            <el-input v-model="jobForm.timeOut" type="text" placeholder="自然数，单位为秒"/>
          </el-form-item>
          <el-form-item label="任务等级：" prop="level">
            <el-input v-model="jobForm.level" type="number" min="-1" placeholder="数字越小，级别越低"/>
          </el-form-item>
          <el-form-item label="任务类型：" prop="taskType">
            <el-radio v-model="jobForm.taskType" label="-1" class="radiostyle">http请求</el-radio>
            <el-radio v-model="jobForm.taskType" label="0" class="radiostyle">普通任务</el-radio>
            <el-radio v-model="jobForm.taskType" label="1" class="radiostyle">Spark任务</el-radio>
          </el-form-item>
          <el-form-item label="任务jar包存放路径：" prop="jarPath">
            <el-input v-model="jobForm.jarPath" type="text" placeholder="请输入Jar包存放路径"/>
          </el-form-item>
          <el-form-item label="任务jar包中主类：">
            <el-input v-model="jobForm.taskClassName" type="text" placeholder="请输入jar包的中主类"/>
          </el-form-item>
          <el-form-item label="任务jar包执行方法：" prop="jarMethodName">
            <el-input v-model="jobForm.jarMethodName" type="text" placeholder="请输入jar包执行方法"/>
          </el-form-item>
          <el-form-item label="任务jar包执行方法类型：" prop="jarMethodType">
            <el-radio v-model="jobForm.jarMethodType" label="-1" class="radiostyle">网络方法</el-radio>
            <el-radio v-model="jobForm.jarMethodType" label="0" class="radiostyle">普通方法</el-radio>
            <el-radio v-model="jobForm.jarMethodType" label="1" class="radiostyle">静态方法</el-radio>
          </el-form-item>
          <el-form-item label="前置任务:">
            <el-select v-model="jobForm.preTask" multiple placeholder="请选择前置任务" style="width: 380px;">
              <el-option
                v-for="item in preTeskOptions"
                :key="item.jobId.toString()"
                :label="item.jobName"
                :value="item.jobId"/>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('jobForm')">确 定</el-button>
          <el-button @click="resetForm('jobForm')">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="editDialogVisible"
        title="编辑任务"
        width="600px"
        @close="handleClose('jobForm')">
        <el-form ref="jobForm" :model="jobForm" :rules="rules" label-position="left" status-icon label-width="180px">
          <el-form-item label="任务名称：" prop="jobName">
            <el-input v-model="jobForm.jobName" type="text" placeholder="请输入任务名称"/>
          </el-form-item>
          <el-form-item label="传入参数：" prop="param">
            <el-input v-model="jobForm.param" type="text" placeholder="请输入任务需要的参数"/>
          </el-form-item>
          <el-form-item label="任务执行超时时间：" prop="timeOut">
            <el-input v-model="jobForm.timeOut" type="text" placeholder="自然数，单位为秒"/>
          </el-form-item>
          <el-form-item label="任务等级：" prop="level">
            <el-input v-model="jobForm.level" type="number" min="-1" placeholder="数字越小，级别越低"/>
          </el-form-item>
          <el-form-item label="任务类型：" prop="taskType">
            <el-radio v-model="jobForm.taskType" label="-1" class="radiostyle">http请求</el-radio>
            <el-radio v-model="jobForm.taskType" label="0" class="radiostyle">普通任务</el-radio>
            <el-radio v-model="jobForm.taskType" label="1" class="radiostyle">Spark任务</el-radio>
          </el-form-item>
          <el-form-item label="任务jar包存放路径：" prop="jarPath">
            <el-input v-model="jobForm.jarPath" type="text" placeholder="请输入Jar包存放路径"/>
          </el-form-item>
          <el-form-item label="任务jar包中主类：">
            <el-input v-model="jobForm.taskClassName" type="text" placeholder="请输入jar包的中主类"/>
          </el-form-item>
          <el-form-item label="任务jar包执行方法：" prop="jarMethodName">
            <el-input v-model="jobForm.jarMethodName" type="text" placeholder="请输入jar包执行方法"/>
          </el-form-item>
          <el-form-item label="任务jar包执行方法类型：" prop="jarMethodType">
            <el-radio v-model="jobForm.jarMethodType" label="-1" class="radiostyle">网络方法</el-radio>
            <el-radio v-model="jobForm.jarMethodType" label="0" class="radiostyle">普通方法</el-radio>
            <el-radio v-model="jobForm.jarMethodType" label="1" class="radiostyle">静态方法</el-radio>
          </el-form-item>
          <el-form-item label="前置任务:">
            <el-select v-model="jobForm.preTask" multiple placeholder="请选择前置任务" style="width: 380px;">
              <el-option
                v-for="item in preTeskOptions"
                :key="item.jobId.toString()"
                :label="item.jobName"
                :value="item.jobId"/>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitEditForm('jobForm')">确 定</el-button>
          <el-button @click="resetForm('jobForm')">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="detailVisible"
        title="任务详情"
        width="600px"
        @close="handleClose('jobForm')">
        <el-form ref="jobForm" :model="jobForm" label-position="left" status-icon label-width="180px">
          <el-form-item label="任务名称：">
            <span v-text="jobForm.jobName" />
          </el-form-item>
          <el-form-item label="传入参数：">
            <div class="item-box" v-text="jobForm.param" />
          </el-form-item>
          <el-form-item label="任务执行超时时间：">
            <span v-text="jobForm.timeOut" />
            <span style="margin-left: 20px;color: #E25E5E" v-text="'[秒]'" />
          </el-form-item>
          <el-form-item label="任务等级：">
            <span v-text="jobForm.level" />
            <span style="margin-left: 20px;color: #E25E5E" v-text="'[数字越小，级别越高]'" />
          </el-form-item>
          <el-form-item label="任务类型：">
            <template slot-scope="scope">
              <span v-if="jobForm.taskType === '1'">spark任务</span>
              <span v-if="jobForm.taskType === '0'">普通任务</span>
              <span v-if="jobForm.taskType === '-1'">http请求</span>
            </template>
          </el-form-item>
          <el-form-item label="任务jar包存放路径：">
            <div class="item-box" v-text="jobForm.jarPath" />
          </el-form-item>
          <el-form-item label="任务jar包中主类：">
            <span v-text="jobForm.taskClassName" />
          </el-form-item>
          <el-form-item label="任务jar包执行方法：">
            <span v-text="jobForm.jarMethodName" />
          </el-form-item>
          <el-form-item label="任务jar包执行方法类型：">
            <template slot-scope="scope">
              <span v-if="jobForm.jarMethodType === '1'">静态任务</span>
              <span v-if="jobForm.jarMethodType === '0'">普通任务</span>
              <span v-if="jobForm.jarMethodType === '-1'">网络任务</span>
            </template>
          </el-form-item>
          <el-form-item label="前置任务：">
            <div class="item-box" v-text="preTaskName.join(',')" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="resetForm('jobForm')">关闭</el-button>
        </span>
      </el-dialog>
    </div>
  </PageHeaderLayout>
</template>
<script src="./taskList.js"></script>
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
