import React,{Component} from 'react';
import styles from "./remoteControl.less"
const data=[
    {image:"../../assets/bg.png",introduce:"电磁阀（Electromagnetic valve）是用电磁控制的工业设备，是用来控制流体的自动化基础元件，属于执行器，并不限于液压、气动。用在工业控制系统中调整介质的方向、流量、速度和其他的参数。电磁阀可以配合不同的电路来实现预期的控制，而控制的精度和灵活性都能够保证。电磁阀有很多种，不同的电磁阀在控制系统的不同位置发挥作用，最常用的是单向阀、安全阀、方向控制阀、速度调节阀等。"},
    {image:"../../assets/bg.png",introduce:"将水由低处抽提至高处的机电设备和建筑设施的综合体。机电设备主要为水泵和动力机（通常为电动机和柴油机），辅助设备包括充水、供水、排水、通风、压缩空气、供油、起重、照明和防火等设备。建筑设施包括进水建筑物、泵房、出水建筑物、变电站和管理用房等；"},
    {image:"../../assets/bg.png",introduce:"水肥一体化技术是将灌溉与施肥融为一体的农业新技术。水肥一体化是借助压力系统（或地形自然落差），将可溶性固体或液体肥料，按土壤养分含量和作物种类的需肥规律和特点，配兑成的肥液与灌溉水一起，通过管道系统供水供肥，均匀准确地输送至作物根部区域。"},
]
export default class extends Component{
    constructor(props) {
        super(props)
        this.state={
           data
        }
    }
    render(){
        return(
            <React.Fragment>
                <div className={styles.header}>
                    <span>|</span>远程控制
                </div>
                <ul className={styles.body}>
                    {
                         this.state.data.map(function(v,i){ 
                            return <li key={i}>
                                        <a href={`/?#/remote/valveControl`}>
                                            <img src={v.image}></img>
                                            <div>{v.introduce}</div>
                                        </a>
                                    </li>
                        })
                    }
                </ul>
            </React.Fragment>
        )
    }
}