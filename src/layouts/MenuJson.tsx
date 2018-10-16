const MenuJson = [
  {
    name: '系统设置',
    icon: 'setting',
    path: '',
    key: 1,
    type: 0,
    children: [
      {
        name: '角色管理',
        icon: '',
        path: '/user/role',
        key: 3,
        type: 1,
      },
      {
        name: '用户管理',
        icon: '',
        path: '/user/user',
        key: 4,
        type: 1,
      },
      {
        name: '权限管理',
        icon: '',
        path: '/user/urisdiction',
        key: 5,
        type: 1,
      },
      {
        name: '二级目录',
        icon: 'pic-center',
        path: '',
        key: 6,
        type: 0,
        children: [
          {
            name: '二级页面',
            icon: '',
            path: '/users',
            key: 14,
            type: 1,
          }
      ]
      },
    ]
  }
]

export default MenuJson
