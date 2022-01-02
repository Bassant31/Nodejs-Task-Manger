const {calcTip} = require('../src/math')
test('calac total paid with tip',()=>{
    const total = calcTip(10,0.3)
    expect(total).toBe(13)
   /* if(total !== 13){
        throw new Error('total should = 13 we got =>'+total)
    }*/
})