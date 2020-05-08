<template>
  <PageHeaderLayout >
    <HeaderSearchAdd :has-add-btn="false" placeholder-text = "请输入被委托人" @handleSearch="handleSearch"/>
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
        <el-table-column label="被委托人" align="center" prop="mandataryName"/>
        <el-table-column label="委托人" align="center" prop="consignorName"/>
        <el-table-column label="委托流程" align="center" prop="processName"/>
        <el-table-column label="委托时间" align="center" prop="entrustTime"/>
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
  </PageHeaderLayout>
</template>

<script src="./delegateRecord.js"></script>

<style scoped>
</style>
