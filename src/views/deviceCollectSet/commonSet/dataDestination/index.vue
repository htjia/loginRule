<template>
  <PageHeaderLayout >
    <div class="">
      <HeaderSearchAdd placeholder-text = "请输入表名称" @handleSearch="handleSearch" @handleAdd="handleAdd"/>
      <div class="app-container">
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
          <el-table-column label="表名称" align="center" prop="tableName"/>
          <el-table-column label="存储类型" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.storageType === '0'">hdfs</span>
              <span v-if="scope.row.storageType === '1'">http</span>
              <span v-if="scope.row.storageType === '2'">mysql</span>
            </template>
          </el-table-column>
          <el-table-column label="存储路径" align="center" prop="storagePath" show-overflow-tooltip/>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                icon="el-icon-edit"
                @click="handleFieldConfig(scope.row)">配置字段</el-button>
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
        title="添加"
        width="500px"
        @close="handleClose('tableForm')">
        <el-form ref="tableForm" :model="tableForm" :rules="rules" label-position="left" status-icon label-width="120px">
          <el-form-item label="表名称：" prop="tableName">
            <el-input v-model="tableForm.tableName" type="text" maxlength="20" placeholder="请输入表名称"/>
          </el-form-item>
          <el-form-item label="存储类型：" prop="storageType">
            <el-select v-model="tableForm.storageType" placeholder="请选择存储类型" style="width: 340px">
              <el-option
                v-for="item in typeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="存储路径：" prop="storageUrl" placeholder="请输入存储路径">
            <el-input v-model="tableForm.storageUrl" maxlength="50" type="text"/>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('tableForm')">确 定</el-button>
          <el-button @click="resetForm('tableForm')">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="editDialogVisible"
        title="编辑"
        width="500px"
        @close="handleClose('tableForm')">
        <el-form ref="tableForm" :model="tableForm" :rules="rules" label-position="left" status-icon label-width="120px">
          <el-form-item label="表名称：" prop="tableName">
            <el-input v-model="tableForm.tableName" type="text" maxlength="20" placeholder="请输入表名称"/>
          </el-form-item>
          <el-form-item label="存储类型：" prop="storageType">
            <el-select v-model="tableForm.storageType" placeholder="请选择存储类型" style="width: 340px">
              <el-option
                v-for="item in typeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="存储路径：" prop="storageUrl" placeholder="请输入存储路径">
            <el-input v-model="tableForm.storageUrl" maxlength="50" type="text"/>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitEditForm('tableForm')">确 定</el-button>
          <el-button @click="resetForm('tableForm')">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="configFieldVisible"
        title="配置字段"
        width="800px"
        class="config-dialog"
        @close="configClose"
      >
        <div class="data-origin">
          <div>
            <div class="data-origin-title">主数据</div>
            <div class="data-origin-content">
              <el-tree v-if="!isExpand" :default-expanded-keys="['0']" :data="metaData" :default-expand-all="isExpand" accordion @node-click="handleNodeClick"/>
            </div>
            <el-button type="primary" icon="el-icon-plus" size="mini" style="margin-left: 40%" @click="addRelationMetaItem">添加</el-button>
          </div>
          <div style="margin-left: 2%">
            <div class="data-origin-title">采集参数</div>
            <div class="data-origin-content" style="padding:15px">
              <el-radio-group v-model="checkedRadio">
                <el-radio v-for="param in paramList" :key="param.id" :label="param.id" style="display: block;margin-left: 0;margin-bottom: 10px ">{{ param.paramName }}</el-radio>
              </el-radio-group>
            </div>
            <el-button type="primary" icon="el-icon-plus" size="mini" style="margin-left: 40%" @click="addRelationItem">添加</el-button>
          </div>
        </div>
        <el-table
          v-loading="listLoading"
          :data="relationList"
          element-loading-text="拼命加载中"
          border
          fit
          stripe
          max-height="300"
        >
          <el-table-column align="center" label="序号" width="95">
            <template slot-scope="scope">
              {{ scope.$index+1 }}
            </template>
          </el-table-column>
          <el-table-column label="字段名" align="center" prop="filedName"/>
          <el-table-column label="字段关联表" align="center" prop="tableName"/>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="handleDeleteRelation(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </PageHeaderLayout>
</template>
<script src="./dataDestination.js"></script>
<style scoped>
  .data-origin{
    overflow: hidden;
    margin-bottom: 10px;
  }
  .data-origin>div{
    float: left;
    width: 49%;
  }
  .data-origin-content{
    width: 100%;
    height: 260px;
    border:1px solid #009494;
    margin-bottom: 10px;
    overflow-x: hidden ;
    overflow-y: auto ;
  }
  .data-origin-title{
    font-size: 15px;
    text-align: center;
    margin-bottom: 10px;
    font-weight: bold;
    color: #009494;
  }
  .config-dialog>>>.el-dialog__body{
    padding: 16px;
  }
</style>
