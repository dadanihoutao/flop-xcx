//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        carWidth: '', //卡片宽度
        number: 10,
        cardData: [{
                animationData: {},
                front: '../../images/1f.png',
                back: '../../images/1z.png',
                id: '1',
                showClass: false,  // 控制翻转
                opacity: false, // 控制翻转过来以后的 opacity
                money: 1,
            },
            {
                animationData: {},
                front: '../../images/2f.png',
                back: '../../images/2z.png',
                id: '2',
                showClass: false,
                opacity: false,
                money: 2,
            },
            {
                animationData: {},
                front: '../../images/3f.png',
                back: '../../images/3z.png',
                id: '3',
                showClass: false,
                opacity: false,
                money: 3,
            },
            {
                animationData: {},
                front: '../../images/4f.png',
                back: '../../images/4z.png',
                id: '4',
                showClass: false,
                opacity: false,
                money: 4,
            },
            {
                animationData: {},
                front: '../../images/5f.png',
                back: '../../images/5z.png',
                id: '5',
                showClass: false,
                opacity: false,
                money: 5,
            },
            {
                animationData: {},
                front: '../../images/6f.png',
                back: '../../images/6z.png',
                id: '6',
                showClass: false,
                opacity: false,
                money: 6,
            },
            {
                animationData: {},
                front: '../../images/7f.png',
                back: '../../images/7z.png',
                id: '7',
                showClass: false,
                opacity: false,
                money: 7,
            },
            {
                animationData: {},
                front: '../../images/8f.png',
                back: '../../images/8z.png',
                id: '8',
                showClass: false,
                opacity: false,
                money: 8,
            },
            {
                animationData: {},
                front: '../../images/9f.png',
                back: '../../images/9z.png',
                id: '9',
                showClass: false,
                opacity: false,
                money: 9,
            },
        ],
    },
    onLoad() {
        let carWidth = 0;
        const { cardData } = this.data;
        this.addPosition(cardData); // 数组添加移动坐标位置
        wx.getSystemInfo({
            success(res) {
                carWidth = parseInt((res.windowWidth - 40) / 3);
                
            }
        })
        this.setData({
            carWidth
        })          
    },

    // 数组添加移动坐标值
    addPosition(cardData){
        const lineTotal = 3 // 单行数
        cardData.map((item, index) => {
            let x = index % lineTotal
            let y = parseInt(index / lineTotal)
            item.twoArry = { x, y }
        })
        this.setData({cardData})
    },

    //全部翻转
    allChange() {
        const { cardData } = this.data
        cardData.map(item => {
            if (!item.showClass) {
                item.showClass = true;
            }
        })
        this.setData({
            cardData
        })
    },

    //洗牌
    allMove() {
        const { carWidth, cardData } = this.data;
        // 110 是卡牌宽度加边距
        this.shuffle(carWidth) //移动到中心,  110 是牌的宽度，加上外边距边框
        let timer = setTimeout(() => {
            // 每次移动到中心位置以后，先打乱数组顺序，给数组每一项重新添加移动坐标值，setData({cardData}) 然后在散开
            cardData.sort(this.randomsort);
            this.addPosition(cardData)
            clearTimeout(timer)
            this.shuffle(0) // 间隔1秒钟，移动到原来位置
        }, 1000)
    },
    // 洗牌函数
    shuffle(translateUnit) {
        let { cardData } = this.data;
        console.log(cardData)
        cardData.map((item, index) => {
            let animation = wx.createAnimation({
                duration: 500,
                timingFunction: 'ease'
            })
            animation.export()
            const translateUnitX = translateUnit * (1 - item.twoArry.x)
            const translateUnitY = translateUnit * (1 - item.twoArry.y)
            animation.translate(translateUnitX, translateUnitY).step()
            item.animationData = animation.export()
            item.opacity = false;
            if (item.showClass) {
                item.showClass = false;
            }
        })
        this.setData({
            cardData
        })
    },

    // 打乱数组顺序
    randomsort(a, b) {
        return Math.random()>.5 ? -1 : 1;
        //用Math.random()函数生成0~1之间的随机数与0.5比较，返回-1或1
    },

    // 处理单个点击翻转
    handleCurClick(event) {
        let curId = event.currentTarget.dataset.id;
        let { cardData, number, carWidth } = this.data;
        let money = '';
        cardData.forEach(item => {
            if (item.id === curId) {
                item.showClass = true;
                money = item.money;
            }else {
                item.opacity = true
            }
        })
        number -= 1;
        this.setData({
            cardData, 
            number
        })
        setTimeout(() => {
            this.allChange()
        }, 1000);
        let _this = this;
        setTimeout(() => {
            wx.showModal({
                title: '提示',
                content: '恭喜您中奖'+ money +'元！',
                cancelText: '去看看',
                confirmText: '再翻一次',
                success(res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                        _this.shuffle(carWidth) //移动到中心,  110 是牌的宽度，加上外边距边框
                        wx.showLoading({
                            title: '获取数据中...',
                        })
                        // 这里去请求接口重新获取数据，获取成功以后调用 this.shuffle(0) 这里用
                        setTimeout(() => {
                            wx.hideLoading()
                            // 每次移动到中心位置以后，先打乱数组顺序，给数组每一项重新添加移动坐标值，setData({cardData}) 然后在散开
                            cardData.sort(_this.randomsort);
                            _this.addPosition(cardData)
                            _this.shuffle(0)
                        }, 3000)
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        }, 3000);
    }
})