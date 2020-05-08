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
    <div class="module-container">
      <div class="module-title">
        <div class="module-title-text">设备详细信息</div>
        <span class="i-right" style="line-height: 35px">注：数据统计从 <span v-text="beginTime"/> 至 <span v-text="endTime"/></span>
      </div>
      <div class="module-content" style="padding: 10px 15px">
        <div class="equipment-container">
          <div class="equipment-left-container">
            <div class="equipment-left-top-container">
              <div class="title">
                <svg-icon icon-class="shebei3" style="font-size: 45px;color: #009494"/>
                <span class="equipment-title" v-text="eqptCode">IKD-03/YZ-01</span>
                <div class="equipment-info">
                  设备品牌：<span style="margin-right: 10px" v-text="eqptBrand">东洋IKD-03/YZ-01 </span>
                  设备型号：<span v-text="eqptmodel">BD500V5EX</span>
                </div>
              </div>
              <div class="content">
                <div>
                  <div>综合报废率</div>
                  <div style="font-size: 35px;margin: 20px 0 10px" class="text-color-red"><svg-icon icon-class="zonghe"/></div>
                  <div style="font-size: 22px;font-weight: bold" class="text-color-red"><span v-text="rejectatio"/> %</div>
                </div>
                <div>
                  <div>累计生产数</div>
                  <div style="font-size: 35px;margin: 20px 0 10px"><svg-icon icon-class="leiji"/></div>
                  <div style="font-size: 22px;font-weight: bold;color: #009494" v-text="daNum">22325565656</div>
                  <div class="border-left"/>
                  <div class="border-right"/>
                </div>
                <div>
                  <div>累计报废数</div>
                  <div style="font-size: 35px;margin: 20px 0 10px;color: #5268a5"><svg-icon icon-class="leijibf"/></div>
                  <div style="font-size: 22px;font-weight: bold;color: #5268a5" class="text-color-red" v-text="rejectNum">33.42323</div>
                </div>
              </div>
            </div>
            <div class="module-bottom-box">
              <div class="equipment-module-title">
                <svg-icon style="color: #009494" icon-class="log"/>
                异常停机分析
              </div>
              <div class="analysis">
                <!--占位-->
                <div />
                <div>
                  <div>异常停机次数</div>
                  <div class="font-weight-bold text-color-red"><span v-text="downNum">232323</span> 次</div>
                </div>
                <div>
                  <div>停机时长</div>
                  <div class="font-weight-bold" style="color: #5268a5"><span v-text="downTimes">4120</span> min</div>
                </div>
              </div>
            </div>
          </div>
          <div class="equipment-right-container">
            <div class="module-bottom-box" style="margin-top: 0">
              <div class="equipment-module-title">
                <svg-icon style="color: #009494" icon-class="log"/>
                加工最多的产品
              </div>
              <div>
                <div>
                  <!--<div class="font-weight-bold" v-text="maxProdutEqptCode">7321电机盖/03-0082</div>-->
                  <el-tooltip v-if="maxProdutEqptCodeArr.length>1" placement="top">
                    <div slot="content">{{ maxProdutEqptCode }}</div>
                    <span class="font-weight-bold" v-text="maxProdutEqptCodeArr[0] + '...'"/>
                  </el-tooltip>
                  <span v-if="maxProdutEqptCodeArr.length === 1" class="font-weight-bold" v-text="maxProdutEqptCodeArr[0]"/>
                </div>
                <div>
                  <div>累计加工总数</div>
                  <div class="font-weight-bold"><span v-text="maxProdutDaNum">42</span></div>
                </div>
                <div>
                  <div>综合报废率</div>
                  <div class="font-weight-bold text-color-red"><span v-text="maxProdutRejectatio">41</span> %</div>
                </div>
              </div>
            </div>
            <div class="module-bottom-box">
              <div class="equipment-module-title">
                <svg-icon style="color: #009494" icon-class="log"/>
                加工报废率最低的产品
              </div>
              <div>
                <div>
                  <!--<div class="font-weight-bold" v-text="minProdutEqptCode">5050电机盖/01-0095</div>-->
                  <el-tooltip v-if="minProdutEqptCodeArr.length>1" placement="top">
                    <div slot="content">{{ minProdutEqptCode }}</div>
                    <span class="font-weight-bold" v-text="minProdutEqptCodeArr[0] + '...'"/>
                  </el-tooltip>
                  <span v-if="minProdutEqptCodeArr.length === 1" class="font-weight-bold" v-text="minProdutEqptCodeArr[0]"/>
                </div>
                <div>
                  <div>累计加工总数</div>
                  <div class="font-weight-bold"><span v-text="minProdutDaNum">42</span></div>
                </div>
                <div>
                  <div>综合报废率</div>
                  <div class="font-weight-bold text-color-red"><span v-text="minProdutRejectatio">40</span> %</div>
                </div>
              </div>
            </div>
            <div class="module-bottom-box">
              <div class="equipment-module-title">
                <svg-icon style="color: #009494" icon-class="log"/>
                异常停机最多原因
              </div>
              <div>
                <div>
                  <div v-if="downResonArr[0] === ''" class="font-weight-bold">暂未停机</div>
                  <el-tooltip v-if="downResonArr.length>1" placement="top">
                    <div slot="content">{{ downReson }}</div>
                    <span class="font-weight-bold" v-text="downResonArr[0] + '...'"/>
                  </el-tooltip>
                  <span v-if="downResonArr.length === 1" class="font-weight-bold" v-text="downResonArr[0]"/>
                </div>
                <div>
                  <div>停机次数</div>
                  <div class="font-weight-bold text-color-red"><span v-text="maxDownNum">42</span> 次</div>
                </div>
                <div>
                  <div>停机时长</div>
                  <div class="font-weight-bold" style="color: #5268a5"><span v-text="maxDownTime">4120</span> min</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="abnormal-container">
      <div style="padding-right: 5px">
        <div class="module-container">
          <div class="module-title">
            <div class="module-title-text">设备异常停机时长分析</div>
            <el-button v-if="downResonList.length !== 0" class="view-all" size="mini" @click="viewEquipmentAll">查看数据源<i class="el-icon-d-arrow-right el-icon--right"/></el-button>
          </div>
          <div class="module-content" style="height: 400px;">
            <div v-if="downResonListLoading" class="loading-text">
              正在加载 ...
            </div>
            <div v-if="downResonList.length === 0" class="no-data">
              <svg-icon class="no-data-icon" style="margin-top: 80px" icon-class="noData"/>
              <div>暂无数据</div>
            </div>
            <chart v-if="downResonList.length !== 0" id="constitute" ref="constitute" :options="abnormalOptions" height="370px" width="100%" />
          </div>
        </div>
      </div>
      <div style="padding-left: 5px">
        <div class="module-container">
          <div class="module-title">
            <div class="module-title-text">设备加工能力模型</div>
          </div>
          <div class="module-content model-content">
            <div class="model-content-text">
              <div class="model-content-text-title">
                <div>设备评价等级:
                  <span class="text-color-light" v-text="oeeData.evalGrade">I</span>
                  <el-tooltip placement="top">
                    <div slot="content">说明：<br>该评定等级是通过综合考量机台性能、生产效率及报废率等核心指标，<br>为压铸机进行评级，其中1、2、3、4等级代表设备健康度依次降低。</div>
                    <svg-icon class="hint" icon-class="hint"/>
                  </el-tooltip>
                </div>
                <div>OEE指数: <span class="text-color-light"><span v-text="oeeData.oee">87.53</span> %</span></div>
              </div>
              <div class="formulas">
                <div>开机率 =（设备全稼动时间-停机时间）/ 设备全稼动时间</div>
                <div>性能稼动率 = 目标节拍 /（实际节拍为0时候，显示为空白）</div>
                <div>合格率 = 压铸合格数 / 压铸合模数</div>
                <div>OEE = 开机率 * 性能稼动率 * 合格率</div>
              </div>
            </div>
            <div class="model-content-chart">
              <chart id="oee" ref="oee" :options="oeeOptions" height="370px" width="100%" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module-container">
      <div class="module-title">
        <div class="module-title-text">设备报废率趋势分析</div>
        <el-button v-if="everydayRejectData.length !== 0" class="view-all" size="mini" @click="viewAll(1)">查看数据源<i class="el-icon-d-arrow-right el-icon--right"/></el-button>
      </div>
      <div class="module-content" style="padding-left: 10px;height: 300px;">
        <div v-if="everydayRejectData.length === 0" class="no-data">
          <svg-icon class="no-data-icon" icon-class="noData"/>
          <div>暂无数据</div>
        </div>
        <chart v-if="everydayRejectData.length !== 0" id="equipment" ref="equipment" :options="equipmentOptions" height="270px" width="100%" />
      </div>
    </div>
    <div class="module-container" style="margin-bottom: 0">
      <div class="module-title">
        <div class="module-title-text">设备异常停机分析</div>
        <el-button v-if="everydayDownData.length !== 0" class="view-all" size="mini" @click="viewAll(2)">查看数据源<i class="el-icon-d-arrow-right el-icon--right"/></el-button>
      </div>
      <div class="module-content" style="height: 300px;">
        <div v-if="everydayDownData.length === 0" class="no-data">
          <svg-icon class="no-data-icon" icon-class="noData"/>
          <div>暂无数据</div>
        </div>
        <chart v-if="everydayDownData.length !== 0" id="stop" :options="stopOptions" height="270px" width="100%" />
      </div>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="detailVisible"
      title="设备报废率统计详情"
      class="detailDialog"
      width="740px">
      <el-table
        v-loading="listLoading"
        :data="everydayRejectDetailData"
        element-loading-text="拼命加载中"
        border
        fit
        stripe
        highlight-current-row>
        <el-table-column label="时间" align="center" prop="everyday"/>
        <el-table-column label="设备报废率" align="center" prop="rejectRatio">
          <template slot-scope="scope">
            {{ scope.row.rejectRatio }} %
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :total="rejectTotal"
        :page-size="15"
        :current-page="pageNum"
        style="text-align: right;margin: 15px 0 0"
        layout="prev, pager, next"
        @current-change="modalPageChanges"/>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="detailDownVisible"
      title="设备异常停机统计详情"
      class="detailDialog"
      width="740px">
      <el-table
        v-loading="listLoading"
        :data="everydayDownDetailData"
        element-loading-text="拼命加载中"
        border
        fit
        stripe
        highlight-current-row>
        <el-table-column label="时间" align="center" prop="everyday"/>
        <el-table-column label="异常停机次数" align="center" prop="downNum"/>
      </el-table>
      <el-pagination
        :total="downTotal"
        :page-size="15"
        :current-page="downPageNum"
        style="text-align: right;margin: 15px 0 0"
        layout="prev, pager, next"
        @current-change="modalDownPageChanges"/>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="detailEquipmentVisible"
      title="设备异常停机时长详情"
      class="detailDialog"
      width="740px">
      <el-table
        v-loading="listLoading"
        :data="downResonList"
        element-loading-text="拼命加载中"
        border
        fit
        stripe
        max-height="600"
        highlight-current-row>
        <el-table-column label="异常类型" align="center" prop="downReson" show-overflow-tooltip/>
        <el-table-column label="时长(min)" align="center" prop="downTimes"/>
        <el-table-column label="频次" align="center" prop="downNum"/>
        <el-table-column label="时长占比" align="center" prop="timesRatio">
          <template slot-scope="scope">
            {{ scope.row.timesRatio }} %
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </PageHeaderLayout>
</template>
<script src="./equipmentDetail.js"></script>
<style scoped>
  .detailDialog>>>.el-dialog__body{
    padding: 15px;
  }
  .text-color-light{
    color: #1abc9c;
    font-weight: bold;
    margin-left: 10px;
    line-height: 50px;
    font-size: 22px;
  }
  .formulas{
    padding: 15px;
    width: 100%;
    height: 160px;
    border:1px solid #e2e2e2;
    font-size: 12px;
    line-height: 32px;
  }
  .formulas>div:before{
    display: inline-block;
    content: '';
    width: 0;
    height: 0;
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent transparent #566d8b;
  }
  .model-content-text-title{
    padding: 60px 0 50px 50px;
  }
  .model-content-text{
    width: 370px;
    float: right;
    font-size: 18px;
  }
  .model-content-chart{
    margin-right: 375px;
  }
  .abnormal-container{
    overflow: hidden;
    margin-bottom: 10px;
  }
  .abnormal-container>div{
    width: 50%;
    float: left;
  }
  .highlight-text{
    line-height: 35px;
  }
  .font-weight-bold{
    font-weight: bold;
    font-size: 22px;
    color: #009494;
    line-height: 50px;
  }
  .text-color-red{
    color: #e25d5d;
  }
  .equipment-module-title{
    color: #666;
    font-size: 14px;
    font-weight: bold;
    margin: 15px 15px 6px 15px;
  }
  .equipment-module-title+div{
    overflow: hidden;
  }
  .equipment-module-title+div>div{
    float: left;
    height: 60px;
    text-align: center;
  }
  .equipment-module-title+div>div:nth-child(1){
    width: 40%;
  }
  .equipment-module-title+div>div:nth-child(2){
    border-right: 1px solid #e2e2e2;
    border-left: 1px solid #e2e2e2;
    width: 30%;
  }
  .equipment-module-title+div>div:nth-child(3){
    width: 30%;
  }
  .equipment-module-title+div.analysis>div:nth-child(1){
    width: 20%;
  }
  .equipment-module-title+div.analysis>div:nth-child(2){
    border-left: none;
    width: 40%;
  }
  .equipment-module-title+div.analysis>div:nth-child(3){
    width: 40%;
  }
  .closedown-content{
    padding: 10px 15px;
    height: 400px;
  }
  .closedown-chart{
    float: left;
    width: 700px;
    height: 100%;
    border: 1px solid #e2e2e2;
    margin-right: 10px;
  }
  .closedown-table{
    margin-left: 710px;
  }
  .equipment-container{
    overflow: hidden;
  }
  .equipment-container>div{
    float: left;
    width: 50%;
  }
  .equipment-container-title{
    font-size: 22px;
    text-align: center;
    color: #666;
    font-weight: bold;
    margin: 60px 0 45px;
  }
  .equipment-container-icon-num{
    text-align: center;
    color: #e25d5d;
    font-size: 22px;
    font-weight: bold;
  }
  .equipment-container-icon-num .icon{
    font-size: 50px;
    margin-right: 30px;
    text-align: center;
    color: #009494;
  }
  .equipment-container-icon-num .text{
    margin-bottom: 20px;
    display: inline-block;
    vertical-align: middle;
  }
  .equipment-left-container{
    padding-right: 5px
  }
  .equipment-left-top-container{
    padding: 15px 30px;
    border:1px solid #e2e2e2;
    background: #f2f2f2;
    height: 240px;
  }
  .equipment-left-top-container .title{
    border-bottom:1px solid #e2e2e2;
    padding-bottom: 8px;
  }
  .equipment-left-top-container .equipment-title{
    font-size: 22px;
    color: #009494;
    font-weight: bold;
    margin-left: 15px;
    display: inline-block;
    vertical-align: 5px;
  }
  .equipment-left-top-container .content{
    padding-top: 30px;
    text-align: center;
  }
  .equipment-left-top-container .content>div{
    float: left;
  }
  .equipment-left-top-container .content>div:nth-child(1){
    width: 30%;

  }
  .equipment-left-top-container .content>div:nth-child(3){
    width: 30%;
  }
  .equipment-left-top-container .content>div:nth-child(2){
    width: 40%;
    position: relative;
  }
  .border-left{
    position: absolute;
    left: 0;
    top: 25px;
    height: 65px;
    border-left: 1px solid #e2e2e2;
  }
  .border-right{
    position: absolute;
    right: 0;
    top: 25px;
    height: 65px;
    border-left: 1px solid #e2e2e2;
  }
  .module-bottom-box{
    border:1px solid #e2e2e2;
    background: #f2f2f2;
    height: 115px;
    margin-top: 10px;
  }
  .equipment-right-container{
    padding-left: 5px
  }
  .equipment-info{
    float: right;
    margin-top: 30px;
  }
  .hint{
    font-size: 20px;
  }
</style>

