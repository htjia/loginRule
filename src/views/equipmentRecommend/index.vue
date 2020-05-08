<template>
  <PageHeaderLayout >
    <div v-if="!isStart" class="start-container">
      <img class="start-bg-img" src="../../../static/img/search-02.jpg">
      <div class="start-center-ctn">
        <img class="start-img" src="../../../static/img/search-logo.png">
        <div class="select-box">
          <el-form ref="productModelForm" :model="productModelForm" :rules="rules" label-width="0" class="demo-ruleForm">
            <!--<el-form-item>
              <el-select v-model="factoryType" placeholder="请选择厂号" style="width: 145px">
                <el-option
                  v-for="item in factoryOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </el-form-item>-->
            <el-form-item
              prop="productModel">
              <el-select v-model="productModelForm.productModel" filterable placeholder="请选择产品型号" style="width: 300px;" @change="productIdChange">
                <el-option
                  v-for="item in productModelOptions"
                  :key="item.materialId"
                  :label="item.materialType"
                  :value="item.materialId"/>
              </el-select>
              <el-button type="primary" icon="el-icon-search" class="has-margin" @click="submitForm('productModelForm')">开始推荐</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div v-if="isStart">
      <div class="header-search-add">
        <el-select v-model="productModelForm.productModel" filterable placeholder="请选择产品型号" size="medium" style="width: 300px;" @change="productIdChange">
          <el-option
            v-for="item in productModelOptions"
            :key="item.materialId"
            :label="item.materialType"
            :value="item.materialId"/>
        </el-select>
        <el-button type="primary" icon="el-icon-search" class="has-margin" size="medium" @click="submitForm('')">开始推荐</el-button>
      </div>
      <div class="module-container">
        <div class="module-title">
          <div class="module-title-text">设备及模具推荐</div>
          <div class="search-box">
            <el-select v-model="eqptCode" filterable placeholder="请选择设备信息" size="mini" @change="selectedChange">
              <el-option
                v-for="item in eqptCodeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
            <el-select v-model="mouldCode" filterable placeholder="请选择模具信息" size="mini" @change="selectedChange">
              <el-option
                v-for="item in mouldCodeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
            <el-button style="height: 27px;" type="primary" size="mini" @click="clearSelected"><svg-icon icon-class="clear"/> 清除筛选</el-button>
          </div>
        </div>
        <div class="module-content equipment-table">
          <el-table
            v-loading="listLoading"
            :data="list"
            element-loading-text="拼命加载中"
            border
            fit
            stripe
            highlight-current-row
            @sort-change="sortChange"
            @row-click="rowClick">
            <el-table-column align="center" label="排名" width="95">
              <template slot-scope="scope">
                <div :class="scope.row.colorLevel==1? 'one' :scope.row.colorLevel==2? 'two':scope.row.colorLevel==3?'three':''">{{ scope.row.rank }}</div>
              </template>
            </el-table-column>
            <el-table-column label="推荐组合" align="center" width="320px">
              <template slot-scope="scope">
                <div :class="scope.row.colorLevel==1? 'one' :scope.row.colorLevel==2? 'two':scope.row.colorLevel==3?'three':''">{{ scope.row.recommendGroup }}</div>
              </template>
            </el-table-column>
            <el-table-column label="推荐等级" prop="recomemdLevel" align="center">
              <template slot-scope="scope">
                <div :class="scope.row.colorLevel==1? 'one' :scope.row.colorLevel==2? 'two':scope.row.colorLevel==3?'three':''">
                  <span v-if="scope.row.recomemdLevel === 1">Ⅰ</span>
                  <span v-if="scope.row.recomemdLevel === 2">Ⅱ</span>
                  <span v-if="scope.row.recomemdLevel === 3">Ⅲ</span>
                  <span v-if="scope.row.recomemdLevel === 4">Ⅳ</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="综合报废率" prop="rejectatio" align="center" sortable>
              <template slot-scope="scope">
                <div :class="scope.row.colorLevel==1? 'one' :scope.row.colorLevel==2? 'two':scope.row.colorLevel==3?'three':''">{{ scope.row.rejectatio }} %</div>
              </template>
            </el-table-column>
            <el-table-column label="生产总数" align="center" prop="daNum" sortable>
              <template slot-scope="scope">
                <div :class="scope.row.colorLevel==1? 'one' :scope.row.colorLevel==2? 'two':scope.row.colorLevel==3?'three':''">{{ scope.row.daNum }}</div>
              </template>
            </el-table-column>
            <el-table-column label="设备编号" align="center">
              <template slot-scope="scope">
                <el-tooltip placement="top">
                  <div slot="content">
                    设备编号： <span class="table-tooltip-text">{{ scope.row.eqptCode }}</span>
                    设备品牌： <span class="table-tooltip-text">{{ scope.row.eqptBrand }}</span>
                    设备型号： <span class="table-tooltip-text">{{ scope.row.eqptMould }}</span>
                    设备吨位： <span>{{ scope.row.power }}</span> 吨
                  </div>
                  <div :class="scope.row.colorLevel==1? 'one' :scope.row.colorLevel==2? 'two':scope.row.colorLevel==3?'three':''">{{ scope.row.eqptCode }}</div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="设备等级" align="center">
              <template slot-scope="scope">
                <div :class="scope.row.colorLevel==1? 'one' :scope.row.colorLevel==2? 'two':scope.row.colorLevel==3?'three':''">
                  <span v-if="scope.row.eqptLevel === 1">Ⅰ</span>
                  <span v-if="scope.row.eqptLevel === 2">Ⅱ</span>
                  <span v-if="scope.row.eqptLevel === 3">Ⅲ</span>
                  <span v-if="scope.row.eqptLevel === 4">Ⅳ</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="模具型号" align="center">
              <template slot-scope="scope">
                <div :class="scope.row.colorLevel==1? 'one' :scope.row.colorLevel==2? 'two':scope.row.colorLevel==3?'three':''">{{ scope.row.mouldCode }}</div>
              </template>
            </el-table-column>
            <el-table-column label="模具等级" align="center">
              <template slot-scope="scope">
                <div :class="scope.row.colorLevel==1? 'one' :scope.row.colorLevel==2? 'two':scope.row.colorLevel==3?'three':''">
                  <span v-if="scope.row.mouldLevel === 1">Ⅰ</span>
                  <span v-if="scope.row.mouldLevel === 2">Ⅱ</span>
                  <span v-if="scope.row.mouldLevel === 3">Ⅲ</span>
                  <span v-if="scope.row.mouldLevel === 4">Ⅳ</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            :current-page="pageNum"
            :page-sizes="[10, 20, 30]"
            :page-size="pageSize"
            :total="totalPage"
            class="pagination"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="sizeChange"
            @current-change="currentChange"
          />
          <div class="table-describe">
            <div><span class="font-bold">说明：推荐等级规则：</span>基于历史模具和设备对应的报废率，对报废率进行分级评定；<span class="has-margin-left font-bold">设备等级：</span>基于设备的加工时间、加工数量、上下模次数，对设备的健康进行分级评定；</div>
            <div class="has-margin-left"><span class="font-bold">模具等级：</span>基于模具的维修保养情况、加工数量，对模具的健康进行分级评定；<span class="has-margin-left font-bold" style="margin-left: 24px">综合报废率：</span>指当前设备与模具的组合下，生产的全部产品的总报废率；</div>
          </div>
        </div>
      </div>
      <div class="module-container">
        <div class="module-title">
          <div class="module-title-text">工单报废率趋势分析 <span v-if="compScrapRateTrendData.length !== 0">( {{ groupName }} )</span></div>
        </div>
        <div class="module-content" style="height: 260px;">
          <div v-if="compScrapRateTrendLoading" class="loading-text">
            正在加载 ...
          </div>
          <div v-if="compScrapRateTrendData.length === 0" class="no-data">
            <svg-icon class="no-data-icon" icon-class="noData"/>
            <div>暂无数据</div>
          </div>
          <chart v-if="compScrapRateTrendData.length !== 0" id="abnormal" :options="options" height="260px" width="100%" />
        </div>
      </div>
    </div>
  </PageHeaderLayout>
</template>
<style scoped>
  .one{
    background: #009494;
    color: #fff;
  }
  .two{
    background: #00bfbf;
    color: #fff;
  }
  .three{
    background: #27e7e7;
    color: #fff;
  }
  .el-button--mini{
    padding: 12px;
    padding-top: 6px;
  }
  .select-box{
    /*width: 440px;*/
    margin: 0 auto;
  }
  .el-form-item{
    display: inline-block;
  }
  .search-box{
    float: right;
  }
  .table-describe{
    border-top: 1px solid #e2e2e2;
    margin-top: 55px;
    font-size: 12px;
    color: #666;
    padding-top: 10px;
    line-height: 20px;
  }
  .has-margin-left{
    margin-left: 36px;
  }
  .has-margin{
    margin-left: 10px;
  }
  .font-bold{
    font-weight: bold;
  }
  .equipment-table>>>.el-table .cell{
    line-height: 36px;
  }
  .equipment-table>>>.el-table td{
    height: 36px;
  }
  .equipment-table>>>.el-table--border td:first-child .cell{
    padding: 0;
  }
  .start-img{
    width: 380px;
    height: 42px;
    margin: 0 auto 40px;
    display: block;
  }
  .start-bg-img{
    width: 100%;
    height: 100%;
  }
  .select-box>>>.el-input__inner{
    border-color: #c0c4cc;
  }
  .select-box>>>.el-form-item.is-error .el-input__inner{
    border-color: #f56c6c;
  }
  .select-box>>>.el-form-item.is-success .el-input__inner{
    border-color: #67c23a;
  }
  .select-box>>>.el-input__inner:hover {
    border-color: #aaaeb6;
  }
  .table-tooltip-text{
    margin-right: 20px;
  }
</style>
<script src="./equipmentRecommend.js"></script>

