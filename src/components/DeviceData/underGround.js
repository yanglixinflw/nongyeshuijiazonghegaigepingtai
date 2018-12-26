import React ,{Fragment}from "react";
import styles from './dataAnalysis.less';
import { Select } from 'antd';
import surface from '../../assets/surface.png'
import underten from '../../assets/under10.png'
import under20 from '../../assets/under20.png'
import under40 from '../../assets/under40.png'
import surfacedark from '../../assets/surfacedark.png'
import undertendark from '../../assets/under10dark.png'
import under20dark from '../../assets/under20dark.png'
import under40dark from '../../assets/under40dark.png'
const Option = Select.Option;
export default class extends React.Component {
    constructor(props){
        super(props)
        const {shangQing} = this.props
        //console.log(shangQing);
        // console.log(data)
        let selectlist=["项家窝堡村"];
        // data.map((v)=>{
        //     selectlist.push(v.name)
        // })
        // 默认先显示第一个站点数据
        this.state={
            // 所有数据
            shangQing,
            // 选项选择
            selectlist,
            // 显示的数据
            sitdata:shangQing,
            // 点击高亮状态默认地表高亮
            clickLight:[1,0,0,0,0],
            // 鼠标经过高亮状态
            hoverLight:[0,0,0,0,0]
        }
    }
    // 获取点击的地面层数
    _clickDiv(event){
        let {clickLight}= this.state
        // 全部重置剩余点击的div为选中状态
        clickLight=[0,0,0,0,0]
        clickLight[event]=1
        this.setState({
            clickLight
        })
    }
    // 鼠标经过地层改变样式
    _hoverDiv(event){
        let {hoverLight}= this.state
        // 全部重置剩余点击的div为选中状态
        hoverLight=[0,0,0,0,0]
        hoverLight[event]=1
        this.setState({
            hoverLight
        })
    }
    // 鼠标移开时设置hover样式初始化
    _leaveDiv(){
        let {hoverLight}= this.state
        // 全部重置剩余点击的div为选中状态
        hoverLight=[0,0,0,0,0]
        this.setState({
            hoverLight
        })
    }
    // 选择不同站点
    _selectchange(v,i){
        const {shangQing}=this.state
        // 转化为数字对应
        const key=i.key-0
        this.setState({
            sitdata:shangQing[key]
        })
    }
    render() {
        const {selectlist,sitdata,clickLight,hoverLight}=this.state
        // console.log(selectlist)
        return (
           <Fragment>
               <div className={styles.centerhead}>
               <Select
                onChange={(v,i) => this._selectchange(v,i)}
                defaultValue={selectlist[0]}
              >
                {/* 选项菜单动态渲染 */}
                {
                  selectlist.length === 0 ? null
                    : selectlist.map((v, i) => {
                        return <Option value={v} key={i}>{v}</Option> 
                    })
                }
              </Select>
               </div>
               <div className={styles.groundData}
               >
                <div 
                className={styles.surface}
                onClick={()=>this._clickDiv(0)}
                onMouseOver={()=>this._hoverDiv(0)}
                onMouseLeave={()=>this._leaveDiv()}
                >
                    <img draggable='false' src={clickLight[0]||hoverLight[0]?surface:surfacedark}></img>
                    <div className={styles.item1}>
                        <span className={clickLight[0]||hoverLight[0]?styles.heightLight:null}>地表</span>
                        <div className={styles.tem}>温度{sitdata.SurfaceTemperature}℃</div>
                    </div>
                </div>
                <div 
                className={styles.under}
                onClick={()=>this._clickDiv(1)}
                onMouseOver={()=>this._hoverDiv(1)}
                onMouseLeave={()=>this._leaveDiv()}
                >
                    <img draggable='false' src={clickLight[1]||hoverLight[1]?underten:undertendark}></img>
                    <div className={styles.item2}>
                        <span className={clickLight[1]||hoverLight[1]?styles.heightLight:null}>地下10cm</span>
                        <div className={styles.tem}>温度{sitdata.SoilTemperature1}℃</div>
                        <div className={styles.wet}>湿度{sitdata.SoilHumidity1}%RH</div>
                    </div>
                </div>
                <div 
                className={styles.under}
                onClick={()=>this._clickDiv(2)}
                onMouseOver={()=>this._hoverDiv(2)}
                onMouseLeave={()=>this._leaveDiv()}
                >
                    <img draggable='false' src={clickLight[2]||hoverLight[2]?under20:under20dark}></img>
                    <div className={styles.item3}>
                        <span className={clickLight[2]||hoverLight[2]?styles.heightLight:null}>地下20cm</span>
                        <div className={styles.tem}>温度{sitdata.SoilTemperature2}℃</div>
                        <div className={styles.wet}>湿度{sitdata.SoilHumidity2}%RH</div>
                    </div>
                </div>
                <div 
                className={styles.under}
                onClick={()=>this._clickDiv(3)}
                onMouseOver={()=>this._hoverDiv(3)}
                onMouseLeave={()=>this._leaveDiv()}
                >
                    <img draggable='false' src={clickLight[3]||hoverLight[3]?underten:undertendark}></img>
                    <div className={styles.item2}>
                        <span className={clickLight[3]||hoverLight[3]?styles.heightLight:null}>地下30cm</span>
                        <div className={styles.tem}>温度{sitdata.SoilTemperature3}℃</div>
                        <div className={styles.wet}>湿度{sitdata.SoilHumidity3}%RH</div>
                    </div>
                </div>
                <div 
                className={styles.under}
                onClick={()=>this._clickDiv(4)}
                onMouseOver={()=>this._hoverDiv(4)}
                onMouseLeave={()=>this._leaveDiv()}
                >
                    <img draggable='false' src={clickLight[4]||hoverLight[4]?under40:under40dark}></img>
                    <div className={styles.item4}>
                        <span className={clickLight[4]||hoverLight[4]?styles.heightLight:null}>地下40cm</span>
                        <div className={styles.tem}>温度{sitdata.SoilTemperature4}℃</div>
                        <div className={styles.wet}>湿度{sitdata.SoilHumidity4}%RH</div>
                    </div>
                </div>
               </div>
           </Fragment>
        );
    }
}


