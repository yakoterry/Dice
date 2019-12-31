import * as api from '@/api/auth'
import MForm from '@/components/MForm'
import { mapState } from 'vuex'
export default {
  name: 'Menu',
  components: { MForm },
  props: {},
  data() {
    return {
      edit: false,
      currentMenu: '',
      menus: {},
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      form1: {
        ref: null,
        data: {},
        rules: {},
        dialogFormVisible: false,
        currentNodeData: null,
        dialogStatus: '',
        fieldList: [{
          type: 'input',
          prop: 'groupName',
          label: '页面名称',
          required: true,
          min: 1,
          max: 20
        }, {
          type: 'input',
          prop: 'groupUrl',
          label: '页面URL'
        }, {
          type: 'input',
          prop: 'style',
          label: '风格'
        }, {
          type: 'inputNumber',
          prop: 'order',
          label: '排序',
          required: true
        }, {
          type: 'slot',
          prop: 'isDisplay',
          label: '是否显示'
        }]
      },
      form2: {
        ref: null,
        data: {},
        rules: {},
        dialogFormVisible: false,
        currentNodeData: null,
        dialogStatus: '',
        fieldList: [{
          type: 'input',
          prop: 'classesName',
          label: '页面名称',
          required: true,
          min: 1,
          max: 20
        }, {
          type: 'input',
          prop: 'classesUrl',
          label: '页面URL'
        }, {
          type: 'input',
          prop: 'style',
          label: '风格'
        }, {
          type: 'inputNumber',
          prop: 'order',
          label: '排序',
          required: true
        }, {
          type: 'slot',
          prop: 'isDisplay',
          label: '是否显示'
        }]
      },
      form3: {
        ref: null,
        data: {},
        rules: {},
        dialogFormVisible: false,
        currentNodeData: null,
        dialogStatus: '',
        fieldList: [{
          type: 'input',
          prop: 'itemName',
          label: 'code名称',
          required: true,
          min: 1,
          max: 20
        }, {
          type: 'slot',
          prop: 'itemCode',
          label: '唯一码Code',
          required: true
        }, {
          type: 'input',
          prop: 'outerUrl',
          label: '第三方URL'
        }, {
          type: 'inputNumber',
          prop: 'order',
          label: '排序',
          required: true
        }]
      },
      apiDialog: {
        currentNodeData: null,
        dialogFormVisible: false,
        title: '分配API',
        titles: ['全部', '已选'],
        props: {
          key: 'id',
          label: 'apiPath'
        },
        list: [],
        data: []
      },
      showCheckBox: false,
      itemCodes: [],
      itemCodesList: [],
      apiList: []
    }
  },
  computed: {
    ...mapState({
      subSystem: state => state.permission.allSubSystemList
    })
  },
  watch: {
    'form1.dialogFormVisible'(val) {
      const formInfo = this.form1
      if (!val) {
        // 表单验证初始化
        if (formInfo.ref) {
          formInfo.ref.resetFields()
        }
        this.form1.data = this.$initData(this.form1.fieldList)
      }
    },
    'form2.dialogFormVisible'(val) {
      const formInfo = this.form2
      if (!val) {
        // 表单验证初始化
        if (formInfo.ref) {
          formInfo.ref.resetFields()
        }
        this.form2.data = this.$initData(this.form2.fieldList)
      }
    },
    'form3.dialogFormVisible'(val) {
      const formInfo = this.form3
      if (!val) {
        // 表单验证初始化
        if (formInfo.ref) {
          formInfo.ref.resetFields()
        }
        this.form3.data = this.$initData(this.form3.fieldList)
      }
    }
  },
  async created() {
    if (!this.subSystem.length) {
      await this.$store.dispatch('permission/getAllSubSystem')
    }
    // 初始化验证规则
    this.form1.rules = this.$initRules(this.form1.fieldList)
    this.form2.rules = this.$initRules(this.form2.fieldList)
    this.form3.rules = this.$initRules(this.form3.fieldList)
    // 初始化表单数据
    this.form1.data = this.$initData(this.form1.fieldList)
    this.form2.data = this.$initData(this.form2.fieldList)
    this.form3.data = this.$initData(this.form3.fieldList)
    const path = this.$route.path
    if ((path === '/role/item' || path === '/role/show') && this.$route.query && this.$route.query.id) {
      this.showCheckBox = true
      this.initItemCodes()
      if (path === '/role/item') {
        this.edit = true
      }
    }
  },
  mounted() {},
  methods: {
    async handleClick(tab, event) {
      if (!this.menus[tab.name]) {
        try {
          const codes = await api.getItemList({ projectType: tab.name, roleId: this.$route.query.id, pageSize: -1 })
          const result = codes.data || []
          if (result && result.length) {
            const arr = []
            result.forEach(item => arr.push(item.id))
            this.itemCodesList[tab.name] = arr
          }
        } catch (error) {
          console.error(error)
        }

        api.getGroupList({ projectType: tab.name }).then(res => {
          const result = res.data || []
          this.menus[tab.name] = [{
            mainKey: 'menu',
            name: tab.label,
            children: result
          }]
          this.$forceUpdate()
        })
      }
    },
    initItemCodes() {
      const obj = {}
      this.subSystem.forEach(item => {
        obj[item.type] = []
      })
      return obj
    },
    /**
     * 打开弹窗
     * @param {number} level 菜单等级
     * @param {number} type 弹窗类型 1、新增  2、编辑
     * @param {object} data 节点数据
     */
    openDialog(level, type, data, node) {
      if (level === 1 || level === 2 || level === 3) {
        if (type === 1) {
          this[`form${level}`].dialogStatus = 'create'
          this[`form${level}`].currentNodeData = data
          this[`form${level}`].dialogFormVisible = true
          // 功能项没有isDisplay
          if (this[`form${level}`].dialogStatus === 'create' && level !== 3) {
            this[`form${level}`].data['isDisplay'] = true
          }
        } else if (type === 2) {
          this[`form${level}`].dialogStatus = 'update'
          this[`form${level}`].currentNodeData = data
          this[`form${level}`].dialogFormVisible = true
          let _api = api.getGroupSingle
          if (level === 2) _api = api.getClasses
          if (level === 3) _api = api.getItem
          _api(data.id).then(res => {
            if (res.code === 0) {
              const result = res.data
              this[`form${level}`].data['id'] = result.id
              if (level === 2) {
                this.form2.data['groupId'] = result.groupId
              }

              if (level === 3) {
                this.form3.data['classesId'] = result.classesId
              }

              Object.keys(this[`form${level}`].data).forEach(key => {
                if (result[key]) {
                  this[`form${level}`].data[key] = result[key]
                }
              })
              this[`form${level}`].data['isDisplay'] = result.isDisplay
            } else {
              this.$message({
                message: res.message,
                type: 'error'
              })
            }
          })
        }
      }
    },
    createGroup(params) {
      const data = {
        ...params,
        projectType: this.currentMenu
      }
      api.addGroup(data).then(res => {
        if (res.code === 0) {
          this.form1.dialogFormVisible = false
          const newChild = { ...res.data, children: [] }
          if (!this.form1.currentNodeData.children) {
            this.$set(this.form1.currentNodeData, 'children', [])
          }
          this.form1.currentNodeData.children.push(newChild)
          this.msgTips('success', '成功', '更新成功')
        } else {
          this.msgTips('error', '失败', res.msg)
        }
      })
    },
    createClass(params) {
      const data = {
        ...params,
        groupId: this.form2.currentNodeData.id
      }
      api.addclasses(data).then(res => {
        if (res.code === 0) {
          this.form2.dialogFormVisible = false
          const newChild = { ...res.data, children: [] }
          if (!this.form2.currentNodeData.children) {
            this.$set(this.form2.currentNodeData, 'children', [])
          }
          this.form2.currentNodeData.children.push(newChild)
          this.msgTips('success', '成功', '更新成功')
        } else {
          this.msgTips('error', '失败', res.message)
        }
      })
    },
    createItem(params) {
      const data = {
        ...params,
        classesId: this.form3.currentNodeData.id
      }
      api.addItem(data).then(res => {
        if (res.code === 0) {
          this.form3.dialogFormVisible = false
          const newChild = { ...res.data, children: [] }
          if (!this.form3.currentNodeData.children) {
            this.$set(this.form3.currentNodeData, 'children', [])
          }
          this.form3.currentNodeData.children.push(newChild)
          this.msgTips('success', '成功', '更新成功')
        } else {
          this.msgTips('error', '失败', res.msg)
        }
      })
    },
    updateGroup(params) {
      const data = {
        ...params,
        projectType: this.currentMenu
      }
      api.updateGroupSingle(data).then(res => {
        if (res.code === 0) {
          this.form1.dialogFormVisible = false
          if (res.data && res.data.name && this.form1.currentNodeData.name !== res.data.name) {
            this.$set(this.form1.currentNodeData, 'name', res.data.name)
          }
          this.msgTips('success', '成功', '更新成功')
        } else {
          this.msgTips('error', '失败', res.msg)
        }
      })
    },
    updateClass(params) {
      const data = {
        ...params
      }
      api.updateClassesSingle(data).then(res => {
        if (res.code === 0) {
          this.form2.dialogFormVisible = false
          if (res.data && res.data.name && this.form2.currentNodeData.name !== res.data.name) {
            this.$set(this.form2.currentNodeData, 'name', res.data.name)
          }
          this.msgTips('success', '成功', '更新成功')
        } else {
          this.msgTips('error', '失败', res.msg)
        }
      })
    },
    updateItem(params) {
      const data = {
        ...params
      }
      api.updateItem(data).then(res => {
        if (res.code === 0) {
          this.form3.dialogFormVisible = false
          if (res.data && res.data.name && this.form3.currentNodeData.name !== res.data.name) {
            this.$set(this.form3.currentNodeData, 'name', res.data.name)
          }
          if (res.data && res.data.itemCode && this.form3.currentNodeData.itemCode !== res.data.itemCode) {
            this.$set(this.form3.currentNodeData, 'itemCode', res.data.itemCode)
          }
          this.msgTips('success', '成功', '更新成功')
        } else {
          this.msgTips('error', '失败', res.msg)
        }
      })
    },
    submitForm(level, type) {
      if (level === 1 || level === 2 || level === 3) {
        this[`form${level}`].ref.validate((valid) => {
          if (valid) {
            if (this[`form${level}`].data.id) {
              if (level === 1) {
                this.updateGroup(this.form1.data)
              } else if (level === 2) {
                this.updateClass(this.form2.data)
              } else if (level === 3) {
                this.updateItem(this.form3.data)
              }
            } else {
              if (level === 1) {
                this.createGroup(this.form1.data)
              } else if (level === 2) {
                this.createClass(this.form2.data)
              } else if (level === 3) {
                this.createItem(this.form3.data)
              }
            }
          }
        })
      }
    },
    openApiDialog(data) {
      this.apiDialog.currentNodeData = data
      this.apiDialog.list = []
      this.apiDialog.data = []
      this.apiDialog.title = `为<i>#${data.name}#</i>分配API`
      api.getApiList({ projectType: this.currentMenu, pageSize: -1 }).then(res => {
        this.apiDialog.dialogFormVisible = true
        setTimeout(() => this.$refs.transfer.clearQuery('left') && this.$refs.transfer.clearQuery('right'), 0)
        this.apiDialog.list = res.data.list || []
        api.getApiList({ itemId: data.id, pageSize: -1 }).then(res2 => {
          const arr = res2.data.list || []
          arr.forEach(item => {
            this.apiDialog.data.push(item.id)
          })
        })
      })
    },
    saveApiForm() {
      api.saveItemApi({
        id: this.apiDialog.currentNodeData.id,
        apiIds: this.apiDialog.data || []
      }).then(res => {
        if (res.code === 0) {
          this.apiDialog.dialogFormVisible = false
          this.msgTips('success', '成功', '更新成功')
        } else {
          this.msgTips('error', '失败', res.msg)
        }
      })
    },
    /**
     * 消息提示
     */
    msgTips(type, title, msg) {
      this.$notify({
        title: title,
        message: msg,
        type: type,
        duration: 2000
      })
    },
    expandNode(level, flag) {
      const deepExpand = (arr) => {
        arr.forEach(item => {
          if (item.level !== level + 1 && flag) {
            item.expanded = true
            if (item.childNodes && item.childNodes.length) {
              deepExpand(item.childNodes)
            }
          }
          if (!flag) {
            if (item.childNodes && item.childNodes.length) {
              item.expanded = false
              deepExpand(item.childNodes)
            }
          }
        })
      }
      // this.$refs[this.currentMenu][0].store.nodesMap['menu'].expanded = flag
      deepExpand(this.$refs[this.currentMenu][0].store.root.childNodes)
    },
    getCheckedNodes() {
      if (this.currentMenu) {
        const arr = this.$refs[this.currentMenu][0].getCheckedNodes()
        const ids = []
        if (arr && arr.length) {
          arr.forEach(item => ids.push(item.id))
        }
        api.saveRoleItem({
          id: this.$route.query.id,
          projectType: this.currentMenu,
          itemIds: ids
        }).then(res => {
          if (res.code === 0) {
            this.msgTips('success', '成功', '分配成功')
          } else {
            this.msgTips('error', '分配失败', res.msg)
          }
        })
      }
    },
    getUUID(format, radix = 16) {
      let pattern = ''
      // radix: 16 => 0 ~ f || 36 => 0 ~ z
      if (typeof format === 'number') {
        for (let i = 0; i < format; i++) {
          const r = Math.floor(Math.random() * 10)
          pattern += r % 2 === 0 ? 'x' : 'y'
        }
      } else {
        pattern = format || 'xxxxxxxx-xyxx-yxxx-xxxy-xxyxxxxxxxxx'
      }
      (typeof radix !== 'number' || radix < 2 || radix > 36) && (radix = 16)
      return pattern.replace(/[xy]/g, c => {
        const r = (Math.random() * radix) | 0
        const v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(radix)
      })
    }
  }
}
