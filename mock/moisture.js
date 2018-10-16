const dataArr = []
for (let i = 0; i < 100; i++) {
    dataArr.push({
        DeviceId: '1001',
        DeviceName: '设备1',
        AreaName: '杭州萧山',
        AssociatedBuilding: '上游1',
        SurfaceTemp: '28℃',
        UnderTenTemp: '25℃',
        UnderTenHumidity: '25%rh',
        UnderTweTemp: '18℃',
        UnderTweHumidity: '29%rh',
        UnderThrTemp: '10℃',
        UnderThrHumidity: '36%rh',
        UnderForTemp: '1℃',
        UnderForHumidity: '45%rh',
        UpdateTime: '2018-10-15'
    })
}
export const Moisture = (req, res) => {
    res.json({
        length: dataArr.length,
        data: dataArr
    })
}
export default Moisture;