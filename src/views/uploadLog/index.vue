<template>
  <PageHeaderLayout >
    <div class="header-search-add">
      <span class="search-title">表名：</span>
      <el-input
        v-model="tableName"
        style="width: 170px"
        placeholder="请输入表名"
        clearable/>
      <span class="has-margin search-title">时间：</span>
      <el-date-picker
        :picker-options="pickerOptions"
        v-model="searchTime"
        type="datetimerange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd HH:mm:ss"/>
      <span class="has-margin search-title">上传状态：</span>
      <el-select v-model="uploadState" clearable placeholder="请选择" style="width: 120px">
        <el-option
          v-for="item in stateOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-button type="primary" icon="el-icon-search" class="has-margin" @click="handleSearch">搜 索</el-button>
      <el-button type="primary" icon="el-icon-download" class="has-margin" @click="handleDownload">下 载</el-button>
    </div>
    <div class="app-container log-table">
      <el-table
        v-loading="listLoading"
        :data="list"
        :default-sort = "{prop: 'tableName', order: 'descending'}"
        element-loading-text="拼命加载中"
        border
        fit
        stripe
        highlight-current-row
        @sort-change="sortChange">
        <el-table-column align="center" label="序号" width="95">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column prop="tableName" label="表名" align="center" sortable/>
        <el-table-column label="上传时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.uploadDate }}
          </template>
        </el-table-column>
        <el-table-column label="上传状态" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.uploadState === 0" type="success" size="small">成功</el-tag>
            <el-tag v-if="scope.row.uploadState === 1" type="danger" size="small">失败</el-tag>
            <el-tag v-if="scope.row.uploadState === 2" type="warning" size="small">未找到文件</el-tag>
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
  </PageHeaderLayout>
</template>
<style scoped>
  table.gridtable {
     font-family: verdana,arial,sans-serif;
     font-size:11px;
     color:#333333;
     border-width: 1px;
     border-color: #666666;
     border-collapse: collapse;
 }
 table.gridtable th {
    border-width: 1px;
    padding: 8px;
    border-style: solid;
    border-color: #666666;
    background-color: #dedede;
  }
   table.gridtable td {
    border-width: 1px;
    padding: 5px 2px;
    width: 60px;
     text-align: center;
    border-style: solid;
    border-color: #666666;
    background-color: #ffffff;
  }
  table.gridtable td.none-bottom-border{
    border-bottom-color: transparent;
  }
  /*.log-table>>> .el-table tr:nth-child(1) td{*/
    /*background: #ff4d4d !important;*/
    /*color: #fff;*/
  /*}*/
  /*.log-table>>> .el-table tr:nth-child(2) td{*/
    /*background: #fe7373 !important;*/
    /*color: #fff;*/
  /*}*/
  /*.log-table>>> .el-table tr:nth-child(3) td{*/
    /*background: #ff9797 !important;*/
    /*color: #fff;*/
  /*}*/
</style>
<script src="./uploadLog.js"></script>

