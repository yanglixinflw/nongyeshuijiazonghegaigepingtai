const dataArr = []
// const tableTitle = [
//     '设备ID', 
//     '设备名称', 
//     '设备安装地', 
//     '关联建筑物', 
//     '温度',
//     '湿度',
//     '光照',
//     '大气压',
//     '蒸发量',
//     '风向',
//     '风速',
//     '雨量',
//     '更新时间'];
for (let i = 0; i < 100; i++) {
    dataArr.push({
        DeviceId: '002342',
        DeviceName: '宁圩村气象站',
        AreaName: '杭州市-萧山区-宁围街道',
        AssociatedBuilding: '3号气象点',
        Temperature: '15',
        Humidity: '15.1',
        Illumination: '68.1',
        AirPressure: '15.2',
        Evaporation: '0.32',
        WindDirection: '112',
        WindSpeed: '2.4',
        Rainfall: '3.5',
        UpdateTime:'2018-10-16 11:59:61'
    })
}
export const Meteorology = (req, res) => {
    res.json({
        // tableTitle,
        length: dataArr.length,
        data: dataArr
    })
}
export default Meteorology;