const dataArr = []
// const tableTitle = [
//     '更新时间',
//     '信息条数',
//     '报文类型',
//     '报文编号',
//     '上报时间',
//     '遥测时间',
//     '水位',
//     '管道压力',
//     '瞬时流量',
//     '年累计水量',
//     '总累计水量',
//     '总累计电量',
//     '用户编号',
//     '本次用电量',
//     '本次用水量',
//     '开泵时间',
//     '关泵时间',
//     '设备状态',
//     '三相电压',
//     '工作电压',
//     'SIM卡信号']
for (let i = 0; i < 100; i++) {
    dataArr.push({
        UpdateTime:'2018-10-16 11:59:61',
        MesNum: '1232',
        MesType: '32',
        MesCode: '1232',
        ReportTime: '2018-16-16 11:23:23',
        TelemetryTime: '2018-16-16 11:23:23',
        WaterLevel: '15',
        PipelinePressure: '15.1',
        InstantaneousFlow: '68.1',
        WaterYear: '15.2',
        WaterTotal:'66.8',
        ElectricityTotal:'1265',
        UserId:'1001',
        ThisPower:'123',
        ThisWater:'132',
        PumpingTime:'2018-10-16 11:56:30',
        PumpOffTime:'2018-10-16 11:57:30',
        DeviceStatus:'关闭',
        ThreePhasePower:'220v',
        OperatingPower:'220v',
        SIMCardSignal:'4',
    })
}
export const WellsHistory = (req, res) => {
    res.json({
        //tableTitle,
        total: dataArr.length,
        data: dataArr
    })
}
export default WellsHistory;