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
        @change="checkTime"
      />
      <el-button type="primary" icon="el-icon-search" size="small" style="height: 32px;" class="has-margin" @click="searchBySelected">搜索</el-button>
    </div>
    <div class="module-container">
      <div class="module-title">
        <div class="module-title-text">设备信息总览</div>
      </div>
      <div class="module-content" style="padding-bottom: 10px;font-weight:bold">
        <span name="1" class="highlight-text">3#</span>厂压铸车间，
        压铸机共计<span class="highlight-text" v-text="eqptTotalNum">52</span>台
        <span v-for="(item, index) in eqptBrands" :key="index" style="margin-left: 15px">
          <span>{{ item.eqptBrand }}：</span><span class="highlight-text" v-text="item.num">21</span>台
        </span>
        <span class="i-right">注：数据统计从 <span v-text="beginTime"/> 至 <span v-text="endTime"/> </span>
        <div class="equipment-container">
          <div class="equipment-left-container">
            <div class="equipment-left-top-container">
              <div style="padding-right: 5px">
                <div class="module-box">
                  <div class="equipment-container-title">异常停机次数</div>
                  <div class="equipment-container-icon-num">
                    <svg-icon style="color: #e25d5d" class="icon" icon-class="shebei3"/>
                    <span class="text"><span v-text="closeNum">354</span>次</span>
                  </div>
                </div>
              </div>
              <div style="padding-left: 5px">
                <div class="module-box">
                  <div class="equipment-container-title">停机时长</div>
                  <div class="equipment-container-icon-num">
                    <svg-icon class="icon" style="color: #5268a5" icon-class="shebei3"/>
                    <span class="text" style="color: #5268a5"><span v-text="closeTimeTotal">3543</span> min</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="module-bottom-box">
              <div class="equipment-module-title">
                <svg-icon style="color: #009494" icon-class="log"/>
                报废率最高的机台
              </div>
              <div>
                <div>
                  <div>设备编号</div>
                  <div class="font-weight-bold" v-text="maxRejectEqptCode">IKD-03/YZ-15</div>
                </div>
                <div>
                  <div>累计加工数量</div>
                  <div class="font-weight-bold text-color-red"><span v-text="maxRejectEqptDaum">42</span></div>
                </div>
                <div>
                  <div>报废率</div>
                  <div class="font-weight-bold" style="color: #5268a5"><span v-text="maxRejectEqptRejectRate">4120</span> %</div>
                </div>
              </div>
            </div>
          </div>
          <div class="equipment-right-container">
            <div class="module-bottom-box" style="margin-top: 0">
              <div class="equipment-module-title">
                <svg-icon style="color: #009494" icon-class="log"/>
                导致停机的最高频原因
              </div>
              <div>
                <div>
                  <el-tooltip v-if="maxdownFaultReasonArr.length>1" placement="top">
                    <div slot="content">{{ maxdownFaultReason }}</div>
                    <span class="font-weight-bold" v-text="maxdownFaultReasonArr[0] + '...'"/>
                  </el-tooltip>
                  <span v-if="maxdownFaultReasonArr.length === 1" class="font-weight-bold" v-text="maxdownFaultReasonArr[0]"/>
                </div>
                <div>
                  <div>累计停机次数</div>
                  <div class="font-weight-bold text-color-red"><span v-text="maxdownFaultReasonCloseNum">42</span> 次</div>
                </div>
                <div>
                  <div>停机时长</div>
                  <div class="font-weight-bold" style="color: #5268a5"><span v-text="maxdownFaultReasonCloseTimeTotal">4120</span> min</div>
                </div>
              </div>
            </div>
            <div class="module-bottom-box">
              <div class="equipment-module-title">
                <svg-icon style="color: #009494" icon-class="log"/>
                异常停机次数最多的设备
              </div>
              <div>
                <div>
                  <div>设备编号</div>
                  <!--<div class="font-weight-bold" v-text="maxdownEqptCode">IKD-03/YZ-15</div>-->
                  <el-tooltip v-if="maxdownEqptCodeArr.length>1" placement="top">
                    <div slot="content">{{ maxdownEqptCode }}</div>
                    <span class="font-weight-bold" v-text="maxdownEqptCodeArr[0] + '...'"/>
                  </el-tooltip>
                  <span v-if="maxdownEqptCodeArr.length === 1" class="font-weight-bold" v-text="maxdownEqptCodeArr[0]"/>
                </div>
                <div>
                  <div>累计异常停机次数</div>
                  <div class="font-weight-bold text-color-red"><span v-text="maxdownEqptCloseNum">42</span> 次</div>
                </div>
                <div>
                  <div>异常停机时长</div>
                  <div class="font-weight-bold" style="color: #5268a5"><span v-text="maxdownEqptCloseTimeTotal">4120</span> min</div>
                </div>
              </div>
            </div>
            <div class="module-bottom-box">
              <div class="equipment-module-title">
                <svg-icon style="color: #009494" icon-class="log"/>
                报废率最低的机台
              </div>
              <div>
                <div>
                  <div>设备编号</div>
                  <!--<div class="font-weight-bold" v-text="minRejectEqptCode">IKD-03/YZ-15</div>-->
                  <el-tooltip v-if="minRejectEqptCodeArr.length>1" placement="top">
                    <div slot="content">{{ minRejectEqptCode }}</div>
                    <span class="font-weight-bold" v-text="minRejectEqptCodeArr[0] + '...'"/>
                  </el-tooltip>
                  <span v-if="minRejectEqptCodeArr.length === 1" class="font-weight-bold" v-text="minRejectEqptCodeArr[0]"/>
                </div>
                <div>
                  <div>累计加工数量</div>
                  <div class="font-weight-bold text-color-red"><span v-text="minRejectEqptDanum">42</span></div>
                </div>
                <div>
                  <div>报废率</div>
                  <div class="font-weight-bold" style="color: #5268a5"><span v-text="minRejectEqptRejectRate">30</span> %</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module-container">
      <div class="module-title">
        <div class="module-title-text">设备异常停机分析</div>
      </div>
      <div class="module-content closedown-content">
        <div class="closedown-chart">
          <div v-if="downResonList.length === 0" class="no-data">
            <svg-icon class="no-data-icon" icon-class="noData" style="margin-top: 90px"/>
            <div>暂无数据</div>
          </div>
          <chart v-if="downResonList.length !== 0" id="constitute" ref="constitute" :options="abnormalOptions" height="100%" width="100%" />
        </div>
        <div class="closedown-table">
          <el-table
            :data="downResonList"
            tooltip-effect="dark"
            height="380px"
            fit
            stripe
            border>
            <el-table-column label="异常类型" align="center" prop="downReson" width="260" show-overflow-tooltip/>
            <el-table-column label="频次" align="center" prop="downNum"/>
            <el-table-column label="时长(min)" align="center" prop="downTimes" />
            <el-table-column label="时长占比" align="center" prop="timesRatio">
              <template slot-scope="scope">
                {{ scope.row.timesRatio }}%
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="module-container">
      <div class="module-title">
        <div class="module-title-text">设备报废率分析</div>
        <el-button v-if="equipmentList.length !== 0 && equipmentList[0].descRejectList.length !== 0" class="view-all" size="mini" @click="viewAllEquipment">查看数据源<i class="el-icon-d-arrow-right el-icon--right"/></el-button>
      </div>
      <div class="module-content equipment-content">
        <div v-if="equipmentList.length === 0 || equipmentList[0].descRejectList.length === 0" class="no-data">
          <svg-icon class="no-data-icon" icon-class="noData"/>
          <div>暂无数据</div>
        </div>
        <div v-if="equipmentList.length !== 0 && equipmentList[0].descRejectList.length !== 0">
          <el-radio-group v-model="sortType" class="radio-group" @change="quipmentSort">
            <el-radio :label="1">报废率从高到低</el-radio>
            <el-radio :label="2">报废率从低到高</el-radio>
            <el-radio :label="3">按机台编号排序</el-radio>
          </el-radio-group>
          <chart id="equipment" :options="equipmentOptions" height="260px" width="100%" @barClick="barClick"/>
        </div>
      </div>
    </div>
    <div class="module-container">
      <div class="module-title">
        <div class="module-title-text">350吨设备报废率分析</div>
        <el-button v-if="equipmentList.length !== 0 && equipmentList[2].descRejectList.length !== 0" class="view-all" size="mini" @click="viewAllEquipment350">查看数据源<i class="el-icon-d-arrow-right el-icon--right"/></el-button>
      </div>
      <div class="module-content equipment-content">
        <div v-if="equipmentList.length === 0 || equipmentList[2].descRejectList.length === 0" class="no-data">
          <svg-icon class="no-data-icon" icon-class="noData"/>
          <div>暂无数据</div>
        </div>
        <div v-if="equipmentList.length !== 0 && equipmentList[2].descRejectList.length !== 0">
          <el-radio-group v-model="sortType350" class="radio-group" @change="quipment350Sort">
            <el-radio :label="1">报废率从高到低</el-radio>
            <el-radio :label="2">报废率从低到高</el-radio>
            <el-radio :label="3">按机台编号排序</el-radio>
          </el-radio-group>
          <chart id="equipment350" :options="equipment350Options" height="260px" width="100%" @barClick="barClick"/>
        </div>
      </div>
    </div>
    <div class="module-container">
      <div class="module-title">
        <div class="module-title-text">500吨设备报废率分析</div>
        <el-button v-if="equipmentList.length !== 0 && equipmentList[3].descRejectList.length !== 0" class="view-all" size="mini" @click="viewAllEquipment500">查看数据源<i class="el-icon-d-arrow-right el-icon--right"/></el-button>
      </div>
      <div class="module-content equipment-content">
        <div v-if="equipmentList.length === 0 || equipmentList[3].descRejectList.length === 0" class="no-data">
          <svg-icon class="no-data-icon" icon-class="noData"/>
          <div>暂无数据</div>
        </div>
        <div v-if="equipmentList.length !== 0 && equipmentList[3].descRejectList.length !== 0">
          <el-radio-group v-model="sortType500" class="radio-group" @change="quipment500Sort">
            <el-radio :label="1">报废率从高到低</el-radio>
            <el-radio :label="2">报废率从低到高</el-radio>
            <el-radio :label="3">按机台编号排序</el-radio>
          </el-radio-group>
          <chart id="equipment500" :options="equipment500Options" height="260px" width="100%" @barClick="barClick" />
        </div>
      </div>
    </div>
    <div class="equipment-container">
      <div style="padding-right: 5px">
        <div class="module-container">
          <div class="module-title">
            <div class="module-title-text">250吨设备报废率分析</div>
            <el-button v-if="equipmentList.length !== 0 && equipmentList[1].descRejectList.length !== 0" class="view-all" size="mini" @click="viewAllEquipment250">查看数据源<i class="el-icon-d-arrow-right el-icon--right"/></el-button>
          </div>
          <div class="module-content equipment-content">
            <div v-if="equipmentList.length === 0 || equipmentList[1].descRejectList.length === 0" class="no-data">
              <svg-icon class="no-data-icon" icon-class="noData"/>
              <div>暂无数据</div>
            </div>
            <div v-if="equipmentList.length !== 0 && equipmentList[1].descRejectList.length !== 0">
              <el-radio-group v-model="sortType250" class="radio-group" @change="quipment250Sort">
                <el-radio :label="1">报废率从高到低</el-radio>
                <el-radio :label="2">报废率从低到高</el-radio>
                <el-radio :label="3">按机台编号排序</el-radio>
              </el-radio-group>
              <chart id="equipment250" :options="equipment250Options" height="260px" width="100%" @barClick="barClick" />
            </div>
          </div>
        </div>
      </div>
      <div style="padding-left: 5px">
        <div class="module-container">
          <div class="module-title">
            <div class="module-title-text">900吨设备报废率分析</div>
            <el-button v-if="equipmentList.length !== 0 && equipmentList[6].descRejectList.length !== 0" class="view-all" size="mini" @click="viewAllEquipment900">查看数据源<i class="el-icon-d-arrow-right el-icon--right"/></el-button>
          </div>
          <div class="module-content equipment-content">
            <div v-if="equipmentList.length === 0 || equipmentList[6].descRejectList.length === 0" class="no-data">
              <svg-icon class="no-data-icon" icon-class="noData"/>
              <div>暂无数据</div>
            </div>
            <div v-if="equipmentList.length !== 0 && equipmentList[6].descRejectList.length !== 0">
              <el-radio-group v-model="sortType900" class="radio-group" @change="quipment900Sort">
                <el-radio :label="1">报废率从高到低</el-radio>
                <el-radio :label="2">报废率从低到高</el-radio>
                <el-radio :label="3">按机台编号排序</el-radio>
              </el-radio-group>
              <chart id="equipment900" :options="equipment900Options" height="260px" width="100%" @barClick="barClick" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="equipment-container">
      <div style="padding-right: 5px">
        <div class="module-container">
          <div class="module-title">
            <div class="module-title-text">650吨设备报废率分析</div>
            <el-button v-if="equipmentList.length !== 0 && equipmentList[4].descRejectList.length !== 0" class="view-all" size="mini" @click="viewAllEquipment650">查看数据源<i class="el-icon-d-arrow-right el-icon--right"/></el-button>
          </div>
          <div class="module-content equipment-content">
            <div v-if="equipmentList.length === 0 || equipmentList[4].descRejectList.length === 0" class="no-data">
              <svg-icon class="no-data-icon" icon-class="noData"/>
              <div>暂无数据</div>
            </div>
            <div v-if="equipmentList.length !== 0 && equipmentList[4].descRejectList.length !== 0">
              <el-radio-group v-model="sortType650" class="radio-group" @change="quipment650Sort">
                <el-radio :label="1">报废率从高到低</el-radio>
                <el-radio :label="2">报废率从低到高</el-radio>
                <el-radio :label="3">按机台编号排序</el-radio>
              </el-radio-group>
              <chart id="equipment650" :options="equipment650Options" height="260px" width="100%" @barClick="barClick" />
            </div>
          </div>
        </div>
      </div>
      <div style="padding-left: 5px">
        <div class="module-container">
          <div class="module-title">
            <div class="module-title-text">800吨设备报废率分析</div>
            <el-button v-if="equipmentList.length !== 0 && equipmentList[5].descRejectList.length !== 0" class="view-all" size="mini" @click="viewAllEquipment800">查看数据源<i class="el-icon-d-arrow-right el-icon--right"/></el-button>
          </div>
          <div class="module-content equipment-content">
            <div v-if="equipmentList.length === 0 || equipmentList[5].descRejectList.length === 0" class="no-data">
              <svg-icon class="no-data-icon" icon-class="noData"/>
              <div>暂无数据</div>
            </div>
            <div v-if="equipmentList.length !== 0 && equipmentList[5].descRejectList.length !== 0">
              <el-radio-group v-model="sortType800" class="radio-group" @change="quipment800Sort">
                <el-radio :label="1">报废率从高到低</el-radio>
                <el-radio :label="2">报废率从低到高</el-radio>
                <el-radio :label="3">按机台编号排序</el-radio>
              </el-radio-group>
              <chart id="equipment800" :options="equipment800Options" height="260px" width="100%" @barClick="barClick" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="detailEquipmentVisible"
      title="设备报废率统计详情"
      class="detailDialog"
      width="740px">
      <el-table
        v-loading="listLoading"
        :data="equipmentDetailList"
        element-loading-text="拼命加载中"
        border
        fit
        stripe
        max-height="600"
        highlight-current-row>
        <el-table-column label="机台编号" align="center" prop="eqptNum">
          <template slot-scope="scope">
            {{ scope.row.eqptNum }}#
          </template>
        </el-table-column>
        <el-table-column label="报废率" align="center" prop="eqptNum">
          <template slot-scope="scope">
            {{ scope.row.rejectRatio }}%
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="oee">
          <template slot-scope="scope">
            <div style="color:#009494;cursor: pointer;" @click="jupmToDetail(scope.row)"><svg-icon icon-class="search"/> 查看详情</div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </PageHeaderLayout>
</template>
<script src="./equipment.js"></script>
<style scoped>
  .equipment-content{
    position: relative;
    height: 290px;
    padding-left: 10px;
  }
  .radio-group{
    position: absolute;
    top: 12px;
    right: 15px;
    z-index: 10;
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
    margin: 15px;
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
  .closedown-content{
    padding: 10px 15px;
    height: 400px;
  }
  .closedown-chart{
    float: left;
    width: 900px;
    height: 100%;
    border: 1px solid #e2e2e2;
    margin-right: 10px;
    padding: 15px;
  }
  .closedown-table{
    margin-left: 910px;
  }
  .equipment-container{
    margin-top: 10px;
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
    overflow: hidden;
  }
  .equipment-left-top-container>div{
    float: left;
    width: 50%;
  }
  .module-box{
    border:1px solid #e2e2e2;
    background: #f2f2f2;
    height: 240px;
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
  .detailDialog>>>.el-dialog__body {
    padding: 15px;
  }
  /*// Table*/
  .closedown-table>>> thead tr{
       background-color: #f2f2f2;
     }
  /*// 表头*/
  .closedown-table>>> .el-table thead tr th.is-leaf{
       border-bottom: 2px solid #e2e2e2;
     }
  .closedown-table>>> .el-table--border{
    border: 1px solid #e2e2e2;
    border-bottom: none;
  }
  .closedown-table>>> .el-table--border td,
  .closedown-table>>> .el-table--border th,
  .closedown-table>>> .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed{
    border-color: #e2e2e2;
  }
  /*// 隔行变色*/
  .closedown-table>>> .el-table--striped .el-table__body tr.el-table__row--striped td {
       background: #f5f5f5;
     }
  /*// hover*/
  .closedown-table>>> .el-table--enable-row-hover .el-table__body tr:hover>td{
       background-color: #f9f9f9 !important;
     }
  /*// active*/
  .closedown-table>>> .el-table--striped .el-table__body tr.el-table__row--striped.current-row td,
  .closedown-table>>> .el-table__body tr.current-row>td {
       background-color: #eeeeee;
     }
  .closedown-table>>> .cell{
    line-height: 37px;
  }
  .closedown-table>>> td{
    height: 37px;
  }
</style>

