const dataArr = []
// const tableTitle = [
//     '网光',
//     '管道压力',
//     '电磁压力',
//     '限时流量',
//     '累计流量',
//     '阀门状态',
//     '更新时间',];
for (let i = 0; i < 100; i++) {
    dataArr.push({
        NetLight: '000234',
        PipelinePressure: '15',
        ElectPressure: '15.1',
        TimeLimitedTraffic: '68.1',
        CumulativeFlow: '15.2',
        ValveStatus: 'A开',
        UpdateTime:'2018-10-16 11:59:61',
    })
}
export const BallHistory = (req, res) => {
    res.json({
        // tableTitle,
        total: dataArr.length,
        data: dataArr
    })
}
export default BallHistory;