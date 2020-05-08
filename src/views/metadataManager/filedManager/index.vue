<template>
  <PageHeaderLayout :has_back = "true">
    <div class="">
      <HeaderSearchAdd placeholder-text = "请输入表字段名" @handleSearch="handleSearch" @handleAdd="handleAdd"/>
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
          <el-table-column label="字段名称" align="center" prop="fieldName"/>
          <el-table-column label="中文名" align="center" prop="cnname"/>
          <el-table-column label="字段类型" align="center" prop="typeName"/>
          <el-table-column label="字段长度" align="center" prop="fieldLength"/>
          <el-table-column label="标签" align="center" width="200">
            <template slot-scope="scope">
              <div v-if="scope.row.labelName" class="label-edit-btn" @click="labelEdit(scope.row)" v-text="scope.row.labelName"/>
              <div v-if="!scope.row.labelName" class="label-edit-btn" @click="labelEdit(scope.row)">配置标签</div>
            </template>
          </el-table-column>
          <el-table-column label="关联关系" align="center" width="300px">
            <template slot-scope="scope">
              <div v-if="scope.row.relation" >
                <div v-for="(item, index) in scope.row.relations" :key="index" class="label-edit-btn" @click="filedRelationEdit(scope.row)" v-text="item"/>
              </div>
              <div v-if="!scope.row.relation" class="label-edit-btn" @click="filedRelationEdit(scope.row)">配置关系</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="scope">
              <el-button
                size="mini"
                icon="el-icon-edit"
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
        title="添加"
        width="500px">
        <el-form ref="filedForm" :model="filedForm" :rules="rules" label-position="left" status-icon label-width="80px">
          <el-form-item label="字段名称" prop="fieldName">
            <el-input v-model="filedForm.fieldName" type="text"/>
          </el-form-item>
          <el-form-item label="中文名" prop="cnname">
            <el-input v-model="filedForm.cnname" type="text"/>
          </el-form-item>
          <el-form-item label="字段类型" prop="typeName">
            <el-select v-model="filedForm.typeName" placeholder="请选择字段类型" style="width: 380px;">
              <el-option
                v-for="item in typeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="字段长度" prop="fieldLength">
            <el-input v-model="filedForm.fieldLength" type="text"/>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="resetForm('filedForm')">取 消</el-button>
          <el-button type="primary" @click="submitForm('filedForm')">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="editDialogVisible"
        :before-close="handleClose"
        title="编辑"
        width="500px">
        <el-form ref="filedForm" :model="filedForm" :rules="rules" label-position="left" status-icon label-width="80px">
          <el-form-item label="字段名称" prop="fieldName">
            <el-input v-model="filedForm.fieldName" type="text"/>
          </el-form-item>
          <el-form-item label="中文名" prop="cnname">
            <el-input v-model="filedForm.cnname" type="text"/>
          </el-form-item>
          <el-form-item label="字段类型" prop="typeName">
            <el-select v-model="filedForm.typeName" placeholder="请选择字段类型" style="width: 380px;">
              <el-option
                v-for="item in typeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="字段长度" prop="fieldLength">
            <el-input v-model="filedForm.fieldLength" type="text"/>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="resetForm('filedForm')">取 消</el-button>
          <el-button type="primary" @click="submitEditForm('filedForm')">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="configDialogVisible"
        :before-close="handleClose"
        title="标签选择"
        width="500px">
        <el-form ref="configLabelForm" :model="configLabelForm" :rules="configLabelRules" status-icon label-width="0px" label-position="left">
          <el-input
            v-model="filterText"
            placeholder="输入关键字进行过滤"
            style="margin-bottom: 10px"
          />
          <el-form-item prop="labelName">
            <el-tree
              ref="labelTree"
              :filter-node-method="filterNode"
              :default-checked-keys="resourceCheckedKey"
              :data="treeData"
              style="height: 260px;overflow: auto;border:1px solid #d7d7d7;border-radius: 4px"
              show-checkbox
              node-key="id"/>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="resetForm('configLabelForm')">取 消</el-button>
          <el-button type="primary" @click="submitConfigLabelForm('configLabelForm')">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="filedRelationVisible"
        :before-close="handleClose"
        title="字段关系关联"
        width="700px">
        <div class="module-container">
          <el-table
            :data="selectedTable"
            element-loading-text="拼命加载中"
            border
            fit
            stripe
            max-height="210"
            highlight-current-row>
            <el-table-column align="center" label="序号" width="95">
              <template slot-scope="scope">
                {{ scope.$index+1 }}
              </template>
            </el-table-column>
            <el-table-column label="关联表" align="center" prop="tableName"/>
            <el-table-column label="关联字段" align="center" prop="filedName"/>
            <el-table-column label="操作" align="center" >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="module-container">
          <el-input v-model="searchkey" placeholder="请输入表名关键字" class="searchInput searchTableInput" clearable>
            <template slot="append"><el-button type="primary" icon="el-icon-search" @click="handleSearch">搜 索</el-button></template>
          </el-input>
          <div style="border: 1px solid #e2e2e2;margin-bottom: 10px"/>
          <div class="module-content-left">
            <el-table
              :data="tableList"
              element-loading-text="拼命加载中"
              border
              fit
              stripe
              height="400"
              highlight-current-row
              @row-click="rowClick"
            >
              <el-table-column align="center" label="序号" width="95">
                <template slot-scope="scope">
                  {{ scope.$index+1 }}
                </template>
              </el-table-column>
              <el-table-column label="表名" align="center" prop="name"/>
            </el-table>
          </div>
          <div class="module-content-right label-container">
            <div v-if="labelNames.length !== 0">
              <div v-for="item in labelNames" :key="item.id" class="label-item" @click="labelItemClick(item)">{{ item.cnname }}</div>
            </div>
            <div v-if="labelNames.length === 0" class="hint">
              请点击左侧表名获取对应字段
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submitConfigTableForm">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </PageHeaderLayout>
</template>
<script src="./filedManager.js"></script>
<style scoped>
  .app-container {
    background: #fff;
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
