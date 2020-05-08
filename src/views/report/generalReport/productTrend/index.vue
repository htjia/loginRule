<template>
  <PageHeaderLayout :has_back="true">
    <div class="module-container">
      <div class="module-title">
        <div class="module-title-text">产品趋势</div>
      </div>
      <div class="module-content trend-content">
        <div id="tableTop" style="margin-bottom: 15px"/>
        <el-date-picker
          v-model="beginDate"
          :picker-options="pickerOptionsStart"
          :editable="false"
          size="small"
          style="width:145px"
          type="date"
          placeholder="选择开始日期"
          value-format="timestamp"
          @change="checkTime"
        />
        <el-date-picker
          v-model="endDate"
          :picker-options="pickerOptionsEnd"
          :editable="false"
          class="has-margin"
          size="small"
          style="width:145px"
          type="date"
          placeholder="选择结束日期"
          value-format="timestamp"
        />
        <el-button type="primary" icon="el-icon-search" size="small" style="height: 32px;margin-bottom: 15px" class="has-margin" @click="handleSearch">搜索</el-button>
        <el-table
          v-loading="listLoading"
          :data="list"
          tooltip-effect="dark"
          element-loading-text="拼命加载中"
          border
          fit
          stripe
          highlight-current-row>
          <el-table-column label="日期" align="center" prop="everyday" show-overflow-tooltip/>
          <el-table-column label="加工量" align="center" prop="daNum"/>
          <el-table-column label="报废率" align="center" prop="username">
            <template slot-scope="scope">{{ scope.row.rejectRatio }} %</template>
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
    </div>
  </PageHeaderLayout>
</template>

<script src="./productTrend.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .has-margin{
    margin-left: 10px;
  }
  .trend-content{
    padding-top: 0;
    height: calc(100vh - 169px);
    overflow: auto;
  }
</style>
