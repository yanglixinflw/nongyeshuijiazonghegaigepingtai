const dataArr = []
//const tableTitle = [ 
// '更新时间', 
// '土表温度', 
// '10cm深温度', 
// '10cm深湿度', 
// '20cm深温度', 
// '20cm深湿度', 
// '30cm深温度', 
// '30cm深湿度', 
// '40cm深温度', 
// '40cm深湿度', ]
for (let i = 0; i < 100; i++) {
    dataArr.push({
        SurfaceTemp: '28℃',
        UnderTenTemp: '25℃',
        UnderTenHumidity: '25%rh',
        UnderTweTemp: '18℃',
        UnderTweHumidity: '29%rh',
        UnderThrTemp: '10℃',
        UnderThrHumidity: '36%rh',
        UnderForTemp: '1℃',
        UnderForHumidity: '45%rh',
        UpdateTime: '2018-10-15 11:11:11',
    })
}
export const MoistureHistory = (req, res) => {
    res.json({
        total: dataArr.length,
        data: dataArr,
        // tableTitle
    })
}
export default MoistureHistory;