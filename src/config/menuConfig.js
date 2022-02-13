import {
    HomeOutlined,
    HighlightOutlined,
    BarsOutlined,
    MenuOutlined,
    QqOutlined,
    UsergroupDeleteOutlined,
    WechatOutlined,
    AndroidOutlined,
    AreaChartOutlined,
    UnderlineOutlined,
    AppstoreOutlined,
    EditOutlined,
    AppstoreAddOutlined,
    DragOutlined,
    PlusSquareOutlined,
    OrderedListOutlined
} from '@ant-design/icons'
const menuList = [
    {
        title: '首页', // 菜单标题名称
        key: '/home', // 对应的 path
        icon: <HomeOutlined />, // 图标名称
    },
    {
        title: '商品',
        key: '/products',
        icon: <AppstoreOutlined />,
        children: [ // 子菜单列表
            {
                title: '品类管理',
                key: '/category',
                icon: <MenuOutlined />
            },
            {
                title: '商品管理',
                key: '/product',
                icon: <MenuOutlined />
            },
        ]
    },
    {
        title: '用户管理',
        key: '/user',
        icon: <UsergroupDeleteOutlined />
    },
    {
        title: '角色管理',
        key: '/role',
        icon: <AndroidOutlined />,
    },
    {
        title: '图形图表',
        key: '/charts',
        icon: <AreaChartOutlined />,
        children: [
            {
                title: '柱形图',
                key: '/charts/bar',
                icon: <AreaChartOutlined />
            },
            {
                title: '折线图',
                key: '/charts/line',
                icon: <AreaChartOutlined />
            },
            {
                title: '饼图',
                key: '/charts/pie',
                icon: <AreaChartOutlined />
            },
        ]
    },
]
export default menuList