<template>
  <PageHeaderLayout >
    <HeaderSearchAdd placeholder-text = "请输入被委托人" @handleSearch="handleSearch" @handleAdd="handleAdd"/>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="95">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="被委托人" align="center" prop="mandataryName"/>
        <el-table-column label="委托人" align="center" prop="consignorName"/>
        <el-table-column label="开始时间" align="center" prop="startTime"/>
        <el-table-column label="结束时间" align="center" prop="endTime"/>
        <el-table-column label="委托流程" align="center" prop="processName"/>
        <el-table-column label="状态" align="center" prop="state"/>
        <el-table-column label="操作" align="center" max-width="550px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)">删除</el-button>
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
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="addDialogVisible"
      title="添加"
      width="400px"
      @close="handleClose('deleagteForm')">
      <el-form ref="deleagteForm" :model="deleagteForm" :rules="rules" status-icon label-width="100px" label-position="left">
        <el-form-item label="被委托人" prop="person">
          <el-select v-model="deleagteForm.person" placeholder="请选择委托人" style="width: 260px">
            <el-option
              v-for="item in userOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" prop="beginDate">
          <el-date-picker
            v-model="deleagteForm.beginDate"
            :picker-options="pickerOptionsStart"
            :editable="false"
            style="width: 260px"
            type="date"
            placeholder="选择开始日期"
            value-format="timestamp"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endDate">
          <el-date-picker
            v-model="deleagteForm.endDate"
            :picker-options="pickerOptionsEnd"
            :editable="false"
            style="width: 260px"
            type="date"
            placeholder="选择结束日期"
            value-format="timestamp"
          />
        </el-form-item>
        <el-form-item label="委托流程" prop="flow">
          <el-select v-model="deleagteForm.flow" placeholder="请选择委托流程" style="width: 260px">
            <el-option
              v-for="item in procesOptions"
              :key="item.id"
              :label="item.name + ' [' + item.version + ']'"
              :value="item.id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('deleagteForm')">确 定</el-button>
        <el-button @click="resetForm('deleagteForm')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="编辑"
      width="400px"
      @close="handleClose('deleagteForm')">
      <el-form ref="deleagteForm" :model="deleagteForm" :rules="rules" status-icon label-width="100px" label-position="left">
        <el-form-item label="委托人" prop="person">
          <el-select v-model="deleagteForm.person" placeholder="请选择委托人" style="width: 260px">
            <el-option
              v-for="item in userOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" prop="beginDate">
          <el-date-picker
            v-model="deleagteForm.beginDate"
            :picker-options="pickerOptionsStart"
            :editable="false"
            style="width: 260px"
            type="date"
            placeholder="选择开始日期"
            value-format="timestamp"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endDate">
          <el-date-picker
            v-model="deleagteForm.endDate"
            :picker-options="pickerOptionsEnd"
            :editable="false"
            style="width: 260px"
            type="date"
            placeholder="选择结束日期"
            value-format="timestamp"
          />
        </el-form-item>
        <el-form-item label="委托流程" prop="flow">
          <el-select v-model="deleagteForm.flow" placeholder="请选择委托人" style="width: 260px">
            <el-option
              v-for="item in procesOptions"
              :key="item.id"
              :label="item.name + ' [' + item.version + ']'"
              :value="item.id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEditForm('deleagteForm')">确 定</el-button>
        <el-button @click="resetForm('deleagteForm')">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./delegationRules.js"></script>

<style scoped>
</style>
