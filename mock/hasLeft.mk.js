

option = {
    thead: [
        {
            min: 4,
            data: {
                text: {
                    type: 'string',
                    data: ['Q1', 'Q2']
                },
                children: [
                    {
                        min: 3,
                        data: {
                            text: {
                                type: 'string',
                                data: [
                                    '1月','2月','3月','4月','5月','6月','7月','8月',
                                    '9月','10月','11月','12月'
                                ]
                            },
                            width: 100
                        }
                    }    
                ]
            }
        }
    ],
    asideLeft: [
        {
            min: 5,
            data: {
                text: {
                    type: 'string',
                    data: ['1A', '2A', '3A', '4A','5A']
                },
                children: [
                    {
                        min: 2,
                        data:{
                            text: {
                                type: 'string',
                                data: '1-10'
                            },
                            children: [
                                {
                                    min: 1,
                                    data: {
                                        text: '1-10',
                                        children: [
                                            {
                                                min: 2,
                                                data: {
                                                    text: '1-10'
                                                }
                                            }    
                                        ]
                                    }
                                },
                                {
                                    min: 1,
                                    data: {
                                        text: '1-10'
                                    }
                                }
                            ]
                        }
                    },
                    {
                        min: 4,
                        data: {
                            text: {
                                type: 'number',
                                max: 100
                            }
                        }
                    }
                ]
            }
        }
    ],
    tbody: [
        {
            min: 50,
            data: [
                {
                    min: 13,
                    data: {
                        type: 'number',
                        length: 4
                    }
                }
            ]
        }    
    ]
};

