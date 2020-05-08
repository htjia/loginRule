<template>
  <PageHeaderLayout v-loading="isLoading" element-loading-text="拼命加载中">
    <div v-if="!isStart" class="start-container">
      <img class="start-bg-img" src="../../../static/img/search-04.jpg">
      <div class="start-center-ctn">
        <img class="start-img" src="../../../static/img/search-logo.png">
        <div class="select-box">
          <el-form ref="productModelFormOut" :inline="true" :model="productModelForm" :rules="rules" label-width="0" class="demo-ruleForm">
            <el-form-item
              prop="beginDate">
              <el-date-picker
                v-model="productModelForm.beginDate"
                :picker-options="pickerOptionsStart"
                :editable="false"
                style="width:145px"
                type="date"
                placeholder="选择开始日期"
                value-format="timestamp"
              />
            </el-form-item>
            <el-form-item
              prop="endDate">
              <el-date-picker
                v-model="productModelForm.endDate"
                :picker-options="pickerOptionsEnd"
                :editable="false"
                style="width:145px"
                type="date"
                placeholder="选择结束日期"
                value-format="timestamp"
              />
            </el-form-item>
            <el-form-item
              prop="unitType">
              <el-select v-model="productModelForm.unitType" multiple collapse-tags filterable placeholder="请选择设备型号" style="width: 330px;" @change="eqptChangeSelect">
                <el-option
                  v-for="item in equipmentOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
            <el-form-item
              prop="productModel">
              <el-select v-el-select-loadmore="loadmore" :filter-method="productSearch" v-model="productModelForm.productModel" multiple collapse-tags filterable placeholder="请选择产品型号" style="width: 380px;" @change="productChangeSelect">
                <el-option
                  v-for="item in productOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
            <el-form-item
              prop="patternType">
              <el-select v-model="productModelForm.patternType" :disabled="disabledSelect" placeholder="请选择模具型号" multiple collapse-tags filterable style="width: 240px;" @change="modelChangeSelect">
                <el-option
                  v-for="item in moduleOptions"
                  :key="item.code"
                  :label="item.code"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
            <el-form-item style="margin-left: 50%;transform: translateX(-50%)">
              <el-button type="primary" icon="el-icon-search" style="width: 110px" @click="submitForm('productModelFormOut')">搜索</el-button>
              <el-button class="cancelBtn" @click="clearSearchOut"><svg-icon icon-class="clear"/> 清除</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div v-if="isStart" class="parameter-table">
      <div ref="searchCtn" class=" search-ctn">
        <el-form ref="productModelFormIn" :inline="true" :model="productModelForm" :rules="rules" label-width="0" class="demo-ruleForm">
          <el-form-item
            prop="beginDate">
            <el-date-picker
              v-model="productModelForm.beginDate"
              :picker-options="pickerOptionsStart"
              :editable="false"
              size="small"
              style="width:145px"
              type="date"
              placeholder="选择开始日期"
              value-format="timestamp"
            />
          </el-form-item>
          <el-form-item
            prop="endDate">
            <el-date-picker
              v-model="productModelForm.endDate"
              :picker-options="pickerOptionsEnd"
              :editable="false"
              size="small"
              style="width:145px"
              type="date"
              placeholder="选择结束日期"
              value-format="timestamp"
            />
          </el-form-item>
          <el-form-item
            prop="unitType">
            <el-select v-model="productModelForm.unitType" multiple collapse-tags filterable placeholder="请选择设备型号" size="medium" style="width: 240px;" @change="eqptChangeSelect">
              <el-option
                v-for="item in equipmentOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item
            prop="productModel">
            <el-select v-model="productModelForm.productModel" multiple collapse-tags filterable placeholder="请选择产品型号" size="medium" style="width: 380px;" @change="productChangeSelect">
              <el-option
                v-for="item in productOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item
            prop="patternType">
            <el-select v-model="productModelForm.patternType" :disabled="disabledSelect" placeholder="请选择模具型号" size="medium" multiple collapse-tags filterable style="width: 240px;" @change="modelChangeSelect">
              <el-option
                v-for="item in moduleOptions"
                :key="item.code"
                :label="item.code"
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="medium" @click="submitForm('productModelFormIn')">搜索</el-button>
            <el-button size="medium" type="primary" @click="clearSearchIn"><svg-icon icon-class="clear"/> 清除</el-button>
            <el-button type="primary" icon="el-icon-setting" size="medium" @click="settingOeeValue">设置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div ref="oeeContainer" class="app-container" style="padding-top: 0">
        <div id="tableTop" style="margin-bottom: 15px"/>
        <el-radio-group :disabled="isDisabled" v-model="groups" style="margin-bottom: 12px" @change="groupsChange">
          <el-radio label="2">按产品分组</el-radio>
          <el-radio label="1">按设备分组</el-radio>
          <el-radio label="0">按时间分组</el-radio>
        </el-radio-group>
        <el-table
          v-loading="listLoading"
          v-if="groups === '0'"
          :data="list"
          :span-method="objectSpanMethod"
          element-loading-text="拼命加载中"
          border
          fit
          highlight-current-row
        >
          <el-table-column :key="Math.random()" label="时间" align="center" prop="dataTime"/>
          <el-table-column :key="Math.random()" label="设备" align="center" prop="eqptName"/>
          <el-table-column :key="Math.random()" label="产品" align="center" prop="materialName" show-overflow-tooltip width="260px"/>
          <el-table-column :key="Math.random()" label="模具" align="center" prop="mouldWmsCode"/>
          <el-table-column :key="Math.random()" label="产量" align="center" prop="daNum"/>
          <el-table-column :key="Math.random()" label="报废率" align="center" prop="beatRate">
            <template slot-scope="scope">
              {{ scope.row.beatRate }}%
            </template>
          </el-table-column>
          <el-table-column :key="Math.random()" label="OEE" align="center" prop="oeeRate">
            <template slot-scope="scope">
              <div :class="scope.row.oeeRate < oeeForm.oee ? 'warning':'default'">
                <el-tooltip placement="top">
                  <div slot="content">阈值：{{ oeeForm.oee }} %</div>
                  <div v-if="scope.row.oeeRate !== null">{{ scope.row.oeeRate }} %</div>
                </el-tooltip>
                <span v-if="scope.row.oeeRate === null">--</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          v-loading="listLoading"
          v-if="groups === '1'"
          :data="list"
          :span-method="objectSpanMethod"
          element-loading-text="拼命加载中"
          border
          fit
        >
          <el-table-column :key="Math.random()" label="设备" align="center" prop="eqptName"/>
          <el-table-column :key="Math.random()" label="产品" align="center" prop="materialName" show-overflow-tooltip width="260px"/>
          <el-table-column :key="Math.random()" label="模具" align="center" prop="mouldWmsCode"/>
          <el-table-column :key="Math.random()" label="起止时间" align="center" prop="dataTime" width="220px">
            <template slot-scope="scope">
              <el-tooltip placement="top">
                <div slot="content">点击查看详情数据</div>
                <div style="color: #009494;cursor: pointer;" @click="handleViewDetailClick(scope.row)" v-text="scope.row.dataTime"/>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column :key="Math.random()" label="产量" align="center" prop="daNum"/>
          <el-table-column :key="Math.random()" label="报废率" align="center" prop="beatRate">
            <template slot-scope="scope">
              {{ scope.row.beatRate }}%
            </template>
          </el-table-column>
          <el-table-column :key="Math.random()" label="OEE" align="center" prop="oeeRate">
            <template slot-scope="scope">
              <div :class="scope.row.oeeRate < oeeForm.oee ? 'warning':'default'">
                <el-tooltip placement="top">
                  <div slot="content">阈值：{{ oeeForm.oee }} %</div>
                  <div v-if="scope.row.oeeRate !== null">{{ scope.row.oeeRate }} %</div>
                </el-tooltip>
                <span v-if="scope.row.oeeRate === null">--</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          v-loading="listLoading"
          v-if="groups === '2'"
          :data="list"
          :span-method="objectSpanMethod"
          element-loading-text="拼命加载中"
          border
          fit
        >
          <el-table-column :key="Math.random()" label="产品" align="center" prop="materialName" show-overflow-tooltip width="260px"/>
          <el-table-column :key="Math.random()" label="模具" align="center" prop="mouldWmsCode"/>
          <el-table-column :key="Math.random()" label="设备" align="center" prop="eqptName"/>
          <el-table-column :key="Math.random()" label="起止时间" align="center" prop="dataTime" width="220px">
            <template slot-scope="scope">
              <el-tooltip placement="right">
                <div slot="content">点击查看详情数据</div>
                <div style="color: #009494;cursor: pointer;" @click="handleViewDetailClick(scope.row)" v-text="scope.row.dataTime"/>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column :key="Math.random()" label="产量" align="center" prop="daNum"/>
          <el-table-column :key="Math.random()" label="报废率" align="center" prop="beatRate">
            <template slot-scope="scope">
              {{ scope.row.beatRate }}%
            </template>
          </el-table-column>
          <el-table-column :key="Math.random()" label="OEE" align="center" prop="oeeRate">
            <template slot-scope="scope">
              <div :class="scope.row.oeeRate < oeeForm.oee ? 'warning':'default'">
                <el-tooltip placement="top">
                  <div slot="content">阈值：{{ oeeForm.oee }} %</div>
                  <div v-if="scope.row.oeeRate !== null">{{ scope.row.oeeRate }} %</div>
                </el-tooltip>
                <span v-if="scope.row.oeeRate === null">--</span>
              </div>
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
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="addOeeVisible"
      title="设置OEE阈值"
      width="400px"
      @close="handleClose('oeeForm')"
    >
      <el-form ref="oeeForm" :model="oeeForm" :rules="oeeRules" label-position="left" status-icon label-width="100px">
        <el-form-item label="OEE阈值：" prop="oee" class="oee-form">
          <el-input v-model="oeeForm.oee" style="width: 235px" type="number" min="0"/> &nbsp; %
        </el-form-item>
      </el-form>
      <div style="padding-left: 100px;margin-bottom: 10px;margin-top: -5px;line-height: 160%;font-size: 12px;color: #de525f">说明：<br>此处设置OEE阈值，如果OEE值低于该阈值，<br>则突出显示OEE。</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitOeeForm('oeeForm')">确 定</el-button>
        <el-button @click="cancelSetOee">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="oeeDetailVisible"
      class="oeeDeatilDialog"
      title="日数据详情"
      width="1000px"
    >
      <div class="title-container">
        <span class="modal-title">时间</span>：<span class="title-text" v-text="currentRow.dataTime">2018-11-22 ~ 2018-11-22</span>
        <span class="modal-title">设备</span>：<span class="title-text" v-text="currentRow.eqptName">IKD-3/YZ-48</span>
        <span class="modal-title">产品</span>：<span class="title-text" v-text="currentRow.materialName">455-3/sdfsdsdfsdfsdfYZ-48</span>
        <span class="modal-title">模具</span>：<span class="title-text" v-text="currentRow.mouldWmsCode">fsdfYZ-48</span>
      </div>
      <el-table
        v-loading="listLoading"
        :data="detailList"
        element-loading-text="拼命加载中"
        border
        fit
      >
        <el-table-column label="日期" align="center" prop="shift_date"/>
        <el-table-column label="产量" align="center" prop="da_num"/>
        <el-table-column label="报废率" align="center" prop="oee_rate">
          <template slot-scope="scope">
            {{ scope.row.beat_rate }} %
          </template>
        </el-table-column>
        <el-table-column label="OEE" align="center" prop="beat_rate">
          <template slot-scope="scope">
            <div :class="scope.row.oee_rate < oeeForm.oee ? 'warning':'default'">
              <el-tooltip placement="top">
                <div slot="content">阈值：{{ oeeForm.oee }} %</div>
                <div>{{ scope.row.oee_rate }} %</div>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="detailTotal > 15"
        :total="detailTotal"
        :page-size="15"
        :current-page="modalPageNum"
        style="text-align: right;margin: 15px 0 0"
        layout="prev, pager, next"
        @current-change="modalPageChanges"/>
    </el-dialog>
  </PageHeaderLayout>
</template>
<style scoped>
  .app-container>>> .el-table--enable-row-hover .el-table__body tr:hover>td{
    background-color: transparent !important;
  }
  .oeeDeatilDialog>>> .el-table--enable-row-hover .el-table__body tr:hover>td{
    background-color: transparent !important;
  }
  .warning{
    background: #fbebeb;
    color: #de525f;
  }
  .default{
    color: #1abc9c;
  }
  .oeeDeatilDialog>>>.el-dialog__body {
    padding: 25px 15px 15px 15px;
  }
  .title-container{
    margin-bottom: 15px;
  }
  .modal-title{
    font-weight: bold;
    color: #666666;
  }
  .title-text{
    margin-right: 35px;
  }
  input[type='number']{
    -webkit-appearance: none;
  }
  .parameter-table>>>.el-table .cell p{
    height: 10px;
    line-height: 10px;
  }
  .parameter-table>>>.el-progress.is-success .el-progress__text{
    display: none;
  }
  .select-box{
    width: 1310px;
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
  .default-text{
    color: #444;
    font-size: 16px;
    font-weight: normal;
  }
  .olap-search{
    background: #fff;
    margin-bottom: 10px;
    padding:15px;
    -webkit-box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 5px;
    -moz-box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 5px;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 5px;
  }
  .search-ctn{
    background: #fff;
    margin-bottom: 10px;
    padding: 12px 15px;
    -webkit-box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 5px;
    -moz-box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 5px;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 5px;
  }
  .search-ctn>>>.el-input__inner{
    height: 36px;
  }
  .search-ctn>>>.el-form-item{
    margin-bottom: 0;
  }
  .search-ctn>>>.el-form-item__error{
    position: static;
  }
  .cancelBtn{
    width: 110px;
    height: 40px;
    background: none;
    border:1px solid #009494;
    border-radius: 5px;
    color: #009494;
    margin-left: 15px;
    outline: none;
    cursor: pointer;
  }
  .cancelBtn:hover{
    opacity: 0.7;
  }
  .search-ctn>>>.el-select__tags :first-child.el-select__input,
  .select-box>>>.el-select__tags :first-child.el-select__input {
    width: 260px !important;
  }
</style>
<script src="./olap.js"></script>

