<template>
  <PageHeaderLayout :has_back = "true">
    <div class="time-search-box">
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
      <el-button type="primary" icon="el-icon-search" size="small" style="height: 32px;" class="has-margin" @click="searchBySelected">搜索</el-button>
    </div>
    <div class="product-detail-container">
      <div v-if="totalLoading" class="loading-text">
        正在加载 ...
      </div>
      <div v-if="!totaldaNum" class="no-data">
        <svg-icon class="no-data-icon" icon-class="noData" style="margin-top: 80px"/>
        <div>暂无数据</div>
      </div>
      <div v-if="totaldaNum" class="product-detail-title" ><span v-text="productCode"/>/<span v-text="productName"/></div>
      <div v-if="totaldaNum" class="product-detail-content">
        <div>
          <div style="padding:0 15px">
            <div class="discard-overview-top">
              <div class="icon-ctn">
                <svg-icon class="icon" icon-class="leiji"/>
                <div class="title">加工总量</div>
              </div>
              <div class="text-ctn">
                <div class="number" v-text="totaldaNum">74,653</div>
                <div class="content">
                  <span>
                    环比 <svg-icon v-if="isYesterday && rejectRatioTerm !== 0" :icon-class="daNumTerm<0?'godown':'goup'" class="icon"/>
                    <span v-if="daNumTerm === 0 || !isYesterday" style="padding: 0 15px">--</span>
                    <span v-if="isYesterday" v-text="daNumTerm">13</span><span>%</span>
                  </span>
                </div>
              </div>
            </div>
            <div class="discard-overview-top">
              <div class="icon-ctn">
                <svg-icon class="icon" style="color: #5268a5" icon-class="leijibf"/>
                <span class="title">报废总量</span>
              </div>
              <div class="text-ctn">
                <div style="color: #5268a5" class="number" v-text="totalRejectNum">74,653</div>
                <div class="content">
                  <span>
                    环比 <svg-icon v-if="isYesterday && rejectRatioTerm !== 0" :icon-class="rejectNumTerm<0?'godown':'goup'" class="icon"/>
                    <span v-if="rejectNumTerm === 0 || !isYesterday" style="padding: 0 15px">--</span>
                    <span v-if="isYesterday" v-text="rejectNumTerm">13</span><span>%</span>
                  </span>
                </div>
              </div>
            </div>
            <div class="discard-overview-top" style="border:none">
              <div class="icon-ctn">
                <svg-icon class="icon" style="color: #e25d5d" icon-class="zonghe"/>
                <span class="title">平均报废率</span>
              </div>
              <div class="text-ctn">
                <div style="color: #e25d5d" class="number"><span v-text="totalRejectRatio">234</span>%</div>
                <div class="content">
                  <span>
                    环比 <svg-icon v-if="isYesterday && rejectRatioTerm !== 0" :icon-class="rejectRatioTerm<0?'godown':'goup'" class="icon"/>
                    <span v-if="rejectRatioTerm === 0 || !isYesterday" style="padding: 0 15px">--</span>
                    <span v-if="isYesterday" v-text="rejectRatioTerm">13</span><span>%</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div>
            <div class="group-title">
              <div class="group-title-text-combine">模具：<span v-text="minRejectRatioCombine.mould">模具1</span></div>
              <div class="group-title-text-combine">设备：<span v-text="minRejectRatioCombine.eqpt">设备1</span></div>
              <div style="font-weight:bold">报废率最<span class="font-color-red">低</span>组合</div>
            </div>
            <div class="group-content-item"><span class="group-content-item-title">加工量：</span><span class="font-color-green font-blod" v-text="minRejectRatioCombine.daNum">52,355</span></div>
            <div class="group-content-item"><span class="group-content-item-title">报废量：</span><span class="font-color-green font-blod" v-text="minRejectRatioCombine.rejectNum">5255</span></div>
            <div class="group-content-item"><span class="group-content-item-title">报废率：</span><span class="font-blod font-color-red"><span v-text="minRejectRatioCombine.rejectRatio">52,355</span> %</span></div>
          </div>
        </div>
        <div>
          <div>
            <div class="group-title">
              <div class="group-title-text-combine">模具：<span v-text="maxRejectRatioCombine.mould">模具1</span></div>
              <div class="group-title-text-combine">设备：<span v-text="maxRejectRatioCombine.eqpt">设备1</span></div>
              <div style="font-weight:bold">报废率最<span class="font-color-red">高</span>组合</div>
            </div>
            <div class="group-content-item"><span class="group-content-item-title">加工量：</span><span class="font-color-green font-blod" v-text="maxRejectRatioCombine.daNum">52,355</span></div>
            <div class="group-content-item"><span class="group-content-item-title">报废量：</span><span class="font-color-green font-blod" v-text="maxRejectRatioCombine.rejectNum">5255</span></div>
            <div class="group-content-item"><span class="group-content-item-title">报废率：</span><span class="font-blod font-color-red"><span v-text="maxRejectRatioCombine.rejectRatio">52,355</span> %</span></div>
          </div>
        </div>
        <div>
          <div>
            <div class="group-title" style="padding-top: 16px;height: 85px;">
              <div class="group-title-text" style="padding-bottom: 15px">模具：<span v-text="minRejectRatioMoudle.cname">模具1</span></div>
              <div class="mould-title" style="font-weight:bold">报废率最<span class="font-color-red">低</span>模具</div>
            </div>
            <div class="group-content-item"><span class="group-content-item-title">加工量：</span><span class="font-color-green font-blod" v-text="minRejectRatioMoudle.daNum">52,355</span></div>
            <div class="group-content-item"><span class="group-content-item-title">报废量：</span><span class="font-color-green font-blod" v-text="minRejectRatioMoudle.rejectNum">5255</span></div>
            <div class="group-content-item"><span class="group-content-item-title">报废率：</span><span class="font-blod font-color-red"><span v-text="minRejectRatioMoudle.rejectRatio">52,355</span> %</span></div>
          </div>
        </div>
        <div>
          <div>
            <div class="group-title" style="padding-top: 16px;height: 85px;">
              <div class="group-title-text" style="padding-bottom: 15px">模具：<span v-text="maxRejectRatioMoudle.cname">模具2</span></div>
              <div class="mould-title" style="font-weight:bold">报废率最<span class="font-color-red">高</span>模具</div>
            </div>
            <div class="group-content-item"><span class="group-content-item-title">加工量：</span><span class="font-color-green font-blod" v-text="maxRejectRatioMoudle.daNum">52,355</span></div>
            <div class="group-content-item"><span class="group-content-item-title">报废量：</span><span class="font-color-green font-blod" v-text="maxRejectRatioMoudle.rejectNum">5255</span></div>
            <div class="group-content-item"><span class="group-content-item-title">报废率：</span><span class="font-blod font-color-red"><span v-text="maxRejectRatioMoudle.rejectRatio">52,355</span> %</span></div>
          </div>
        </div>
      </div>
    </div>
    <div class="module-container">
      <div class="module-title">
        <div class="module-title-text">
          报废率趋势
          <el-tooltip placement="right">
            <div slot="content">说明：<br>产品工单：一个上下模是一个产品工单</div>
            <svg-icon class="hint" icon-class="hint"/>
          </el-tooltip>
        </div>
        <div v-if="productPlanTrend.length > 1" class="i-right contrast-btn" @click="contrastBtn">
          <svg-icon icon-class="log"/>
          差异对比
        </div>
      </div>
      <div class="module-content" style="height: 290px;position: relative">
        <div v-if="productPlanTrendLoading" class="loading-text">
          正在加载 ...
        </div>
        <div v-if="productPlanTrend.length !== 0" class="legend">
          <span class="legend-circle" />
          <span class="legend-circle-line" />
          <span class="legend-text">报废率（ <span class="legend-circle-abnormal"/> 异常工单 ）</span>
          <span class="abnormal"> ---- </span>
          <span class=""> 平均值</span>
        </div>
        <div v-if="productPlanTrend.length === 0" class="no-data">
          <svg-icon class="no-data-icon" icon-class="noData" style="margin-top: 50px"/>
          <div>暂无数据</div>
        </div>
        <chart v-if="productPlanTrend.length !== 0" id="machine" ref="machine" :options="productTrendOptions" height="260px" width="100%" @barClick="barClick"/>
      </div>
    </div>
    <div class="contrast" style="margin-bottom: 10px">
      <div style="padding-right: 5px">
        <div class="module-container">
          <div class="module-title">
            <div class="module-title-text">
              模具报废
              <el-tooltip placement="right">
                <div slot="content">说明：<br>此模块展示加工产品 {{ productName }}的<br>所有模具的报废率与加工量排名</div>
                <svg-icon class="hint" icon-class="hint"/>
              </el-tooltip>
            </div>
            <el-button v-if="totaldaNum" class="view-all" size="mini" @click="viewAllMould">查看数据源<i class="el-icon-d-arrow-right el-icon--right"/></el-button>
          </div>
          <div class="module-content" style="height: 290px;">
            <div v-if="!totaldaNum" class="no-data">
              <svg-icon class="no-data-icon" icon-class="noData"/>
              <div>暂无数据</div>
            </div>
            <chart v-if="totaldaNum" id="top" :options="mouldOptions" height="260px" width="100%" />
          </div>
        </div>
      </div>
      <div style="padding-left: 5px">
        <div class="module-container">
          <div class="module-title">
            <div class="module-title-text">
              压铸机报废
              <el-tooltip placement="right">
                <div slot="content">说明：<br>此模块展示加工产品 {{ productName }}的<br>所有压铸机的报废率和加工量排名</div>
                <svg-icon class="hint" icon-class="hint"/>
              </el-tooltip>
            </div>
            <el-button v-if="totaldaNum" class="view-all" size="mini" @click="viewAllEqpt">查看数据源<i class="el-icon-d-arrow-right el-icon--right"/></el-button>
          </div>
          <div class="module-content" style="height: 290px;">
            <div v-if="!totaldaNum" class="no-data">
              <svg-icon class="no-data-icon" icon-class="noData"/>
              <div>暂无数据</div>
            </div>
            <chart v-if="totaldaNum" id="bot" :options="eqptOptions" height="260px" width="100%" />
          </div>
        </div>
      </div>
    </div>
    <div class="module-container">
      <div class="module-title">
        <div class="module-title-text">
          压铸机+模具组合报废
          <el-tooltip placement="right">
            <div slot="content">说明：<br>此模块展示加工产品 {{ productName }}的<br>压铸机+模具组合的报废率和加工量排名</div>
            <svg-icon class="hint" icon-class="hint"/>
          </el-tooltip>
        </div>
        <el-button v-if="totaldaNum" class="view-all" size="mini" @click="viewAllMouldEqpt">查看数据源<i class="el-icon-d-arrow-right el-icon--right"/></el-button>
      </div>
      <div class="module-content" style="height: 290px;">
        <div v-if="!totaldaNum" class="no-data">
          <svg-icon class="no-data-icon" icon-class="noData"/>
          <div>暂无数据</div>
        </div>
        <chart v-if="totaldaNum" id="group" :options="mouldAndEqptOptions" height="260px" width="100%" />
      </div>
    </div>
    <div class="module-container" style="margin-bottom: 0">
      <div class="module-title">
        <div class="module-title-text">报废构成</div>
        <el-button v-if="totaldaNum" class="view-all" size="mini" @click="viewAllFrom">查看数据源<i class="el-icon-d-arrow-right el-icon--right"/></el-button>
      </div>
      <div class="module-content" style="height: 459px;">
        <div v-if="!totaldaNum" class="no-data">
          <svg-icon class="no-data-icon" icon-class="noData" style="margin-top: 120px"/>
          <div>暂无数据</div>
        </div>
        <div v-if="totaldaNum" class="step-container">
          <div style="padding-right: 5px">
            <div class="circle green">
              <div class="backgrd green"/>
            </div>
            <div class="setp-line"/>
            <div class="scrap-form-title">压铸</div>
            <div>报废率：<span v-text="productRate.yz">8.9%</span> %</div>
            <div class="chart-container">
              <div class="chart">
                <div v-if="yzList.length === 0" class="no-data">
                  <svg-icon class="no-data-icon" icon-class="noData" style="margin-top: 70px"/>
                  <div>暂无数据</div>
                </div>
                <chart v-if="yzList.length > 0" id="casting" :options="castingOptions" height="100%" width="100%" />
              </div>
            </div>
            <div class="triangle"/>
          </div>
          <div style="padding: 0 5px">
            <div class="circle">
              <div class="backgrd"/>
            </div>
            <div class="setp-line"/>
            <div class="scrap-form-title">机加工</div>
            <div>报废率：<span v-text="productRate.jj">8.9%</span> %</div>
            <div class="chart-container">
              <div class="chart">
                <div v-if="jjgList.length === 0" class="no-data">
                  <svg-icon class="no-data-icon" icon-class="noData" style="margin-top: 70px"/>
                  <div>暂无数据</div>
                </div>
                <chart v-if="jjgList.length > 0" id="machining" :options="machiningOptions" height="100%" width="100%" />
              </div>
            </div>
            <div class="triangle"/>
          </div>
          <div style="padding-left: 5px">
            <div class="circle blue">
              <div class="backgrd blue"/>
            </div>
            <div class="scrap-form-title">氧化终检</div>
            <div>报废率：<span v-text="productRate.yh">8.9%</span> %</div>
            <div class="chart-container">
              <div class="chart">
                <div v-if="yhList.length === 0" class="no-data">
                  <svg-icon class="no-data-icon" icon-class="noData" style="margin-top: 70px"/>
                  <div>暂无数据</div>
                </div>
                <chart v-if="yhList.length > 0" id="inspection" :options="yhOptions" height="100%" width="100%" />
              </div>
            </div>
            <div class="triangle"/>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="contrastVisible"
      title="差异对比"
      class="contrast-dialog"
      width="850px">
      <div style="text-align: center;margin-bottom: 10px;font-size: 16px">
        <span style="color: #009494;font-weight: bold;" v-text="productName">0001后视镜/8732-01</span>
      </div>
      <div class="contrast-text">对比</div>
      <el-radio-group v-model="order" style="margin-bottom: 12px" @change="orderChange">
        <el-radio label="0">全部</el-radio>
        <el-radio label="1">异常工单</el-radio>
      </el-radio-group>
      <div class="i-right font-color-red">说明：一次性最多选取2个工单做对比</div>
      <el-table
        v-loading="listLoading"
        ref="multipleTable"
        :data="list"
        class="contrast-table"
        element-loading-text="拼命加载中"
        max-height="578"
        border
        fit
        stripe
        highlight-current-row
        @selection-change="changeFun">
        <el-table-column label="工单编号" align="center" prop="woCode" width="190"/>
        <el-table-column type="selection" width="75px"/>
        <el-table-column label="加工量" align="center" prop="daNum" />
        <el-table-column label="报废量" align="center" prop="rejectNum"/>
        <el-table-column label="报废率" align="center" prop="rejectRatio">
          <template slot-scope="scope">
            {{ scope.row.rejectRatio }} %
          </template>
        </el-table-column>
        <el-table-column label="环比" align="center" prop="term">
          <template slot-scope="scope">
            <span v-if="scope.$index !== 0">
              <span :class="{'ratio-up':scope.row.term < 0}" class="ratio-num"><span>{{ scope.row.term }}</span>%</span>
              <svg-icon v-if="scope.row.term !== 0" :icon-class="scope.row.term<0?'godown':'goup'" class="icon"/>
            </span>
            <span v-if="scope.$index === 0"> -- </span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer" style="text-align: center">
        <el-button type="primary" @click="contrastFun">对比</el-button>
        <el-button @click="contrastVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="eqptVisible"
      title="压铸机报废对比"
      class="scrap-contrast-dialog"
      width="740px">
      <el-table
        :data="eqptTrendList"
        border
        fit
        stripe
        max-height="575"
        highlight-current-row>
        <el-table-column label="压铸机" align="center" prop="eqpt"/>
        <el-table-column label="报废率" align="center" prop="rejectRatio">
          <template slot-scope="scope">
            {{ scope.row.rejectRatio }} %
          </template>
        </el-table-column>
        <el-table-column label="报废量" align="center" prop="rejectNum"/>
      </el-table>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="mouldVisible"
      title="模具报废对比"
      class="scrap-contrast-dialog"
      width="740px">
      <el-table
        :data="mouldTrendList"
        border
        fit
        stripe
        max-height="575"
        highlight-current-row>
        <el-table-column label="模具" align="center" prop="mould"/>
        <el-table-column label="报废率" align="center" prop="rejectRatio">
          <template slot-scope="scope">
            {{ scope.row.rejectRatio }} %
          </template>
        </el-table-column>
        <el-table-column label="报废量" align="center" prop="rejectNum"/>
      </el-table>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="mouldAndEqptVisible"
      title="压铸机+模具组合报废对比"
      class="scrap-contrast-dialog"
      width="740px">
      <el-table
        :data="mouldAndEqptTrendList"
        border
        fit
        stripe
        max-height="575"
        highlight-current-row>
        <el-table-column label="压铸机+模具组合" align="center" prop="mould">
          <template slot-scope="scope">
            <span v-text="scope.row.eqpt">压铸机</span> +
            <span v-text="scope.row.mould">模具</span>
          </template>
        </el-table-column>
        <el-table-column label="报废率" align="center" prop="rejectRatio">
          <template slot-scope="scope">
            {{ scope.row.rejectRatio }} %
          </template>
        </el-table-column>
        <el-table-column label="报废量" align="center" prop="rejectNum"/>
      </el-table>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="scrapFormVisible"
      title="报废构成"
      class="scrap-contrast-dialog"
      width="740px">
      <div class="table-sub-title">压铸报废</div>
      <el-table
        :data="yzDetailList"
        border
        fit
        stripe
        max-height="165"
        highlight-current-row>
        <el-table-column label="报废原因" align="center" prop="reason"/>
        <el-table-column label="报废占比" align="center" prop="rejectRatio">
          <template slot-scope="scope">
            {{ scope.row.rate }} %
          </template>
        </el-table-column>
        <el-table-column label="报废量" align="center" prop="num"/>
      </el-table>
      <div class="table-sub-title">机加工</div>
      <el-table
        :data="jjgDetailList"
        border
        fit
        stripe
        max-height="165"
        highlight-current-row>
        <el-table-column label="报废原因" align="center" prop="reason"/>
        <el-table-column label="报废占比" align="center" prop="rate">
          <template slot-scope="scope">
            {{ scope.row.rate }} %
          </template>
        </el-table-column>
        <el-table-column label="报废量" align="center" prop="num"/>
      </el-table>
      <div class="table-sub-title">氧化终检</div>
      <el-table
        :data="yhDetailList"
        border
        fit
        stripe
        max-height="165"
        highlight-current-row>
        <el-table-column label="报废原因" align="center" prop="reason"/>
        <el-table-column label="报废占比" align="center" prop="rate">
          <template slot-scope="scope">
            {{ scope.row.rate }} %
          </template>
        </el-table-column>
        <el-table-column label="报废量" align="center" prop="num"/>
      </el-table>
    </el-dialog>
  </PageHeaderLayout>
</template>
<script src="./productDetail.js"></script>
<style scoped>
  .contrast-table>>>thead tr th.is-leaf .el-checkbox{
    display: none;
  }
  .contrast-table>>> .cell{
    padding: 0px;
    line-height: 35px;
  }
  .contrast-table>>> td{
    padding: 0 !important;
    height: 35px;
  }
  .contrast-dialog>>> .el-dialog__footer{
    text-align: center;
  }
  .contrast-text{
    position: absolute;
    top: 121px;
    left: 230px;
    z-index: 100;
    color: #666;
    font-weight: bold;
  }
  .contrast-btn{
    color: #009494;
    cursor: pointer;
    margin-top: 10px;
  }
  .scrap-form-title{
    margin: 10px 0 5px 0;
  }
  .step-container{
    overflow: hidden;
    margin-top: 20px;
  }
  .circle{
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin: 0 auto;
    border:1px solid #ff9a02;
  }
  .circle.green{
    border-color: #009494;
  }
  .backgrd.green{
    background: #009494;
  }
  .circle.blue{
    border-color: #566c8b;
  }
  .backgrd.blue{
    background: #566c8b;
  }
  .backgrd{
    background: #ff9a02;
    width: 20px;
    height: 20px;
    margin: 5px auto 0;
    border-radius: 50%;
  }
  .step-container>div{
    float: left;
    width: 33.33%;
    position: relative;
    text-align: center;
  }
  .step-container>div .chart-container{
    height: 300px;
    border: 1px solid #e2e2e2;
    margin-top: 30px;
    position: relative;
  }
  .step-container>div .chart-container .chart{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: #fff;
    z-index: 2;
  }
  .setp-line{
    position: absolute;
    width: 92%;
    border-bottom:1px solid #009494;
    left: 54%;
    top: 16px;
  }
  .setp-line:after{
    position: absolute;
    content: '';
    width: 0;
    height: 0;
    border-top: 5px solid transparent;
    border-left: 10px solid #009494;
    border-bottom: 5px solid transparent;
    right: -2px;
    top: -5px;
  }
  .triangle{
    width: 0;
    height: 0;
    border-top: 160px solid transparent;
    border-left: 200px solid #e1e1e1;
    border-bottom: 160px solid transparent;
    position: absolute;
    transform: rotate(-43deg);
    z-index: 1;
    top: -1px;
    left: 100px;
  }
  .group-title{
    font-size: 14px;
    height: 80px;
    border-bottom: 1px solid #e2e2e2;
    text-align: center;
    margin-bottom: 26px;
  }
  .group-title-text-combine{
    text-align: left;
    padding-left: 20%;
    font-size: 16px;
    font-weight: bold;
    color: #009494;
    margin-top: 5px;
    margin-bottom: 8px;
  }
  .group-title-text{
    font-size: 16px;
    font-weight: bold;
    color: #009494;
    margin-top: 7px;
    margin-bottom: 0px;
  }
  .mould-title{
    /*margin-top: 34px;*/
  }
  .product-detail-container{
    margin-bottom: 10px;
    width: 100%;
    background: #fff;
    padding: 0 15px 10px;
    font-size: 16px;
    height: 322px;
  }
  .product-detail-container .product-detail-title{
    height: 42px;
    line-height: 42px;
    border-bottom:1px solid #e2e2e2;
    text-align: center;
    color: #666;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .product-detail-content{
    overflow: hidden;
  }
  .product-detail-content>div{
    float: left;
    width: 19%;
    padding: 0 5px;
  }
  .product-detail-content>div>div{
    height: 260px;
    background: #f2f2f2;
    padding: 10px 15px;
    border:1px solid #e2e2e2;
  }
  .product-detail-content>div:first-child{
    width: 24%;
    padding-left: 0;
  }
  .product-detail-content>div:last-child{
    padding-right: 0;
  }
  .discard-the-most-title{
    text-align: center;
    line-height: 30px;
    font-size: 18px;
    font-weight: bold;
    color: #009494;
    margin-bottom: 10px;
  }
  .discard{
    margin-left: 10%;
    line-height: 25px;
  }
  .discard .title{
    display: inline-block;
    width: 50%;
  }
  .group-content-item{
    font-size: 14px;

  }
  .group-content-item-title{
    margin: 15% ;
    line-height: 40px;
  }
  .font-color-red{
    color:#e25d5d;
  }
  .font-blod{
    font-weight: bold;
    font-size: 16px;
  }
  .discard .font-color-red{
    font-size: 18px;
    font-weight: bold;
    color:#e25d5d;
  }
  .font-color-green{
    color: #009494;
  }
  .font-color-blue{
    font-size: 18px;
    font-weight: bold;
    color:#5268a5;
  }
  .contrast{
    overflow: hidden;
  }
  .contrast>div{
    float: left;
    width: 50%;
  }
  .discard-overview{
    padding: 10px 15px;
    overflow: hidden;
  }
  .constitute{
    padding: 0;
    margin-bottom: 10px;
  }
  .constitute .module-content{
    height: 200px;
  }
  .discard-overview>div{
    float: left;
    width: 33.33%;
  }
  .discard-overview-btm{
    width: 100%;
    margin-top: 10px;
  }
  .discard-overview-btm>div{
    float: left;
    width: 50%;
  }
  .discard-overview-btm .module-title{
    background: #f2f2f2;
    height: 42px;
    padding: 3px 15px;
  }
  .discard-overview-btm .module-content{
    background: #f2f2f2;
  }
  .discard-overview-btm .module-container{
    border:1px solid #e2e2e2;
    box-shadow: none;
  }
  .discard-overview-top{
    width: 100%;
    height: 86px;
    border-bottom:1px solid #e2e2e2;
    background: #f2f2f2;
  }
  .discard-overview-top .icon-ctn{
    float: left;
    width: 45%;
  }
  .discard-overview-top .icon-ctn .icon{
    font-size: 35px;
    margin-top: 20px;
    margin-left: 10%;
    vertical-align: middle;
  }
  .discard-overview-top .icon-ctn .title{
    color: #666;
    font-weight: bold;
    display: inline-block;
    vertical-align: -12px;
    margin-left: 12%;
    /*width: 120px;*/
  }
  .discard-overview-top .text-ctn{
    float: left;
    width: 55%;
    padding-left: 8%;
  }
  .discard-overview-top .text-ctn .number{
    width: 100%;
    font-size: 26px;
    margin-top: 14px;
    color: #009494;
    font-weight: bold;
  }
  .discard-overview-top .text-ctn .number.isAll{
    margin-top: 23px;
  }
  .discard-overview-top .text-ctn .content{
    margin-top: 10px;
    margin-left: 2px;
    font-size: 16px;
  }
  .discard-overview-top .text-ctn .icon{
    margin: 0 20px;
  }
  .scrap-contrast-dialog >>>.el-dialog__body {
    padding: 15px;
    color: #606266;
    font-size: 14px;
  }
  .contrast-dialog >>>.el-dialog__body {
    padding: 15px;
    color: #606266;
    font-size: 14px;
  }
  .hint{
    font-size: 18px;
    vertical-align: middle;
  }
  .ratio-num{
    color: #e25d5d;
    display: inline-block;
    width: 80px;
  }
  .ratio-up{
    color: #009494;
  }
  .legend{
    position: absolute;
    top: 10px;
    left: 45%;
    z-index: 10;
  }
  .legend-circle{
    position: absolute;
    top: 2px;
    left: 7px;
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 1px solid #2abd6d;
    border-radius: 50%;
    background: #fff;
    z-index: 2;
  }
  .legend-circle-abnormal{
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 1px solid #e25d5d;
    border-radius: 50%;
    background: #fff;
    vertical-align: middle;
  }
  .legend-circle-line{
    position: absolute;
    top: 8px;
    left: 0px;
    z-index: 1;
    display: inline-block;
    width: 26px;
    border-bottom: 1px solid #2abd6d;
  }
  .legend-text{
    display: inline-block;
    margin-left: 40px;
  }
  .abnormal{
    color: #e25d5d;
    margin: 0 10px 0 25px;
  }
  .table-sub-title{
    margin: 12px 0 8px 0;
    font-weight: bold;
  }
  .table-sub-title:first-child{
    margin-top: 0;
  }
</style>

