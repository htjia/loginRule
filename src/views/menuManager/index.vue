<template>
  <PageHeaderLayout>
    <div class="header-search-add">
      <el-input v-model="searchkey" placeholder="请输入菜单名称" size="medium" class="searchInput" clearable>
        <template slot="append"><el-button type="primary" icon="el-icon-search" @click="handleSearch">搜 索</el-button></template>
      </el-input>
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
        element-loading-text="正在拼命加载请稍后..."
        border>
        <el-table-column label="菜单路由" align="center">
          <template slot-scope="scope">
            {{ scope.row.router }}
          </template>
        </el-table-column>
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
      @close="handleClose('menuForm')">
      <el-form ref="menuForm" :model="menuForm" :rules="rules" status-icon label-width="80px" label-position="left">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="menuForm.menuName" type="text" placeholder="请输入菜单名称"/>
        </el-form-item>
        <el-form-item label="菜单路由" prop="menuRouter">
          <el-input v-model="menuForm.menuRouter" type="text" placeholder="请输入菜单路由"/>
        </el-form-item>
        <el-form-item label="菜单功能">
          <el-select v-model="menuForm.menuFun" multiple placeholder="请选择菜单功能" style="width: 380px;">
            <el-option
              v-for="item in typeOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="排序序号" prop="sortNum">
          <el-input v-model="menuForm.sortNum" type="number" min="0" placeholder="请输入排序序号"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('menuForm')">确 定</el-button>
        <el-button @click="resetForm('menuForm')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="编辑"
      width="500px"
      @close="handleClose('menuForm')">
      <el-form ref="menuForm" :model="menuForm" :rules="rules" status-icon label-width="80px" label-position="left">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="menuForm.menuName" type="text" placeholder="请输入菜单名称"/>
        </el-form-item>
        <el-form-item label="菜单路由" prop="menuRouter">
          <el-input v-model="menuForm.menuRouter" type="text" placeholder="请输入菜单路由"/>
        </el-form-item>
        <el-form-item label="菜单功能">
          <el-select v-model="menuForm.menuFun" multiple placeholder="请选择菜单功能" style="width: 380px;">
            <el-option
              v-for="item in typeOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="排序序号" prop="sortNum">
          <el-input v-model="menuForm.sortNum" type="number" min="0" placeholder="请输入排序序号"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEditForm('menuForm')">确 定</el-button>
        <el-button @click="resetForm('menuForm')">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout >
</template>
<script src="./menuManager.js"></script>
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
