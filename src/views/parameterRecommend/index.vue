<template>
  <PageHeaderLayout v-loading="isLoading" element-loading-text="拼命加载中">
    <div v-if="!isStart" class="start-container">
      <img class="start-bg-img" src="../../../static/img/search-03.jpg">
      <div class="start-center-ctn">
        <img class="start-img" src="../../../static/img/search-logo.png">
        <div class="select-box params-recommend">
          <el-form ref="productModelForm" :model="productModelForm" :rules="rules" class="demo-ruleForm">
            <el-form-item
              prop="eqptType">
              <el-select v-model="productModelForm.eqptType" filterable clearable placeholder="请选择设备型号">
                <el-option
                  v-for="item in equipmentOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
            <el-form-item
              prop="productType">
              <el-select v-model="productModelForm.productType" filterable clearable placeholder="请选择产品型号">
                <el-option
                  v-for="item in productOptions"
                  :key="item.materialId"
                  :label="item.materialType"
                  :value="item.materialId"/>
              </el-select>
            </el-form-item>
            <el-form-item
              prop="mouldType">
              <el-select v-model="productModelForm.mouldType" :disabled="disabledSelect" filterable clearable placeholder="请选择模具型号">
                <el-option
                  v-for="item in mouldOptions"
                  :key="item.mouldId"
                  :label="item.mouldCode"
                  :value="item.mouldId"/>
              </el-select>
            </el-form-item>
            <el-form-item
              prop="materialsType">
              <el-select v-model="productModelForm.materialsType" :disabled="disabledSelect" filterable clearable placeholder="请选择材料">
                <el-option
                  v-for="item in materialsOptions"
                  :key="item.rawId"
                  :label="item.rawName"
                  :value="item.rawId"/>
              </el-select>
            </el-form-item>
            <el-form-item align="center" style="width: 100%;margin-left: -7px;">
              <el-button type="primary" icon="el-icon-search" style="width: 110px" @click="submitForm('productModelForm')">搜索</el-button>
              <el-button class="cancelBtn" @click="clearSearchOut"><svg-icon icon-class="clear"/> 清除</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div v-if="isStart" class="parameter-table">
      <div class="params-recommend search-ctn">
        <el-form ref="productModelFormIn" :model="productModelForm" :rules="rules" class="demo-ruleForm">
          <el-form-item
            prop="eqptType">
            <el-select v-model="productModelForm.eqptType" filterable placeholder="请选择设备型号" size="medium">
              <el-option
                v-for="item in equipmentOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item
            prop="productType">
            <el-select v-model="productModelForm.productType" filterable placeholder="请选择产品型号" size="medium">
              <el-option
                v-for="item in productOptions"
                :key="item.materialId"
                :label="item.materialType"
                :value="item.materialId"/>
            </el-select>
          </el-form-item>
          <el-form-item
            prop="mouldType">
            <el-select v-model="productModelForm.mouldType" :disabled="disabledSelect" filterable placeholder="请选择模具型号" size="medium">
              <el-option
                v-for="item in mouldOptions"
                :key="item.mouldId"
                :label="item.mouldCode"
                :value="item.mouldId"/>
            </el-select>
          </el-form-item>
          <el-form-item
            prop="materialsType">
            <el-select v-model="productModelForm.materialsType" :disabled="disabledSelect" filterable placeholder="请选择材料" size="medium">
              <el-option
                v-for="item in materialsOptions"
                :key="item.rawId"
                :label="item.rawName"
                :value="item.rawId"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="medium" style="margin-left: 2px" @click="submitForm('productModelFormIn')">搜索</el-button>
            <el-button size="medium" style="margin-left: 7px" @click="clearSearchIn"><svg-icon icon-class="clear"/> 清除</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="module-container">
        <div class="module-title">
          <div class="module-title-text">基本信息</div>
        </div>
        <div class="module-content">
          <el-table
            v-loading="listLoading"
            :data="infoList"
            element-loading-text="拼命加载中"
            border
            fit
            stripe>
            <el-table-column align="center" label="产品" prop="productName"/>
            <el-table-column label="模具型号" align="center" prop="mouldCode"/>
            <el-table-column label="压铸机" align="center" prop="eqptCode"/>
            <el-table-column label="压铸机型号" align="center" prop="modelId"/>
            <el-table-column label="压铸机吨位" align="center" prop="power"/>
            <el-table-column label="原材料" align="center" prop="rawName"/>
          </el-table>
        </div>
      </div>
      <div class="module-container">
        <div class="module-title">
          <div class="module-title-text">设定参数推荐</div>
        </div>
        <div class="module-content">
          <!--东洋-->
          <el-table
            v-loading="listLoading"
            v-show="eqptBrand === '1'"
            :data="yLists"
            class="parameter"
            element-loading-text="拼命加载中"
            border
            fit>
            <el-table-column align="center" label="参数" width="95">
              <template slot-scope="scope">
                {{ scope.row.va }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DYrenderHeader1" align="center">
              <template slot-scope="scope">
                {{ scope.row.v1 }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DYrenderHeader2" align="center">
              <template slot-scope="scope">
                {{ scope.row.v2 }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DYrenderHeader3" align="center">
              <template slot-scope="scope">
                {{ scope.row.v3 }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DYrenderHeader4" align="center">
              <template slot-scope="scope">
                {{ scope.row.v4 }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DYrenderHeader5" align="center">
              <template slot-scope="scope">
                {{ scope.row.v5 }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DYrenderHeader6" align="center">
              <template slot-scope="scope">
                {{ scope.row.v6 }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DYrenderHeader7" align="center">
              <template slot-scope="scope">
                {{ scope.row.v7 }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DYrenderHeader8" align="center">
              <template slot-scope="scope">
                {{ scope.row.v8 }}
              </template>
            </el-table-column>
          </el-table>
          <!--东芝S系-->
          <el-table
            v-loading="listLoading"
            v-show="eqptBrand === '3'"
            :data="zsLists"
            class="parameter"
            element-loading-text="拼命加载中"
            border
            fit>
            <el-table-column align="center" label="参数" width="95">
              <template slot-scope="scope">
                {{ scope.row.va }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DZrenderHeader1" align="center">
              <template slot-scope="scope">
                {{ scope.row.v1 }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DZrenderHeader2" align="center">
              <template slot-scope="scope">
                {{ scope.row.v2 }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DZrenderHeader3" align="center">
              <template slot-scope="scope">
                {{ scope.row.v3 }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DZrenderHeader4" align="center">
              <template slot-scope="scope">
                {{ scope.row.v4 }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DZrenderHeader5" align="center">
              <template slot-scope="scope">
                {{ scope.row.v5 }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DZrenderHeader6" align="center">
              <template slot-scope="scope">
                {{ scope.row.v6 }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DZrenderHeader7" align="center">
              <template slot-scope="scope">
                {{ scope.row.v7 }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DZrenderHeader8" align="center">
              <template slot-scope="scope">
                {{ scope.row.v8 }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DZrenderHeader9" align="center">
              <template slot-scope="scope">
                {{ scope.row.v9 }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DZrenderHeader10" align="center">
              <template slot-scope="scope">
                {{ scope.row.v10 }}
              </template>
            </el-table-column>
          </el-table>
          <!--东芝非S系-->
          <el-table
            v-loading="listLoading"
            v-show="eqptBrand === '2'"
            :data="zLists"
            class="parameter"
            element-loading-text="拼命加载中"
            border
            fit>
            <el-table-column align="center" label="参数" width="95">
              <template slot-scope="scope">
                {{ scope.row.va }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DZHrenderHeader1" align="center">
              <template slot-scope="scope">
                {{ scope.row.v1 }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DZHrenderHeader2" align="center">
              <template slot-scope="scope">
                {{ scope.row.v2 }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DZHrenderHeader3" align="center">
              <template slot-scope="scope">
                {{ scope.row.v3 }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DZrenderHeader4" align="center">
              <template slot-scope="scope">
                {{ scope.row.v4 }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DZrenderHeader5" align="center">
              <template slot-scope="scope">
                {{ scope.row.v5 }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DZrenderHeader6" align="center">
              <template slot-scope="scope">
                {{ scope.row.v6 }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DZrenderHeader7" align="center">
              <template slot-scope="scope">
                {{ scope.row.v7 }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DZrenderHeader8" align="center">
              <template slot-scope="scope">
                {{ scope.row.v8 }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DZrenderHeader9" align="center">
              <template slot-scope="scope">
                {{ scope.row.v9 }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DZrenderHeader10" align="center">
              <template slot-scope="scope">
                {{ scope.row.v10 }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="module-container">
        <div class="module-title">
          <div class="module-title-text">监控参数推荐</div>
        </div>
        <div class="module-content">
          <!--东洋-->
          <el-table
            v-loading="listLoading"
            v-show="eqptBrand === '1'"
            :data="jkdyLists"
            class="parameter"
            element-loading-text="拼命加载中"
            border
            fit>
            <el-table-column align="center" label="参数" width="95">
              <template slot-scope="scope">
                {{ scope.row.va }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DYmonitorHeader1" align="center">
              <template slot-scope="scope">
                {{ scope.row.v1 }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DYmonitorHeader2" align="center">
              <template slot-scope="scope">
                {{ scope.row.v2 }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DYmonitorHeader3" align="center">
              <template slot-scope="scope">
                {{ scope.row.v3 }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DYmonitorHeader4" align="center">
              <template slot-scope="scope">
                {{ scope.row.v4 }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DYmonitorHeader5" align="center">
              <template slot-scope="scope">
                {{ scope.row.v5 }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DYmonitorHeader6" align="center">
              <template slot-scope="scope">
                {{ scope.row.v6 }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DYmonitorHeader7" align="center">
              <template slot-scope="scope">
                {{ scope.row.v7 }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DYmonitorHeader8" align="center">
              <template slot-scope="scope">
                {{ scope.row.v8 }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DYmonitorHeader9" align="center">
              <template slot-scope="scope">
                {{ scope.row.v9 }}
              </template>
            </el-table-column>
          </el-table>
          <!--东芝-->
          <el-table
            v-loading="listLoading"
            v-show="eqptBrand !== '1'"
            :data="jkLists"
            class="parameter"
            element-loading-text="拼命加载中"
            border
            fit>
            <el-table-column align="center" label="参数" width="95">
              <template slot-scope="scope">
                {{ scope.row.va }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DZmonitorHeader1" align="center">
              <template slot-scope="scope">
                {{ scope.row.v1 }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DZmonitorHeader2" align="center">
              <template slot-scope="scope">
                {{ scope.row.v2 }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DZmonitorHeader3" align="center">
              <template slot-scope="scope">
                {{ scope.row.v3 }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DZmonitorHeader4" align="center">
              <template slot-scope="scope">
                {{ scope.row.v4 }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DZmonitorHeader5" align="center">
              <template slot-scope="scope">
                {{ scope.row.v5 }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DZmonitorHeader6" align="center">
              <template slot-scope="scope">
                {{ scope.row.v6 }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DZmonitorHeader7" align="center">
              <template slot-scope="scope">
                {{ scope.row.v7 }}
              </template>
            </el-table-column>
            <el-table-column :render-header="DZmonitorHeader8" align="center">
              <template slot-scope="scope">
                {{ scope.row.v8 }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="module-container result">
        <div class="module-title">
          <div class="module-title-text">
            预测报废率
            <el-tooltip placement="right">
              <div slot="content">1.展示工艺报废率预测阈值<br>2.无预测阈值则显示 "--", 属于正常现象</div>
              <svg-icon class="hint" icon-class="hint"/>
            </el-tooltip>
          </div>
        </div>
        <div class="module-content">
          <div class="result-left">
            <div>
              <span class="default-text" style="font-weight:bold">若加工</span>产品（<span v-text="infoList[0].productName">0001后视镜/8732-01</span>），
            </div>
            <div>
              <span class="default-text" style="font-weight:bold">使用</span>
              模具 （<span v-text="infoList[0].mouldCode">26-0399-32</span>），设备（<span v-text="infoList[0].eqptCode">IKD-3/YZ-48</span>），原材料（<span v-text="infoList[0].rawName">ABCD</span>）
            </div>
          </div>
          <div class="result-center">
            <el-progress :stroke-width="15" :percentage="rateValue" type="circle" status="success" color="#009494" width="230">报废率15.99</el-progress>
            <div class="result-center-text" style="width:150px">
              <div style="font-weight:bold;font-size:16px">预测</div>
              <div style="font-weight:bold;font-size:16px">报废率≤
                <span v-if="rateValue !== null"><span v-text="rateValue"/> %</span>
                <span v-if="rateValue === null">--</span>
              </div>
            </div>
          </div>
          <div class="result-right">
            <div class="default-text" style="font-weight:bold">根据以上推荐参数进行设定和监控</div>
            <div style="color:#e25d5d">预测报废率≤
              <span v-if="rateValue !== null"><span v-text="rateValue"/> %</span>
              <span v-if="rateValue === null">--</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageHeaderLayout>
</template>
<style scoped>
  .hint{
    font-size: 18px;
    vertical-align: middle;
  }
  .params-recommend>>>.el-form-item{
    float: left;
    margin-right:  10px;
  }
  .parameter-table>>>.el-table .cell p{
    height: 10px;
    line-height: 10px;
  }
  .parameter-table>>>.el-progress.is-success .el-progress__text{
    display: none;
  }
  .select-box{
    width: 845px;
    margin: 0 auto;
  }
  .result{
    overflow: hidden;
  }
  .result .module-content{
    padding: 30px 0;
  }
  .result-left{
    float: left;
    color: #009494;
    font-size: 16px;
    font-weight: bold;
    padding: 50px;
    line-height: 40px;
  }
  .default-text{
    color: #444;
    font-size: 16px;
    font-weight: normal;
  }
  .result-center{
    float: left;
    position: relative;
  }
  .result-center-text{
    position: absolute;
    color: #e25d5d;
    text-align: center;
    top: 50%;
    left: 50%;
    line-height: 30px;
    transform: translate(-50%,-50%);
  }
  .result-right{
    float: left;
    color: #009494;
    font-size: 22px;
    font-weight: bold;
    padding: 30px 0 0 50px;
    line-height: 50px;
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
  .search-ctn{
    background: #fff;
    margin-bottom: 10px;
    padding: 12px 15px;
    overflow: hidden;
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
</style>
<script src="./parameterRecommend.js"></script>

