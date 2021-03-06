import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)
const overviewx = {
  state: {
    panelWidget: [
      {fontAwesome: 'fa fa-line-chart fa-3x', value: '0', name: '总分片数', colors: 'panel-pink'},
      {fontAwesome: 'fa fa-check-circle fa-3x', value: '0', name: '正常分片数', colors: 'panel-blue'},
      {fontAwesome: 'fa fa-database fa-3x', value: '0', name: '索引数', colors: 'panel-yellow'},
      {fontAwesome: 'fa fa-list-ul fa-3x', value: '0', name: '模板数', colors: 'panel-teal'},
      {fontAwesome: 'fa fa-file-text fa-3x', value: '0', name: '文档数', colors: 'panel-orange'},
      {fontAwesome: 'fa fa-save fa-3x', value: '0', name: '总大小', colors: 'panel-red'}
    ],
    statsInfo: [
      {name: '集群名称', value: '未知'},
      {name: '时间戳', value: '0'},
      {name: 'ES版本', value: '未知'},
      {name: 'os', value: '未知'},
      {name: 'jvm最大持续时长', value: '0h'},
      {name: 'jvm版本', value: '未知'},
      {name: 'jvm进程', value: '0'}
    ],
    clusterInfo: [
      {name: '状态', value: '未连接'},
      {name: '时间超时?', value: 'false'},
      {name: 'Node数', value: '0'},
      {name: 'Data Node数', value: '0'},
      {name: '活跃分片数', value: '0'},
      {name: '正在初始化分片数', value: '0'},
      {name: 'Unassigned Shards', value: '0'}
    ],
    charts: {
      jvm_mem_max_use: 0,
      vm_mem_used: 0,
      memtotal: 0,
      memfree: 0,
      memused: 0,
      fstotal: 0,
      fsfree: 0,
      fielddata_mem_used: 0,
      query_cache_memory_size: 0,
      cpufree: 100,
      cpuused: 0
    },
    templateInfo: {
      count: 0,
      templateName: [],
      typeCount: []
    },
    tShard: 0,
    sShard: 0,
    indices: 0,
    templates: 0,
    documents: 0,
    size: 0,
    IndexTemplateList: [
      // {
      //   'name': 'skylaraudit',
      //   'type': '【_default_】【skylaraudit-audit_device】【skylaraudit-audit_account】【skylaraudit-audit_software】【skylaraudit-audit_print】【skylaraudit-audit_power】【skylaraudit-audit_safe_udiskx】【skylaraudit-audit_network】【skylaraudit-audit_operation】【skylaraudit-audit_mail】',
      //   'visible': false
      // },
      // {
      //   'name': 'skylartrackfile',
      //   'type': '【skylartrackfile-tools_download】【skylartrackfile-client_imfile】【skylartrackfile-mail】【skylartrackfile-client_udisk】【skylartrackfile-operation】【skylartrackfile-browser_file】【_default_】【skylartrackfile-print】',
      //   'visible': false
      // }
    ]
  },
  mutations: {
    SET_PANEL_TSHARD: (state, data) => {
      state.tShard = data
    },
    SET_PANEL_SSHARD: (state, data) => {
      state.sShard = data
    },
    SET_PANEL_INDICES: (state, data) => {
      state.indices = data
    },
    SET_PANEL_TEMPLATES: (state, data) => {
      state.templates = data
    },
    SET_PANEL_DOCUMENTS: (state, data) => {
      state.documents = data
    },
    SET_PANEL_SIZE: (state, data) => {
      state.size = data
    },
    SET_TEMPLATE_INFO: (state, data) => {
      state.templateInfo = data
    },
    SET_CHARTS: (state, data) => {
      state.charts = data
    },
    SET_INDEX_TEMPLATE_LIST: (state, data) => {
      state.IndexTemplateList = data
    },
    SET_PANEL_WIDGET: (state) => {
      state.panelWidget = [
        {fontAwesome: 'fa fa-line-chart fa-3x', value: state.tShard, name: '总分片数', colors: 'panel-pink'},
        {fontAwesome: 'fa fa-check-circle fa-3x', value: state.sShard, name: '正常分片数', colors: 'panel-blue'},
        {fontAwesome: 'fa fa-database fa-3x', value: state.indices, name: '索引数', colors: 'panel-yellow'},
        {fontAwesome: 'fa fa-list-ul fa-3x', value: state.templates, name: '模板数', colors: 'panel-teal'},
        {fontAwesome: 'fa fa-file-text fa-3x', value: state.documents, name: '文档数', colors: 'panel-orange'},
        {fontAwesome: 'fa fa-save fa-3x', value: state.size, name: '总大小', colors: 'panel-red'}
      ]
    },
    SET_STATS_INFO: (state, data) => {
      state.statsInfo = [
        {name: '集群名称', value: data.clusterName},
        {name: '时间戳', value: data.timestamp},
        {name: 'ES版本', value: data.versions},
        {name: 'os', value: data.systems},
        {name: 'jvm最大持续时长', value: data.uptime},
        {name: 'jvm版本', value: data.jvm_versions},
        {name: 'jvm线程数', value: data.threads}
      ]
    },
    SET_CLUSTER_INFO: (state, data) => {
      state.clusterInfo = [
        {name: '状态', value: data.status},
        {name: '时间超时?', value: data.timed_out},
        {name: 'Node数', value: data.number_of_nodes},
        {name: 'Data Node数', value: data.number_of_data_nodes},
        {name: '活跃分片数', value: data.active_primary_shards},
        {name: '正在初始化的分片数', value: data.initializing_shards},
        {name: '未分配的分片数', value: data.unassigned_shards}
      ]
    }
  },
  actions: {
    SetClusterInfo ({commit}, data) {
      data.timed_out = data.timed_out ? 'true' : 'false'
      commit('SET_CLUSTER_INFO', data)
      commit('SET_PANEL_TSHARD', data.active_primary_shards + data.unassigned_shards)
      commit('SET_PANEL_SSHARD', data.active_primary_shards)
    },
    SetStats ({commit}, body) {
      Vue.http.post(body.url, {'host': body.host})
      .then(
        response => {
          if (response.body.result === 0) {
            commit('SET_PANEL_INDICES', response.body.data.indices)
            commit('SET_PANEL_DOCUMENTS', response.body.data.docs)
            commit('SET_PANEL_SIZE', response.body.data.size)
            commit('SET_PANEL_WIDGET')
            var statsInfo = {clusterName: response.body.data.cluster_name, timestamp: response.body.data.timestamp, versions: response.body.data.versions.join(','), jvm_versions: response.body.data.jvm_versions, uptime: response.body.data.jvm_max_uptime, systems: response.body.data.systems, threads: response.body.data.jvm_threads}
            commit('SET_STATS_INFO', statsInfo)
            var chart = {
              jvm_mem_max_use: response.body.data.jvm_mem_max_use,
              vm_mem_used: response.body.data.jvm_mem_used,
              memtotal: response.body.data.memtotal,
              memfree: response.body.data.memfree,
              memused: response.body.data.memused,
              fstotal: response.body.data.fstotal,
              fsfree: response.body.data.fsfree,
              fielddata_mem_used: response.body.data.fielddata_mem_used,
              query_cache_memory_size: response.body.data.query_cache.memory_size_in_bytes,
              cpuused: response.body.data.cpuused,
              cpufree: response.body.data.cpufree
            }
            commit('SET_CHARTS', chart)
          }
        },
        error => {
          console.log(error)
        }
      )
    },
    GetTemplateInfo ({commit}, body) {
      Vue.http.post(body.url, {'host': body.host})
      .then(
        response => {
          if (response.body.result === 0) {
            commit('SET_TEMPLATE_INFO', response.body.data)
            commit('SET_PANEL_TEMPLATES', response.body.data.count)
            commit('SET_PANEL_WIDGET')
            commit('SET_INDEX_TEMPLATE_LIST', response.body.data.tmpreflect)
          }
        },
        error => {
          console.log(error)
        }
      )
    }
  }
}
export default overviewx
