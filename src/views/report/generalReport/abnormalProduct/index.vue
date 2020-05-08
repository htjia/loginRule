<template>
  <PageHeaderLayout :has_back="true">
    <div class="module-container" style="margin-bottom: 0">
      <div class="module-title">
        <div class="module-title-text">产品列表</div>
      </div>
      <div class="module-content trend-content">
        <div id="tableTop" style="margin-bottom: 15px"/>
        <el-select v-model="productId" filterable clearable placeholder="请选择产品" size="medium" style="width: 260px;">
          <el-option
            v-for="item in productOptions"
            :key="item.name"
            :label="item.name"
            :value="item.id"/>
        </el-select>
        <el-button style="margin-bottom: 15px" type="primary" icon="el-icon-search" size="medium" @click="searchBtn">搜索</el-button>
        <div style="float: right;margin-top: 12px">
          <!--时间范围：<span v-text="beginAndEndTime">2.18.11.15</span>-->
          时间范围：<span v-text="formatDate(beginDate)">2.18.11.15</span> 至 <span v-text="formatDate(endDate)">2.18.11.15</span>
        </div>
        <el-table
          v-loading="listLoading"
          :data="list"
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
          <el-table-column label="产品名称" align="center" prop="name"/>
          <el-table-column label="报废率" align="center" prop="bfrate">
            <template slot-scope="scope">
              {{ scope.row.bfrate }} %
            </template>
          </el-table-column>
          <el-table-column v-if="process === 0" label="压铸报废率" align="center" prop="yzrate">
            <template slot-scope="scope">
              {{ scope.row.yzrate }} %
            </template>
          </el-table-column>
          <el-table-column v-if="process === 1" label="机加工报废率" align="center" prop="jjrate">
            <template slot-scope="scope">
              {{ scope.row.jjrate }} %
            </template>
          </el-table-column>
          <el-table-column v-if="process === 2" label="氧化终检报废率" align="center" prop="yhrate">
            <template slot-scope="scope">
              {{ scope.row.yhrate }} %
            </template>
          </el-table-column>
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
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="porductScrapVisible"
      class="detailDialog"
      title="产品报废详情"
      width="1300px">
      <div style="text-align: center;font-size: 16px">
        <span style="color: #009494;font-weight: bold;" v-text="productName">0001后视镜/8732-01</span>
        <div class="step-container">
          <div style="padding-right: 5px">
            <div class="circle green">
              <div class="backgrd green"/>
            </div>
            <div class="setp-line"/>
            <div class="scrap-form-title">压铸</div>
            <div>报废率：<span v-text="yzrate">8.9%</span> %</div>
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
            <div>报废率：<span v-text="jjrate">8.9%</span> %</div>
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
            <div>报废率：<span v-text="yhrate">8.9%</span> %</div>
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
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./abnormalProduct.js"></script>

<style scoped>
  .trend-content{
    height: calc(100vh - 169px);
    overflow: auto;
    padding-top: 0;
  }
  .detailDialog>>>.el-dialog__body {
    padding: 15px;
    color: #606266;
    font-size: 50px;
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
    border-top: 100px solid transparent;
    border-left: 180px solid #e1e1e1;
    border-bottom: 100px solid transparent;
    position: absolute;
    transform: rotate(-34deg);
    z-index: 1;
    top: 46px;
    left: 50px;
  }
  .scrap-form-title{
    margin: 10px 0 5px 0;
  }
</style>
