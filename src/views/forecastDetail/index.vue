<template>
  <PageHeaderLayout :has_back = "true">
    <div class="header-search-add">
      <el-select v-model="equipment" filterable placeholder="请选择设备" size="medium" style="width: 300px;">
        <el-option
          v-for="item in equipmentOptions"
          :key="item.eqptId"
          :label="item.eqptCode"
          :value="item.eqptId"/>
      </el-select>
      <el-button type="primary" icon="el-icon-search" size="medium" @click="handleSearch">搜索</el-button>
    </div>
    <div class="forecast-container">
      <div class="module-container outcome">
        <div class="module-title">
          <div class="module-title-text">预测结果</div>
        </div>
        <div class="module-content">
          <div class="outcome-text">
            <div style="color: #536aa1;font-size: 18px;font-weight: bold" v-text="eqptCode">IKD-03/YZ-08</div>
            <div><span v-text="beginTime"/>至<span v-text="endTime"/>，</div>
            <div>共计预测班次报废率<span style="color:#de525f;font-size: 18px;font-weight: bold" v-text="foreCount">40</span>次，</div>
            <div>其中<span style="color:#de525f;font-size: 18px;font-weight: bold" v-text="successCount">20</span>次预测成功，</div>
            <div>预测成功率为<span style="color:#009494;font-size: 18px;font-weight: bold"><span v-text="successRetio"/>%</span></div>
          </div>
          <div class="outcome-chart">
            <chart id="outcome" ref="outcome" :options="outcomeOptions" height="100%" width="100%" />
          </div>
        </div>
      </div>
      <div class="module-container tendency">
        <div class="module-title">
          <div class="module-title-text">预测趋势</div>
        </div>
        <div class="module-content">
          <chart id="tendency" ref="tendency" :options="trendOptions" height="100%" width="100%" />
        </div>
      </div>
    </div>
    <div class="module-container">
      <div class="module-title">
        <div class="module-title-text">预测列表</div>
        <el-date-picker
          v-model="selectedDate"
          type="date"
          placeholder="选择日期"
          size="mini"
          class="forecastDatePicker"
          value-format="yyyy-MM-dd"
          @change="dateChanged"
        />
      </div>
      <div class="module-content" style="min-height: 438px">
        <el-table
          v-loading="listLoading"
          :data="list"
          :span-method="objectSpanMethod"
          element-loading-text="拼命加载中"
          border
          fit>
          <el-table-column align="center" label="班次" width="95" prop="shiftName"/>
          <el-table-column label="预测时间范围" align="center" prop="ycTime">
            <template slot-scope="scope">
              <div :class="scope.row.isaccuracy === 0?'countYes':scope.row.isaccuracy === 1?'countNo':''">
                {{ scope.row.startTime.substr(11, 5) }} - {{ scope.row.endTime.substr(11, 5) }}
                <span v-if="scope.row.predictType">({{ scope.row.shiftName }})</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="产品" align="center" prop="materialName">
            <template slot-scope="scope">
              <div :class="scope.row.isaccuracy === 0?'countYes':scope.row.isaccuracy === 1?'countNo':''">{{ scope.row.materialName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="模具" align="center" prop="mouldWmsCode">
            <template slot-scope="scope">
              <div :class="scope.row.isaccuracy === 0?'countYes':scope.row.isaccuracy === 1?'countNo':''">{{ scope.row.mouldWmsCode }}</div>
            </template>
          </el-table-column>
          <el-table-column label="预测报废率" align="center" prop="rejectRetio">
            <template slot-scope="scope">
              <div :class="scope.row.isaccuracy === 0?'countYes':scope.row.isaccuracy === 1?'countNo':''">
                <span v-text="scope.row.xianshi">10%</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="实际报废率" align="center" prop="actRejectRetio">
            <template slot-scope="scope">
              <div :class="scope.row.isaccuracy === 0?'countYes':scope.row.isaccuracy === 1?'countNo':''">
                <span v-if="scope.row.predictType">{{ scope.row.actRejectRetio }} %</span>
                <span v-if="!scope.row.predictType">--</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="预测是否准确" align="center" prop="isaccuracy">
            <template slot-scope="scope">
              <div :class="scope.row.isaccuracy === 0?'countYes':scope.row.isaccuracy === 1?'countNo':''">
                <span v-if="scope.row.isaccuracy === 0" class="accuracy" >是</span>
                <span v-if="scope.row.isaccuracy === 1" class="inaccuracy">否</span>
                <span v-if="scope.row.isaccuracy === null">--</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="time-btn-group">
          <el-button type="primary" icon="el-icon-arrow-left" size="small" @click="before">前一天</el-button>
          <el-button type="primary" size="small" @click="after">后一天<i class="el-icon-arrow-right el-icon--right"/></el-button>
        </div>
      </div>
    </div>
  </PageHeaderLayout>
</template>
<script src="./forecastDetail.js"></script>
<style scoped>
  .module-title>>>.el-input__suffix-inner{
    display: none;
  }
  .module-content>>> .el-table--enable-row-hover .el-table__body tr:hover>td{
    background-color: transparent !important;
  }
  .accuracy{
    color: #1ABC9C;
    font-weight: bold;
  }
  .inaccuracy{
    color: #E25D5D;
    font-weight: bold;
  }
  .forecast-container{
    display: flex;
    flex-direction: row;
  }
  .forecast-container .module-content{
    height: 240px;
  }
  .outcome{
    width: 500px;
  }
  .outcome .module-content{
    display: flex;
    flex-direction: row;
  }
  .outcome .module-content .outcome-text{
    width: 260px;
    padding: 20px 0 0 30px;
    line-height: 30px;
  }
  .outcome .module-content .outcome-chart{
    flex-grow: 1;
    padding-top: 10px;
  }
  .tendency{
    flex-grow: 1;
    margin-bottom: 10px;
    margin-left: 10px;
  }
  .forecastDatePicker{
    float: right;
  }
  .time-btn-group{
    float: right;
    margin-top: 15px;
  }
  .count{
    background: #eee;
  }
  .countYes{
    background: #E5F4F4;
    color: #1ABC9C;
    font-weight: bold;
  }
  .countNo{
    background: #FBEBEB;
    color: #E25D5D;
    font-weight: bold;
  }
  .count .
  .module-content>>>.el-table--enable-row-hover .el-table__body tr:hover>td{
    background-color: #fff !important;
  }
</style>

