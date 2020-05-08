<template>
  <PageHeaderLayout>
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
        @change="checkTime"
      />
      <el-button type="primary" icon="el-icon-search" size="small" style="height: 32px;" class="has-margin" @click="searchBySelected">搜索</el-button>
    </div>
    <div class="cockpit-container">
      <div class="cockpit-container-right">
        <div class="module-container classes">
          <div class="module-title">
            <div class="module-title-text">班次报废数统计</div>
            <el-button class="view-all" size="mini" @click="viewAllClasses">查看全部<i class="el-icon-d-arrow-right el-icon--right"/></el-button>
          </div>
          <div class="module-content">
            <chart id="classes" ref="classes" :options="classesOptions" height="150px" width="100%" />
          </div>
        </div>
        <div class="module-container">
          <div class="module-title">
            <div class="module-title-text">压铸工质检报废分析</div>
            <el-button v-if="nameList.length !== 0" class="view-all" size="mini" @click="viewAllClasses">查看全部<i class="el-icon-d-arrow-right el-icon--right"/></el-button>
          </div>
          <div class="module-content staff-table" style="padding: 11px 15px 10px 15px;height: 500px;">
            <el-table
              v-loading="listLoading"
              :data="nameList"
              element-loading-text="拼命加载中"
              border
              fit
              highlight-current-row>
              <el-table-column label="姓名" align="center" prop="userName" width="100"/>
              <el-table-column label="质检报废总数" align="center">
                <template slot-scope="scope">
                  <div style="float: left;width: 180px;">
                    <el-progress :percentage="scope.row.progress" :stroke-width="10" color="#009494"/>
                  </div>
                  <span style="display: inline-block;float: left;">{{ scope.row.rejectNum }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="cockpit-container-left">
        <div class="cockpit-container-left-first">
          <div class="module-container pandect">
            <div class="module-title">
              <div class="module-title-text">报废总览</div>
            </div>
            <div class="module-content" style="padding-left: 0px">
              <div class="pandect-text">
                <div><span class="number-title">生产总数：</span> <span style="font-size: 22px;color: #009494;font-weight: bold;vertical-align: middle" v-text="rejectInfoDaNum">2,123,46</span></div>
                <div><span class="number-title">报废总数：</span> <span style="font-size: 22px;color: #5268a5; font-weight: bold;vertical-align: middle" v-text="rejectNum">2,123,46</span></div>
                <div>
                  <span class="number-title">环比增幅：</span>
                  <el-tooltip v-if="isYesterday" placement="right">
                    <div slot="content">昨日报废率环比前日报废率增幅</div>
                    <span :class="{'down':rejectInfo.t < 0}" class="ratio">
                      <span v-if="rejectInfo.t > 0">+</span>
                      <span v-if="rejectInfo.t !== null"><span v-text="rejectInfo.t"/> %</span>
                      <span v-if="rejectInfo.t === null">--</span>
                    </span>
                  </el-tooltip>
                  <span v-if="!isYesterday">--</span>
                </div>
              </div>
              <div class="pandect-chart">
                <div style="font-size: 18px;color: #009494;font-weight: bold;">
                  <div style="width: 262px;margin: 0 auto">
                    <span v-if="isYesterday" style="vertical-align: middle">昨日报废率：</span>
                    <span v-if="!isYesterday" style="vertical-align: middle">平均报废率：</span>
                    <span style="font-size: 28px;color: #de525f;vertical-align: middle">
                      <span v-text="rejectInfo.rejectRatio">7.5</span> %
                    </span>
                  </div>
                </div>
                <chart id="pandect" :options="outcomeOptions" height="130px" width="100%" />
              </div>
            </div>
          </div>
          <div class="module-container constitute">
            <div class="module-title">
              <div class="module-title-text">报废原因构成</div>
              <el-button v-if="reasonConstituteData.length > 0" class="view-all" size="mini" @click="viewAllCause">查看全部<i class="el-icon-d-arrow-right el-icon--right"/></el-button>
            </div>
            <div class="module-content">
              <div v-if="reasonConstituteData.length === 0" class="no-data">
                <svg-icon class="no-data-icon" icon-class="noData" style="margin-top: 0px"/>
                <div>暂无数据</div>
              </div>
              <div v-if="reasonConstituteData.length > 0" class="pandect-text constitute-text">
                <div>
                  <span class="scrappage" style="border: none;width: 130px;">报废量</span> <span>报废占比</span>
                </div>
                <div :class="reasonConstituteData.length === 1 ? 'hasMargingTop' : ''">
                  <span class="scrappage" v-text="scrapNum1">223</span>
                  <span class="rate" v-text="scrapRatio1">57.31%</span> %
                </div>
                <div v-if="reasonConstituteData.length > 1">
                  <span class="scrappage" v-text="scrapNum2">223</span>
                  <span class="rate" v-text="scrapRatio2">57.31%</span> %
                </div>
                <div v-if="reasonConstituteData.length > 2">
                  <span class="scrappage" v-text="scrapNum3">223</span>
                  <span class="rate" v-text="scrapRatio3">57.31%</span> %
                </div>
              </div>
              <div v-if="reasonConstituteData.length > 0" class="pandect-chart">
                <chart id="constitute" ref="constitute" :options="abnormalOptions" height="160px" width="100%" />
              </div>
            </div>
          </div>
        </div>
        <div class="module-container">
          <div class="module-title">
            <div class="module-title-text">产品报废率</div>
            <el-button v-if="productRejectRatioASC.length !== 0" class="view-all" size="mini" @click="viewAllProduct">查看全部<i class="el-icon-d-arrow-right el-icon--right"/></el-button>
            <el-button v-if="productRejectRatioASC.length !== 0" :type="currentNum===2?'primary':''" class="view-all" style="margin-right: 10px" size="mini" @click="switchBtn(2)">后 20<i class="el-icon-arrow-right el-icon--right"/></el-button>
            <el-button v-if="productRejectRatioASC.length !== 0" :type="currentNum===1?'primary':''" class="view-all" icon="el-icon-arrow-left" size="mini" @click="switchBtn(1)">前 20</el-button>
          </div>
          <div class="module-content" style="padding-left: 10px; height: 224px;">
            <chart v-if="productRejectRatioASC.length !== 0" id="product" ref="product" :options="productOptions" height="194px" width="100%" />
            <div v-if="productRejectRatioASC.length === 0" class="no-data">
              <svg-icon class="no-data-icon" icon-class="noData" style="margin-top: 20px"/>
              <div>暂无数据</div>
            </div>
          </div>
        </div>
        <div class="module-container">
          <div class="module-title">
            <div class="module-title-text">压铸机报废率Top10</div>
            <el-button v-if="eqptData.length !== 0" class="view-all" size="mini" @click="viewEquipmentAll">查看全部<i class="el-icon-d-arrow-right el-icon--right"/></el-button>
          </div>
          <div class="module-content" style="padding-left: 10px; height: 224px;">
            <chart v-if="eqptData.length !== 0" id="machine" ref="machine" :options="machineOptions" height="194px" width="100%" />
            <div v-if="eqptData.length === 0" class="no-data">
              <svg-icon class="no-data-icon" icon-class="noData" style="margin-top: 20px"/>
              <div>暂无数据</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageHeaderLayout>
</template>
<script src="./cockpit.js"></script>
<style scoped>
  .cockpit-container-left-first .module-content{
    overflow: hidden;
    padding-bottom: 0;
  }
  .cockpit-container-left{
    margin-right: 390px;
  }
  .cockpit-container-right{
    float: right;
    width: 380px;
    margin-left: 10px;
  }
  .cockpit-container-left-first{
    width: 100%;
    height: 233px;
    display: flex;
    flex-direction: row;
  }
  .classes{
    height: 223px;
    margin-bottom: 10px;
  }
  .cockpit-container-left-first>div{
    width: 50%;
  }
  .constitute{
    margin-left: 10px;
    margin-bottom: 10px;
  }
  .pandect-text{
    float: right;
    width: 220px;
    line-height: 40px;
    margin-top: 26px;
    color: #666;
  }
  .constitute-text{
    line-height: 24.5px;
    margin-top: 20px;
  }
  .pandect-chart{
    margin-right: 220px;
  }
  .scrappage{
    display: inline-block;
    width: 100px;
    border-left: 1px solid #e2e2e2;
    padding-left: 30px;
  }
  .staff-table>>>.el-table .cell{
    line-height: 33px;
  }
  .staff-table>>>.el-table td{
    height: 33px;
  }
  .staff-table>>>.el-progress__text{
    display: none;
  }
  .staff-table>>>.el-progress{
    display: initial;
  }
  .ratio{
    font-size: 22px;
    color: #de525f;
    font-weight: bold;
    vertical-align: middle;
  }
  .ratio.down{
    color: #009494;
  }
  .number-title{
    vertical-align: middle;
  }
  .rate{
    padding-left: 30px;
  }
  .hasMargingTop{
    margin-top: 25px;
  }
</style>

