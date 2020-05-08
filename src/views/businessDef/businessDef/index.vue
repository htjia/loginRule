<template>
  <PageHeaderLayout :has_back = "true">
    <div class="">
      <div class="header-search-add">
        <el-input v-model="searchkey" placeholder="业务名称关键字搜索" size="medium" class="searchInput" clearable/>
        <el-button size="medium" style="margin-left: 5px" type="primary" icon="el-icon-search" @click="handleSearch" >搜 索</el-button>
        <el-button
          style="margin-left: 10px;background: #5268A5;border-color: #5268A5"
          size="medium"
          class="float-right-btn"
          type="primary"
          icon="el-icon-plus"
          @click="addtask">添加新业务</el-button>
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
          <el-table-column label="业务名称" align="center" prop="name"/>
          <el-table-column label="英文名称" align="center" prop="enname"/>
          <el-table-column label="业务描述" align="center" prop="description"/>
          <el-table-column label="操作" align="center" width="450">
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
              <el-button
                size="mini"
                icon="el-icon-document"
                type="success"
                @click="handleInterface(scope.row)">对外接口</el-button>
              <el-button
                size="mini"
                icon="el-icon-setting"
                type="info"
                @click="sqlSet(scope.row)">SQL设置</el-button>
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
        :before-close="handleClose"
        title="添加新业务"
        width="600px"
        @close="handleClose('busiForm')">
        <el-form ref="busiForm" :model="busiForm" :rules="rules" label-position="left" status-icon label-width="180px">
          <el-form-item label="业务中文名称：" prop="name">
            <el-input v-model="busiForm.name" type="text" placeholder="请输入业务中文名称,不大于50字"/>
          </el-form-item>
          <el-form-item label="业务英文名称：" prop="enname">
            <el-input v-model="busiForm.enname" type="text" placeholder="请输入业务英文名称,不大于50字"/>
          </el-form-item>
          <el-form-item label="业务描述：" prop="description">
            <el-input v-model="busiForm.description" type="text" placeholder="255字以内"/>
          </el-form-item>
          <el-form-item label="对外展示字段：" prop="apiResult">
            <el-input v-model="busiForm.apiResult" type="text" />
          </el-form-item>
          <el-form-item label="字段类型转换：" prop="fieldSetInfo">
            <el-input v-model="busiForm.fieldSetInfo" :autosize="{ minRows: 2, maxRows: 6}" type="textarea" />
          </el-form-item>
          <el-form-item label="接口中文帮助：" prop="apiHelp">
            <el-input v-model="busiForm.apiHelp" :autosize="{ minRows: 2, maxRows: 8}" type="textarea" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('busiForm')">确 定</el-button>
          <el-button @click="resetForm('busiForm')">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="editDialogVisible"
        title="编辑任务"
        width="600px"
        @close="handleClose('busiForm')">
        <el-form ref="busiForm" :model="busiForm" :rules="rules" label-position="left" status-icon label-width="130px">
          <el-form-item label="业务中文名称：" prop="name">
            <el-input v-model="busiForm.name" type="text" placeholder="请输入业务中文名称,不大于50字"/>
          </el-form-item>
          <el-form-item label="业务英文名称：" prop="enname">
            <el-input v-model="busiForm.enname" type="text" placeholder="请输入业务英文名称,不大于50字"/>
          </el-form-item>
          <el-form-item label="业务描述：" prop="description">
            <el-input v-model="busiForm.description" type="text" placeholder="255字以内"/>
          </el-form-item>
          <el-form-item label="对外展示字段：" prop="apiResult">
            <el-input v-model="busiForm.apiResult" type="text" />
          </el-form-item>
          <el-form-item label="字段类型转换：" prop="fieldSetInfo">
            <el-input v-model="busiForm.fieldSetInfo" :autosize="{ minRows: 2, maxRows: 6}" type="textarea" />
          </el-form-item>
          <el-form-item label="接口中文帮助：" prop="apiHelp">
            <el-input v-model="busiForm.apiHelp" :autosize="{ minRows: 2, maxRows: 8}" type="textarea" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitEditForm('busiForm')">确 定</el-button>
          <el-button @click="resetForm('busiForm')">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="preProDataVisible"
        title="对外接口"
        width="600px"
        @close="handleClose(interfaceForm)">
        <el-form ref="interfaceForm" :model="interfaceForm" label-position="right" status-icon label-width="100px">
          <el-form-item label="接口名称：" prop="name">
            <span v-text="interfaceForm.name" />
          </el-form-item>
          <el-form-item label="接口类型：" prop="name">
            <span v-text="interfaceForm.type" />
          </el-form-item>
          <el-form-item label="接口参数：" prop="inputParam">
            <el-input v-model="interfaceForm.inputParam" :autosize="{ minRows: 2, maxRows: 6}" type="textarea" readonly="true"/>
          </el-form-item>
          <el-form-item label="businessId：" prop="name">
            <span v-text="interfaceForm.businessId" />
          </el-form-item>
          <el-form-item label="返回结果：" prop="outParam">
            <el-input v-model="interfaceForm.outParam" :autosize="{ minRows: 2, maxRows: 8}" type="textarea" readonly="true"/>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="resetForm()">关闭</el-button>
        </span>
      </el-dialog>
    </div>
  </PageHeaderLayout>
</template>
<script src="./businessDef.js"></script>
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
  .relations-table{
    padding-top: 0;
  }
  .hint{
    font-size: 20px;
    width: 20px;
    margin: 40px auto 0;
  }
</style>
