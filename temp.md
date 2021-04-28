# 接口

## 发布新消息

url: /submitNews
method: get

example: {
  "title":"奥术大师大",
  "name":"asd",
  "date":"2021-04-28T04:00:00.000Z",
  "rank":"一般",
  "content":"奥术大师大",
  "plus":"sadasd"
}

备注: 接受成功需要返回一个对象，要包含一个成功码、信息，比如:
{
  code: 1,
  msg: "发布成功"
}

## 修改一个人的班组信息

import request from '@/utils/request'

url: '/workEditor',
method: 'get',
params: date

example: {
  "userid":1,
  "userName":"华雄",
  "sex":"男",
  "state":"在岗",
  "lockInTime":"2021-04-28T09:22:41.579Z"
}

备注: 接受成功需要返回一个对象，要包含一个成功码、信息，比如:
{
  code: 1,
  msg: "发布成功"
}
