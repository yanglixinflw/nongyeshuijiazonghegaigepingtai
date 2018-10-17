const dataArr = []
// const tableTitle = [
//     '设备ID', 
//     '设备名称', 
//     '设备安装地', 
//     '关联建筑物', 
//     '网光',
//     '管道压力',
//     '电磁压力',
//     '限时流量',
//     '累计流量',
//     '阀门状态',
//     '更新时间'];
for (let i = 0; i < 100; i++) {
    dataArr.push({
        DeviceId: '002342',
        DeviceName: '1#阀',
        AreaName: '杭州市-萧山区-宁围街道',
        AssociatedBuilding: '1号闸阀井',
        NetLight: '000234',
        PipelinePressure: '15',
        ElectPressure: '15.1',
        TimeLimitedTraffic: '68.1',
        CumulativeFlow: '15.2',
        ValveStatus: 'A开',
        UpdateTime:'2018-10-16 14:51:41'
    })
}
export const Ball = (req, res) => {
    res.json({
        // tableTitle,
        length: dataArr.length,
        data: dataArr
    })
}
export default Ball;