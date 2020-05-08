<template>
  <PageHeaderLayout :has_back="true">
    <div class="module-container">
      <div class="module-title">
        <div class="module-title-text">产品列表</div>
      </div>
      <div class="module-content trend-content">
        <div id="tableTop" style="margin-bottom: 15px"/>
        <div class="search-ctn">
          <el-form ref="productForm" :inline="true" :model="productForm" :rules="rules" label-width="0" class="demo-ruleForm" style="float: left;margin-top:-2px;margin-bottom: -10px">
            <el-form-item
              prop="product">
              <el-select v-model="productForm.product" filterable clearable placeholder="请选择产品" size="medium" style="width: 260px;" @clear="clearSelected('productForm')">
                <el-option
                  v-for="item in productOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="medium" @click="submitForm('productForm')">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div style="float: right;margin-top: 12px">
          时间范围：<span v-text="beginDate">2018.10.15</span> 至 <span v-text="endDate">2.18.11.15</span>
        </div>
        <el-table
          v-loading="listLoading"
          :data="list.slice((pageNum-1)*pageSize, pageNum*pageSize)"
          element-loading-text="拼命加载中"
          border
          fit
          stripe
          highlight-current-row>
          <el-table-column align="center" label="排名" width="95">
            <template slot-scope="scope">
              {{ (pageNum - 1) * pageSize + scope.$index+1 }}
            </template>
          </el-table-column>
          <el-table-column label="产品名称" align="center" prop="productName"/>
          <el-table-column label="加工数量" align="center" prop="daNum"/>
          <el-table-column label="报废率" align="center" prop="rejectRatio">
            <template slot-scope="scope">
              {{ scope.row.rejectRatio }} %
            </template>
          </el-table-column>
          <el-table-column label="报废率方差" align="center" prop="stdDev"/>
          <el-table-column label="操作" align="center" max-width="550px">
            <template slot-scope="scope">
              <el-button
                size="mini"
                icon="el-icon-search"
                type="primary"
                @click="handleDetails(scope.row)">详情</el-button>
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
    </div>
  </PageHeaderLayout>
</template>

<script src="./productList.js"></script>

<style scoped>
  .trend-content{
    height: calc(100vh - 169px);
    overflow: auto;
    padding-top: 0;
  }
  .search-ctn>>>.el-form-item__error{
    position: static;
  }
</style>
