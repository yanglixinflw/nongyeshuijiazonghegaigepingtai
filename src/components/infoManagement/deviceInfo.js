import React, { Component } from 'react';
import styles from './index.less'
import { Form, Button, Collapse,Input ,Select,Cascader} from 'antd'
import more from '../../assets/more.png'
const Panel = Collapse.Panel;
const Item = Form.Item
const Option=Select.Option
const totalTitle = [
    '设备ID',
    '设备型号',
    '设备名称',
    '设备安装地',
    '关联建筑物',
    '地理坐标',
    '启用日期',
    '运维公司',
    '管护人员',
    '网关地址',
    '出厂编号',
    '预警规则',
    '更新时间'
]
export default class extends Component {
    constructor(props) {
        super(props)
        console.log(props)
        this.state = {
            // 显示设置可见
            showSetVisible: false,
            // 放入按钮组--默认导出数据置于按钮组中
            buttonARR: [3]
        }
    }
    //点击显示设置
    _showSetHandler() {
        this.setState({
            showSetVisible: true
        })
    }
    render() {
        let InsideButton =
            <Collapse
                className={styles.collapse}
                style={{ display: 'inline-block', position: 'relative', border: '0' }}>
                <Panel
                    header={<img src={more} className={styles.more} />}
                    key="1"
                    className={styles.moreButton}
                    style={{ position: 'absolute', border: '0', top: '-38px' }}>
                    <Button
                        icon='download'
                    >
                        导入数据
                    </Button>
                    <Button
                        icon='upload'

                    >
                        导出数据
                    </Button>
                </Panel>
            </Collapse >

        let OutsideButton =
            <span>
                <Button
                    icon='plus'
                >
                    添加
                </Button>
                <Button
                    icon='eye'
                    onClick={() => this._showSetHandler()}
                >
                    显示设置
                </Button>

            </span>
        return (
            <div>
                <div className={styles.header}>
                    <span>|</span>设备信息
                </div>
                <div className={styles.searchGroup}>
                    <SearchForm
                        wrappedComponentRef={(searchForm) => this.searchForm = searchForm}
                        searchHandler={() => this._searchTableData()}
                        resetHandler={() => this._resetForm()}
                    />
                    {OutsideButton}
                    {InsideButton}
                </div>
            </div>
        )
    }
}

// 搜索表单

const SearchForm = Form.create()(
    class extends Component {
        render() {
            const { form, searchHandler, resetHandler } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Form
                    layout='inline'
                    style={{
                        display: 'inline-block',
                        top: '-9px',
                        position: 'relative'
                    }}
                >
                    <Item
                    style={{
                        marginLeft:'10px'
                    }}
                    >
                        {getFieldDecorator('deviceId', {
                            initialValue:''
                        })
                            (
                            <Input
                                placeholder='设备ID'
                                type='text'
                            />
                            )
                        }
                    </Item>
                    <Item>
                        {getFieldDecorator('deviceTypeId', {
                        })
                            (
                            <Select
                            placeholder='请选择类型'
                            >
                            <Option value=''>全部</Option>
                            </Select>
                            )
                        }
                    </Item>
                    <Item>
                        {getFieldDecorator('name', {
                            initialValue:''
                        })
                            (
                            <Input
                                placeholder='设备名称'
                                type='text'
                            />
                            )
                        }
                    </Item>
                    <Item>
                    {getFieldDecorator('installAddrId', {
                            initialValue:''
                        })
                            (
                            <Cascader
                                placeholder='设备安装地'
                            />
                            )
                        }
                    </Item>
                    <Item>
                        {getFieldDecorator('areaName', {
                            initialValue:''
                        })
                            (
                            <Input
                                placeholder='关联建筑物'
                                type='text'
                            />
                            )
                        }
                    </Item>
                    <Item>
                        {getFieldDecorator('warningRules', {
                            initialValue:''
                        })
                            (
                            <Input
                                placeholder='预警规则'
                                type='text'
                            />
                            )
                        }
                    </Item>
                </Form>
            )
        }
    }
)



