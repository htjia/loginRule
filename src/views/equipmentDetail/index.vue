<template>
  <PageHeaderLayout >
    <div class="module-container">
      <div class="module-title">基本信息</div>
      <div class="module-content">
        产品：电机盖
      </div>
    </div>
    <div class="module-container">
      <div class="module-title">历史工单数据（BD500V5EX-7321电机盖）</div>
      <div class="module-content">
        <el-table
          v-loading="listLoading"
          :data="list"
          element-loading-text="拼命加载中"
          border
          fit
          stripe
          highlight-current-row>
          <el-table-column align="center" label="序号" width="95">
            <template slot-scope="scope">
              {{ scope.$index+1 }}
            </template>
          </el-table-column>
          <el-table-column label="表名" align="center">
            <template slot-scope="scope">
              {{ scope.row.tableName }}
            </template>
          </el-table-column>
          <el-table-column label="上传时间" align="center">
            <template slot-scope="scope">
              {{ scope.row.uploadDate }}
            </template>
          </el-table-column>
          <el-table-column label="上传状态" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.uploadState === 0" type="success" size="small">成功</el-tag>
              <el-tag v-if="scope.row.uploadState === 1" type="danger" size="small">失败</el-tag>
              <el-tag v-if="scope.row.uploadState === 2" type="warning" size="small">未找到文件</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="表名" align="center">
            <template slot-scope="scope">
              {{ scope.row.tableName }}
            </template>
          </el-table-column>
          <el-table-column label="上传时间" align="center">
            <template slot-scope="scope">
              {{ scope.row.uploadDate }}
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
    <div class="module-container">
      <div class="module-title">报废率趋势分析（BD500V5EX-7321电机盖）</div>
      <div class="module-content">
        <chart id="scrappage" ref="scrappage" :options="scrappageOptions" height="200px" width="100%" />
      </div>
    </div>
    <div class="module-container">
      <div class="module-title">异常统计分析（BD500V5EX-7321电机盖）</div>
      <div class="module-content">
        <div class="module-content-left">
          <chart id="abnormal" ref="scrappage" :options="abnormalOptions" height="100%" width="100%" />
        </div>
        <div class="module-content-right">
          <el-table
            v-loading="listLoading"
            :data="lists"
            element-loading-text="拼命加载中"
            border
            fit
            stripe
            highlight-current-row>
            <el-table-column label="异常类型" align="center">
              <template slot-scope="scope">
                {{ scope.row.tableName }}
              </template>
            </el-table-column>
            <el-table-column label="出现次数" align="center">
              <template slot-scope="scope">
                {{ scope.row.uploadDate }}
              </template>
            </el-table-column>
            <el-table-column label="异常占比" align="center">
              <template slot-scope="scope">
                {{ scope.row.uploadDate }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </PageHeaderLayout>
</template>
<script src="./equipmentDetail.js"></script>

