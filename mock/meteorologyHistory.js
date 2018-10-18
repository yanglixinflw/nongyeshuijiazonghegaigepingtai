const dataArr = []
// const tableTitle = [
//     '更新时间',
//     '温度',
//     '湿度',
//     '光照',
//     '大气压',
//     '蒸发量',
//     '风向',
//     '风速',
//     '雨量'];
for (let i = 0; i < 100; i++) {
    dataArr.push({
        UpdateTime:'2018-10-16 11:59:61',
        Temperature: '15',
        Humidity: '15.1',
        Illumination: '68.1',
        AirPressure: '15.2',
        Evaporation: '0.32',
        WindDirection: '112',
        WindSpeed: '2.4',
        Rainfall: '3.5',  
    })
}
export const MeteorologyHistory = (req, res) => {
    res.json({
        // tableTitle,
        length: dataArr.length,
        data: dataArr
    })
}
export default MeteorologyHistory;