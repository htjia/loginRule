<template>
  <PageHeaderLayout :has_back = "true">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="拼命加载中"
      border
      fit
      stripe
      highlight-current-row>
      <el-table-column align="center" label="编码">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.deptName }}
        </template>
      </el-table-column>
      <el-table-column label="父级名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.parentCode }}</span>
        </template>
      </el-table-column>
    </el-table>
  </PageHeaderLayout>
</template>
<script src="./departmentDetail.js"></script>
