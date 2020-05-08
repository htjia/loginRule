<template>
  <PageHeaderLayout :has_back="true">
    <div class="header-search-add tabs-header">
      <span class="title"><span v-text="productCode"/>/<span v-text="productName"/></span>
      加工总量： <span class="font-bold" v-text="totaldaNum">63636</span>
      报废总量： <span class="font-bold" v-text="totalRejectNum">63636</span>
      报废率：<span style="color:#e25d5d;" class="font-bold"><span v-text="totalRejectRatio">12%</span> %</span>
    </div>
    <div class="module-container">
      <div class="module-title">
        <div class="module-title-text">工单详情<span v-if="isContrast">对比</span></div>
        <el-radio-group v-if="isContrast" v-model="order" style="margin: 8px 0 0 88px" @change="groupsChange">
          <el-radio label="0">全部显示</el-radio>
          <el-radio label="1">隐藏相同项</el-radio>
        </el-radio-group>
      </div>
      <div class="module-content contrast-content">
        <div class="contrast-title-bar">
          <div :class="{'not-contrast-title':!isContrast}" class="order-text left">
            <span>工单编号 <span v-text="woCode1"/></span>
            <div class="order-line"/>
            <div class="order-triangle">
              <div class="order-triangle-in"/>
            </div>
          </div>
          <div v-if="isContrast" class="order-text">
            <span>工单编号 <span v-text="woCode2"/></span>
            <div class="order-line"/>
            <div class="order-triangle">
              <div class="order-triangle-in"/>
            </div>
          </div>
        </div>
        <div class="contrast-container">
          <div class="contrast-container-left">
            <div class="nav-line">
              <div class="top-circle"/>
              <div class="botm-circle"/>
            </div>
            <div class="contrast-container-left-postion">
              <div :class="{'is-active':currentNav === 1}" class="nav-title" @click="navClick(1)">
                <span class="title-text">基础信息</span>
                <span class="circle"/>
              </div>
              <div :class="{'is-active':currentNav === 2}" class="nav-title" @click="navClick(2)">
                <span class="title-text">压铸机基础信息</span>
                <span class="circle"/>
              </div>
              <div :class="{'is-active':currentNav === 3}" class="nav-title" @click="navClick(3)">
                <span class="title-text">压铸机参数</span>
                <span class="circle"/>
              </div>
              <div :class="{'is-active':currentNav === 4}" class="nav-title" @click="navClick(4)">
                <span class="title-text">压铸机加工历史</span>
                <span class="circle"/>
              </div>
              <div :class="{'is-active':currentNav === 5}" class="nav-title" @click="navClick(5)">
                <span class="title-text">模具加工历史</span>
                <span class="circle"/>
              </div>
              <div :class="{'is-active':currentNav === 6}" class="nav-title" @click="navClick(6)">
                <span class="title-text">报废信息</span>
                <span class="circle"/>
              </div>
            </div>
          </div>
          <div ref="scrollBox" :class="{'not-contrast':!isContrast}" class="contrast-container-right">
            <div id="jcxx" ref="jcxx" class="table-container">
              <div class="table-title">基础信息</div>
              <div class="table-box">
                <div class="table-col-box table-col-title">
                  <div v-if="firstColData.planBsData.rejectRatio !== secondColData.planBsData.rejectRatio || order !== '1'">报废率</div>
                  <div v-if="firstColData.planBsData.daNum !== secondColData.planBsData.daNum">加工量</div>
                  <div v-if="firstColData.planBsData.beginTime !== secondColData.planBsData.beginTime || firstColData.planBsData.endTime !== secondColData.planBsData.endTime || order !== '1'">加工周期</div>
                  <div v-if="firstColData.planBsData.processTimes !== secondColData.planBsData.processTimes || order !== '1'">加工时长</div>
                  <div v-if="firstColData.planBsData.beat !== secondColData.planBsData.beat || order !== '1'">生产节拍</div>
                  <div v-if="firstColData.planBsData.eqptCode !== secondColData.planBsData.eqptCode || order !== '1'">压铸机</div>
                  <div v-if="firstColData.planBsData.mouldWmsCode !== secondColData.planBsData.mouldWmsCode || order !== '1'">模具</div>
                  <div v-if="firstColData.planBsData.raw !== secondColData.planBsData.raw || order !== '1'">原材料</div>
                </div>
                <div class="table-col-box">
                  <div v-if="firstColData.planBsData.rejectRatio !== secondColData.planBsData.rejectRatio || order !== '1'">{{ firstColData.planBsData.rejectRatio }} %</div>
                  <div v-if="firstColData.planBsData.daNum !== secondColData.planBsData.daNum || order !== '1'" v-text="firstColData.planBsData.daNum">4.58%</div>
                  <div v-if="firstColData.planBsData.beginTime !== secondColData.planBsData.beginTime || firstColData.planBsData.endTime !== secondColData.planBsData.endTime || order !== '1'">{{ firstColData.planBsData.beginTime }} - {{ firstColData.planBsData.endTime }}</div>
                  <div v-if="firstColData.planBsData.processTimes !== secondColData.planBsData.processTimes || order !== '1'">{{ firstColData.planBsData.processTimes }} h</div>
                  <div v-if="firstColData.planBsData.beat !== secondColData.planBsData.beat || order !== '1'" v-text="firstColData.planBsData.beat">4.58%</div>
                  <div v-if="firstColData.planBsData.eqptCode !== secondColData.planBsData.eqptCode || order !== '1'" v-text="firstColData.planBsData.eqptCode">4.58%</div>
                  <div v-if="firstColData.planBsData.mouldWmsCode !== secondColData.planBsData.mouldWmsCode || order !== '1'" v-text="firstColData.planBsData.mouldWmsCode">4.58%</div>
                  <div v-if="firstColData.planBsData.raw !== secondColData.planBsData.raw || order !== '1'" v-text="firstColData.planBsData.raw">4.58%</div>
                </div>
                <div v-if="isContrast" class="table-col-box">
                  <div v-if="firstColData.planBsData.rejectRatio !== secondColData.planBsData.rejectRatio || order !== '1'">{{ secondColData.planBsData.rejectRatio }} %</div>
                  <div v-if="firstColData.planBsData.daNum !== secondColData.planBsData.daNum || order !== '1'" v-text="secondColData.planBsData.daNum">4.58%</div>
                  <div v-if="firstColData.planBsData.beginTime !== secondColData.planBsData.beginTime || firstColData.planBsData.endTime !== secondColData.planBsData.endTime || order !== '1'">{{ secondColData.planBsData.beginTime }} - {{ secondColData.planBsData.endTime }}</div>
                  <div v-if="firstColData.planBsData.processTimes !== secondColData.planBsData.processTimes || order !== '1'">{{ secondColData.planBsData.processTimes }} h</div>
                  <div v-if="firstColData.planBsData.beat !== secondColData.planBsData.beat || order !== '1'" v-text="secondColData.planBsData.beat">4.58%</div>
                  <div v-if="firstColData.planBsData.eqptCode !== secondColData.planBsData.eqptCode || order !== '1'" v-text="secondColData.planBsData.eqptCode">4.58%</div>
                  <div v-if="firstColData.planBsData.mouldWmsCode !== secondColData.planBsData.mouldWmsCode || order !== '1'" v-text="secondColData.planBsData.mouldWmsCode">4.58%</div>
                  <div v-if="firstColData.planBsData.raw !== secondColData.planBsData.raw || order !== '1'" v-text="secondColData.planBsData.raw">4.58%</div>
                </div>
              </div>
            </div>
            <div id="yzjjcxx" ref="yzjjcxx" class="table-container">
              <div class="table-title">压铸机基础信息</div>
              <div class="table-box">
                <div class="table-col-box table-col-title">
                  <div v-if="firstColData.eqptBSInfo.eqptCode !== secondColData.eqptBSInfo.eqptCode || order !== '1' || order !== '1' || order !== '1'">压铸机</div>
                  <div v-if="firstColData.eqptBSInfo.eqptBrand !== secondColData.eqptBSInfo.eqptBrand || order !== '1' || order !== '1' || order !== '1'">厂家</div>
                  <div v-if="firstColData.eqptBSInfo.model !== secondColData.eqptBSInfo.model || order !== '1' || order !== '1' || order !== '1'">型号</div>
                  <div v-if="firstColData.eqptBSInfo.power !== secondColData.eqptBSInfo.power || order !== '1' || order !== '1' || order !== '1'">吨位</div>
                  <div v-if="firstColData.eqptBSInfo.processTime !== secondColData.eqptBSInfo.processTime || order !== '1' || order !== '1' || order !== '1'">累计加工时长</div>
                  <div v-if="firstColData.eqptBSInfo.oee !== secondColData.eqptBSInfo.oee || order !== '1' || order !== '1' || order !== '1'">OEE</div>
                </div>
                <div class="table-col-box">
                  <div v-if="firstColData.eqptBSInfo.eqptCode !== secondColData.eqptBSInfo.eqptCode || order !== '1' || order !== '1'" v-text="firstColData.eqptBSInfo.eqptCode">4.58%</div>
                  <div v-if="firstColData.eqptBSInfo.eqptBrand !== secondColData.eqptBSInfo.eqptBrand || order !== '1' || order !== '1'" v-text="firstColData.eqptBSInfo.eqptBrand">4.58%</div>
                  <div v-if="firstColData.eqptBSInfo.model !== secondColData.eqptBSInfo.model || order !== '1' || order !== '1'" v-text="firstColData.eqptBSInfo.model">4.58%</div>
                  <div v-if="firstColData.eqptBSInfo.power !== secondColData.eqptBSInfo.power || order !== '1' || order !== '1'" v-text="firstColData.eqptBSInfo.power">4.58%</div>
                  <div v-if="firstColData.eqptBSInfo.processTime !== secondColData.eqptBSInfo.processTime || order !== '1' || order !== '1'">{{ firstColData.eqptBSInfo.processTime }} h</div>
                  <div v-if="firstColData.eqptBSInfo.oee !== secondColData.eqptBSInfo.oee || order !== '1' || order !== '1'" v-text="firstColData.eqptBSInfo.oee">4.58%</div>
                </div>
                <div v-if="isContrast" class="table-col-box">
                  <div v-if="firstColData.eqptBSInfo.eqptCode !== secondColData.eqptBSInfo.eqptCode || order !== '1'" v-text="secondColData.eqptBSInfo.eqptCode">4.58%</div>
                  <div v-if="firstColData.eqptBSInfo.eqptBrand !== secondColData.eqptBSInfo.eqptBrand || order !== '1'" v-text="secondColData.eqptBSInfo.eqptBrand">4.58%</div>
                  <div v-if="firstColData.eqptBSInfo.model !== secondColData.eqptBSInfo.model || order !== '1'" v-text="secondColData.eqptBSInfo.model">4.58%</div>
                  <div v-if="firstColData.eqptBSInfo.power !== secondColData.eqptBSInfo.power || order !== '1'" v-text="secondColData.eqptBSInfo.power">4.58%</div>
                  <div v-if="firstColData.eqptBSInfo.processTime !== secondColData.eqptBSInfo.processTime || order !== '1'">{{ secondColData.eqptBSInfo.processTime }} h</div>
                  <div v-if="firstColData.eqptBSInfo.oee !== secondColData.eqptBSInfo.oee || order !== '1'" v-text="secondColData.eqptBSInfo.oee">4.58%</div>
                </div>
              </div>
            </div>
            <div id="yzjcs" ref="yzjcs" class="table-container">
              <div class="table-title">压铸机参数</div>
              <div class="table-box">
                <div class="table-col-box table-col-title">
                  <div v-for="(item, index) in eqptParams" :key="index">{{ item.varName }}</div>
                </div>
                <div class="table-col-box">
                  <div v-for="(item, index) in eqptParams" :key="index">{{ item.varValue1 }}</div>
                </div>
                <div v-if="isContrast" class="table-col-box">
                  <div v-for="(item, index) in eqptParams" :key="index">{{ item.varValue2 }}</div>
                </div>
              </div>
            </div>
            <div id="yzjjgls" ref="yzjjgls" class="table-container">
              <div class="table-title">压铸机加工历史</div>
              <div class="table-box">
                <div class="table-col-box table-col-title">
                  <div v-if="firstColData.eqptDetail.eqptCode !== secondColData.eqptDetail.eqptCode || order !== '1'">压铸机</div>
                  <div v-if="firstColData.eqptDetail.daNum !== secondColData.eqptDetail.daNum || order !== '1'">加工总量</div>
                  <div v-if="firstColData.eqptDetail.rejectNum !== secondColData.eqptDetail.rejectNum || order !== '1'">报废总量</div>
                  <div v-if="firstColData.eqptDetail.rejectatio !== secondColData.eqptDetail.rejectatio || order !== '1'">平均报废率</div>
                </div>
                <div class="table-col-box">
                  <div v-if="firstColData.eqptDetail.eqptCode !== secondColData.eqptDetail.eqptCode || order !== '1'" v-text="firstColData.eqptDetail.eqptCode">4.58%</div>
                  <div v-if="firstColData.eqptDetail.daNum !== secondColData.eqptDetail.daNum || order !== '1'" v-text="firstColData.eqptDetail.daNum">4.58%</div>
                  <div v-if="firstColData.eqptDetail.rejectNum !== secondColData.eqptDetail.rejectNum || order !== '1'" v-text="firstColData.eqptDetail.rejectNum">4.58%</div>
                  <div v-if="firstColData.eqptDetail.rejectatio !== secondColData.eqptDetail.rejectatio || order !== '1'">{{ firstColData.eqptDetail.rejectatio }} %</div>
                </div>
                <div v-if="isContrast" class="table-col-box">
                  <div v-if="firstColData.eqptDetail.eqptCode !== secondColData.eqptDetail.eqptCode || order !== '1'" v-text="secondColData.eqptDetail.eqptCode">4.58%</div>
                  <div v-if="firstColData.eqptDetail.daNum !== secondColData.eqptDetail.daNum || order !== '1'" v-text="secondColData.eqptDetail.daNum">4.58%</div>
                  <div v-if="firstColData.eqptDetail.rejectNum !== secondColData.eqptDetail.rejectNum || order !== '1'" v-text="secondColData.eqptDetail.rejectNum">4.58%</div>
                  <div v-if="firstColData.eqptDetail.rejectatio !== secondColData.eqptDetail.rejectatio || order !== '1'">{{ secondColData.eqptDetail.rejectatio }} %</div>
                </div>
              </div>
            </div>
            <div id="mjjgls" ref="mjjgls" class="table-container">
              <div class="table-title">模具加工历史</div>
              <div class="table-box">
                <div class="table-col-box table-col-title">
                  <div v-if="firstColData.mouldReject.mouldCode !== secondColData.mouldReject.mouldCode || order !== '1'">模具</div>
                  <div v-if="firstColData.mouldReject.daNum !== secondColData.mouldReject.daNum || order !== '1'">加工总量</div>
                  <div v-if="firstColData.mouldReject.rejectNum !== secondColData.mouldReject.rejectNum || order !== '1'">报废总数</div>
                  <div v-if="firstColData.mouldReject.rejectRatio !== secondColData.mouldReject.rejectRatio || order !== '1'">平均报废率</div>
                  <div v-if="firstColData.mouldReject.maintainCount !== secondColData.mouldReject.maintainCount || order !== '1'">维修次数</div>
                  <div v-if="firstColData.mouldReject.seriousMaintainCount !== secondColData.mouldReject.seriousMaintainCount || order !== '1'">重大维修次数</div>
                  <div v-if="firstColData.mouldReject.avgMaintainDay !== secondColData.mouldReject.avgMaintainDay || order !== '1'">平均维修周期</div>
                </div>
                <div class="table-col-box">
                  <div v-if="firstColData.mouldReject.mouldCode !== secondColData.mouldReject.mouldCode || order !== '1'" v-text="firstColData.mouldReject.mouldCode">4.58%</div>
                  <div v-if="firstColData.mouldReject.daNum !== secondColData.mouldReject.daNum || order !== '1'" v-text="firstColData.mouldReject.daNum">4.58%</div>
                  <div v-if="firstColData.mouldReject.rejectNum !== secondColData.mouldReject.rejectNum || order !== '1'" v-text="firstColData.mouldReject.rejectNum">4.58%</div>
                  <div v-if="firstColData.mouldReject.rejectRatio !== secondColData.mouldReject.rejectRatio || order !== '1'" v-text="firstColData.mouldReject.rejectRatio">4.58%</div>
                  <div v-if="firstColData.mouldReject.maintainCount !== secondColData.mouldReject.maintainCount || order !== '1'" v-text="firstColData.mouldReject.maintainCount">4.58%</div>
                  <div v-if="firstColData.mouldReject.seriousMaintainCount !== secondColData.mouldReject.seriousMaintainCount || order !== '1'" v-text="firstColData.mouldReject.seriousMaintainCount">4.58%</div>
                  <div v-if="firstColData.mouldReject.avgMaintainDay !== secondColData.mouldReject.avgMaintainDay || order !== '1'" v-text="firstColData.mouldReject.avgMaintainDay">4.58%</div>
                </div>
                <div v-if="isContrast" class="table-col-box">
                  <div v-if="firstColData.mouldReject.mouldCode !== secondColData.mouldReject.mouldCode || order !== '1'" v-text="secondColData.mouldReject.mouldCode">4.58%</div>
                  <div v-if="firstColData.mouldReject.daNum !== secondColData.mouldReject.daNum || order !== '1'" v-text="secondColData.mouldReject.daNum">4.58%</div>
                  <div v-if="firstColData.mouldReject.rejectNum !== secondColData.mouldReject.rejectNum || order !== '1'" v-text="secondColData.mouldReject.rejectNum">4.58%</div>
                  <div v-if="firstColData.mouldReject.rejectRatio !== secondColData.mouldReject.rejectRatio || order !== '1'" v-text="secondColData.mouldReject.rejectRatio">4.58%</div>
                  <div v-if="firstColData.mouldReject.maintainCount !== secondColData.mouldReject.maintainCount || order !== '1'" v-text="secondColData.mouldReject.maintainCount">4.58%</div>
                  <div v-if="firstColData.mouldReject.seriousMaintainCount !== secondColData.mouldReject.seriousMaintainCount || order !== '1'" v-text="secondColData.mouldReject.seriousMaintainCount">4.58%</div>
                  <div v-if="firstColData.mouldReject.avgMaintainDay !== secondColData.mouldReject.avgMaintainDay || order !== '1'" v-text="secondColData.mouldReject.avgMaintainDay">4.58%</div>
                </div>
              </div>
            </div>
            <div id="bfxx" ref="bfxx" class="table-container has-sub-table-container">
              <div class="table-title has-btm-border">报废信息</div>
              <div class="table-container">
                <div class="table-title table-sub-title">工序报废</div>
                <div class="table-box">
                  <div class="table-col-box table-col-title">
                    <div v-for="(item, index) in scrapThanList.gxList" :key="index">{{ item.name }}</div>
                  </div>
                  <div class="table-col-box">
                    <div v-for="(item, index) in scrapThanList.gxList" :key="index">
                      <span v-if="item.value1 === null || item.value1 === ''">-</span>
                      <span v-if="item.value1 !== null && item.value1 !== ''">{{ item.value1 }}%</span>
                    </div>
                  </div>
                  <div v-if="isContrast" class="table-col-box">
                    <div v-for="(item, index) in scrapThanList.gxList" :key="index">
                      <span v-if="item.value2 === null || item.value2 === ''">-</span>
                      <span v-if="item.value2 !== null && item.value2 !== ''">{{ item.value2 }}%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="table-container">
                <div class="table-title table-sub-title">压铸报废</div>
                <div class="table-box">
                  <div class="table-col-box table-col-title">
                    <div v-for="(item, index) in scrapThanList.yzList" :key="index">{{ item.name }}</div>
                  </div>
                  <div class="table-col-box">
                    <div v-for="(item, index) in scrapThanList.yzList" :key="index">
                      <span v-if="item.value1 === null || item.value1 === ''">-</span>
                      <span v-if="item.value1 !== null && item.value1 !== ''">{{ item.value1 }}%</span>
                    </div>
                  </div>
                  <div v-if="isContrast" class="table-col-box">
                    <div v-for="(item, index) in scrapThanList.yzList" :key="index">
                      <span v-if="item.value2 === null || item.value2 === ''">-</span>
                      <span v-if="item.value2 !== null && item.value2 !== ''">{{ item.value2 }}%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="table-container">
                <div class="table-title table-sub-title">压铸质检报废原因</div>
                <div class="table-box">
                  <div class="table-col-box table-col-title">
                    <div v-for="(item, index) in scrapThanList.yzzjList" :key="index">{{ item.name }}</div>
                  </div>
                  <div class="table-col-box">
                    <div v-for="(item, index) in scrapThanList.yzzjList" :key="index">
                      <span v-if="item.value1 === null || item.value1 === ''">-</span>
                      <span v-if="item.value1 !== null && item.value1 !== ''">{{ item.value1 }}%</span>
                    </div>
                  </div>
                  <div v-if="isContrast" class="table-col-box">
                    <div v-for="(item, index) in scrapThanList.yzzjList" :key="index">
                      <span v-if="item.value2 === null || item.value2 === ''">-</span>
                      <span v-if="item.value2 !== null && item.value2 !== ''">{{ item.value2 }}%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="table-container">
                <div class="table-title table-sub-title">机加工质检报废原因</div>
                <div class="table-box">
                  <div class="table-col-box table-col-title">
                    <div v-for="(item, index) in scrapThanList.jjzjList" :key="index">{{ item.name }}</div>
                  </div>
                  <div class="table-col-box">
                    <div v-for="(item, index) in scrapThanList.jjzjList" :key="index">
                      <span v-if="item.value1 === null || item.value1 === ''">-</span>
                      <span v-if="item.value1 !== null && item.value1 !== ''">{{ item.value1 }}%</span>
                    </div>
                  </div>
                  <div v-if="isContrast" class="table-col-box">
                    <div v-for="(item, index) in scrapThanList.jjzjList" :key="index">
                      <span v-if="item.value2 === null || item.value2 === ''">-</span>
                      <span v-if="item.value2 !== null && item.value2 !== ''">{{ item.value2 }}%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="table-container">
                <div class="table-title table-sub-title">氧化终检质检报废原因</div>
                <div class="table-box">
                  <div class="table-col-box table-col-title">
                    <div v-for="(item, index) in scrapThanList.yhzjList" :key="index">{{ item.name }}</div>
                  </div>
                  <div class="table-col-box">
                    <div v-for="(item, index) in scrapThanList.yhzjList" :key="index">
                      <span v-if="item.value1 === null || item.value1 === ''">-</span>
                      <span v-if="item.value1 !== null && item.value1 !== ''">{{ item.value1 }}%</span>
                    </div>
                  </div>
                  <div v-if="isContrast" class="table-col-box">
                    <div v-for="(item, index) in scrapThanList.yhzjList" :key="index">
                      <span v-if="item.value2 === null || item.value2 === ''">-</span>
                      <span v-if="item.value2 !== null && item.value2 !== ''">{{ item.value2 }}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageHeaderLayout>
</template>

<script src="./contrast.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .table-container .table-box{
    border-left: 1px solid #b2dfdf;
    margin-bottom: 25px;
    overflow: auto;
  }
  .table-container .table-col-box{
    float: left;
  }
  .table-container .table-col-box>div:first-child{
    border-top: 1px solid #b2dfdf;
  }
  .table-container .table-col-box>div{
    border-right: 1px solid #b2dfdf;
    border-bottom: 1px solid #b2dfdf;
    height: 42px;
    line-height: 42px;
    width: 350px;
    text-align: center;
  }
  .not-contrast .table-container .table-col-box>div{
    width: 525px;
  }
  .table-col-title{
    background: #eff7f7;
    font-weight: bold;
    color: #666;
  }
  .table-title{
    font-size: 16px;
    font-weight: bold;
    color: #666;
    margin-bottom: 10px;
    width: 1050px;
  }
  .table-title:before{
    content: '';
    display: inline-block;
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-left: 8px solid #009494;
    border-bottom: 6px solid transparent;
    margin-right: 10px;
  }
  .has-btm-border{
    border-bottom: 1px solid #e2e2e2;
    padding-bottom: 10px;
    margin-bottom: 16px;
  }
  .table-sub-title{
    font-size: 16px;
    font-weight: normal;
    margin-left: 18px;
  }
  .table-sub-title.table-title:before{
    display: none;
  }
  .has-sub-table-container .table-container .table-box{
    margin-bottom: 20px;
  }
  .nav-line{
    height: 400px;
    border-right: 1px solid #ccc;
    position: absolute;
    right: 10px;
    top: -14px;
  }
  .top-circle{
    width: 16px;
    height: 16px;
    border-radius: 50%;
    position: absolute;
    border: 1px solid #ccc;
    line-height: 18px;
    right: -8px;
    top: -16px
  }
  .botm-circle{
    width: 16px;
    height: 16px;
    border-radius: 50%;
    position: absolute;
    border: 1px solid #ccc;
    line-height: 18px;
    right: -8px;
    bottom: -16px
  }
  .title-text{
    vertical-align: middle;
  }
  .is-active .title-text{
    color: #009494;
    font-weight: bold;
  }
  .circle{
    width: 15px;
    height: 15px;
    border: 2px solid #fff;
    background: #ccc;
    display: inline-block;
    border-radius: 50%;
    margin-left: 20px;
    vertical-align: middle;
  }
  .is-active .circle{
    background: #009494;
    height: 18px;
    width: 18px;
    margin-right: -1px;
    margin-left: 18px;
    transition: all .2s;
  }
  .nav-title{
    height: 45px;
    line-height: 42px;
    width: 212px;
    text-align: right;
    font-size: 15px;
    cursor: pointer;
  }
  .order-text{
    font-size: 16px;
    font-weight: bold;
    color: #009494;
    margin-left: 106px;
    float: left;
    position: relative;
  }
  .order-text.left{
    margin-left: 655px;
  }
  .not-contrast-title.order-text.left{
    margin-left: 938px;
  }
  .order-line{
    position: absolute;
    height: 20px;
    border-right: 2px dotted #009494;
    top: 35px;
    right: 130px;
    z-index: 1;
  }
  .order-triangle{
    position: absolute;
    width: 0;
    height: 0;
    border-top: 9px solid #009494;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    top: 54px;
    right: 124px;
  }
  .order-triangle-in{
    position: absolute;
    width: 0;
    height: 0;
    border-top: 9px solid #fff;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    top: -12px;
    left: -7px;
    z-index: 0;
  }
  .contrast-title-bar{
    height: 48px;
    margin-top: 2px;
    background: #f0f9f9;
    padding-top: 15px;
  }
  .font-bold{
    font-weight: bold;
    color: #009494;
    margin-right: 30px;
  }
  .contrast-content{
    padding: 0;
  }
  .contrast-container{
    margin-top: 35px;
    height: calc(100vh - 309px);
  }
  .contrast-container-left{
    float: left;
    width: 215px;
    height: 100%;
    position: relative;
  }
  .contrast-container-left-postion{
    position: absolute;
    top: -15px;
    left: 0;
    width: 100%;
  }
  .contrast-container-right{
    margin-left: 255px;
    height: 100%;
    overflow: auto;
  }
  .tabs-header{
    padding: 15px;
  }
  .tabs-header .title{
    color: #009494;
    font-weight: bold;
    display: inline-block;
    padding: 1px 0;
    padding-right: 15px;
    border-right: 1px solid #e2e2e2;
    margin-right: 15px;
  }
</style>
