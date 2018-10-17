const dataArr = []
//const tableTitle = ['设备ID', '设备名称', '设备安装地', '关联建筑物', '土表温度', '10cm深温度', '10cm深湿度', '20cm深温度', '20cm深湿度', '30cm深温度', '30cm深湿度', '40cm深温度', '40cm深湿度', '更新时间']
for (let i = 0; i < 100; i++) {
    dataArr.push({
        DeviceId: '1001',
        DeviceName: '宁圩村气象站',
        AreaName: '杭州萧山',
        AssociatedBuilding: '3号气象点',
        SurfaceTemp: '28℃',
        UnderTenTemp: '25℃',
        UnderTenHumidity: '25%rh',
        UnderTweTemp: '18℃',
        UnderTweHumidity: '29%rh',
        UnderThrTemp: '10℃',
        UnderThrHumidity: '36%rh',
        UnderForTemp: '1℃',
        UnderForHumidity: '45%rh',
        UpdateTime: '2018-10-15 11:11:11'
    })
}
export const Moisture = (req, res) => {
    res.json({
        length: dataArr.length,
        data: dataArr,
        // tableTitle
    })
}
export default Moisture;