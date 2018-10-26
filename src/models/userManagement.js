import { getUserManagement } from '../services/api';
import { getRoleList } from '../services/api';
import { getDeptList } from '../services/api';
export default {
  namespace: 'userManagement',//命名空间
  state: {},
  effects: {
    *fetch({ payload }, { call, put }) {
      const data = yield call(getUserManagement, payload)
      yield put({ type: 'fetchOk', payload: data })
    },
  },//发起一个fetch请求
  reducers: {
    fetchOk(state, { payload }) {
      return { ...state, ...payload }
    },
  }//成功的话返回结果
}