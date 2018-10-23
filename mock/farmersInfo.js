const data=[];
for(var i=0;i<50;i++){
    data.push({
        realName:'张三',
        mobilePhone:"18267913975",
        idCard:"330232******3212",
        areaId:"杭州市-萧山区-宁围街道",
        userType:"未激活",
        orgId:'13jkg1234.k23n4223w3'
    })
}
export const farmersInfo = (req, res) => {
    res.json({
        //tableTitle,
        length: data.length,
        data: data
    })
}
export default farmersInfo;