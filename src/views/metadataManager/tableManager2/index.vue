<template>
  <PageHeaderLayout >
    <HeaderSearchAdd :has-add-btn="false" placeholder-text = "请输入原始表名" @handleSearch="handleSearch"/>
    <div class="app-container table-manager-container">
      <div v-for="(item, index) in tables" :key="index" class="table-item" @click="viewDetail(item)">
        <svg-icon icon-class="dataTable" class="icon"/>
        <!--<svg-icon style="color: red" icon-class="dataTableDft" class="icon default"/>-->
        <div class="table-name">{{ item.cname }}</div>
      </div>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="detailVisible"
      :before-close="handleClose"
      :title="tableName"
      class="fieldDialog"
      width="700px">
      <el-table
        :data="fieldList"
        border
        fit
        stripe
        max-height="380"
        highlight-current-row>
        <el-table-column align="center" label="序号" width="95">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="字段名" align="center" prop="cnname"/>
        <el-table-column label="字段类型" align="center" prop="fieldType" />
        <el-table-column label="长度" align="center" prop="fieldLength"/>
      </el-table>
    </el-dialog>
  </PageHeaderLayout>
</template>
<script src="./tableManager.js"></script>
<style scoped>
  .fieldDialog>>>.el-dialog__body {
    padding: 15px;
  }
  .table-manager-container{
    /*height: calc(100vh - 127px);*/
    padding: 7.5px;
  }
  .table-item{
    float: left;
    width: 123.6px;
    height: 123px;
    padding: 10px;
    border:1px solid #7392a8;
    border-radius: 10px;
    margin: 7.5px;
    text-align: center;
    cursor: pointer;
  }
  .table-item .icon{
    font-size: 60px;
    margin-bottom: 15px;
    color: #7392a8;
  }
  .table-name{
    text-align: center;
  }
  .table-item:hover{
    border:1px solid #009494;
    box-shadow: #009494 0px 0px 12px inset;
    transition: all .1s;
    color: #009494;
  }
  .table-item:hover .icon{
    color: #00baba;
    transition: all .3s;
  }
</style>
