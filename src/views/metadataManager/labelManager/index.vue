<template>
  <PageHeaderLayout
    v-loading="isLoading"
    element-loading-text="正在初始化元数据规则,请稍后">
    <div class="header-search-add">
      <el-input v-model="searchkey" placeholder="请输入元数据规则" size="medium" class="searchInput" clearable>
        <template slot="append"><el-button type="primary" icon="el-icon-search" @click="handleSearch">搜 索</el-button></template>
      </el-input>
      <el-button
        style="margin-left: 10px"
        size="medium"
        class="float-right-btn"
        type="primary"
        @click="initRuleTable">初始化规则表</el-button>
      <el-button
        size="medium"
        class="float-right-btn"
        type="primary"
        icon="el-icon-plus"
        @click="handleAdd">添 加</el-button>
    </div>
    <div class="app-container">
      <tree-table
        v-loading="isLoadtree"
        :data="list"
        :eval-func="func"
        :eval-args="args"
        :expand-all="expandAll"
        element-loading-text="正在加载元数据规则。。。"
        border>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-plus"
              @click="append(scope.row)">添加</el-button>
            <el-button
              size="mini"
              icon="el-icon-edit"
              @click="edit(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="remove(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </tree-table>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      title="添加"
      width="500px"
      @close="handleClose('nodeForm')">
      <el-form ref="nodeForm" :model="nodeForm" :rules="rules" status-icon label-width="80px" label-position="left">
        <el-form-item label="规则名称" prop="nodeName">
          <el-input v-model="nodeForm.nodeName" type="text"/>
        </el-form-item>
        <el-form-item label="英文名" prop="enname">
          <el-input v-model="nodeForm.enname" type="text"/>
        </el-form-item>
        <el-form-item label="字段类型" prop="typeName">
          <el-select v-model="nodeForm.typeName" placeholder="请选择字段类型" style="width: 380px;">
            <el-option
              v-for="item in typeOptions"
              :key="item.name"
              :label="item.name"
              :value="item.name"/>
          </el-select>
        </el-form-item>
        <el-form-item label="字段长度" prop="fieldLength">
          <el-input v-model="nodeForm.fieldLength" type="number" min="0"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('nodeForm')">确 定</el-button>
        <el-button @click="resetForm('nodeForm')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="编辑"
      width="500px"
      @close="handleClose('nodeForm')">
      <el-form ref="nodeForm" :model="nodeForm" :rules="rules" status-icon label-width="80px" label-position="left">
        <el-form-item label="规则名称" prop="nodeName">
          <el-input v-model="nodeForm.nodeName" type="text"/>
        </el-form-item>
        <el-form-item label="英文名" prop="enname">
          <el-input v-model="nodeForm.enname" type="text"/>
        </el-form-item>
        <el-form-item label="字段类型" prop="typeName">
          <el-select v-model="nodeForm.typeName" placeholder="请选择字段类型" style="width: 380px;">
            <el-option
              v-for="item in typeOptions"
              :key="item.name"
              :label="item.name"
              :value="item.name"/>
          </el-select>
        </el-form-item>
        <el-form-item label="字段长度" prop="fieldLength">
          <el-input v-model="nodeForm.fieldLength" type="number" min="0"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEditForm('nodeForm')">确 定</el-button>
        <el-button @click="resetForm('nodeForm')">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout >
</template>
<script src="./labelManager.js"></script>
<style scoped>
  .custom-tree-node {
    flex: .4;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 20px;
  }
  .el-table th>.cell{
    padding-left: 15px;
  }
</style>
