# 接口

## 发布新消息

url: /submitNews
method: get
params: data

example: 
{
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

## 修改一个人的出勤信息

url: '/workEditor',
method: 'get',
params: data

example:
{
  "userid":1,
  "userName":"华雄",
  "sex":"男",
  "state":"在岗",
  "lockInTime":"2021-04-28T09:22:41.579Z"
}

备注: 接受成功需要返回一个对象，要包含一个成功码、信息，比如:
{
  code: 1,
  msg: "修改成功"
}

## 删除一个工人的出勤信息

url: '/deleteWorker',
method: 'get',
params: data

example:
{
  "userid":1,
  "userName":"华雄",
  "sex":"男",
  "state":"在岗",
  "clockInTime":"2020-06-01 08:00:01"
}

备注: 接受成功需要返回一个对象，要包含一个成功码、信息，比如:
{
  code: 1,
  msg: "删除成功"
}

## 新增一个工人的出勤信息

url: '/addWorker',
method: 'get',
params: data

example:
{
  "userid":"奥术大师",
  "userName":"阿斯顿",
  "sex":"男",
  "state":"在岗",
  "lockInTime":"2021-04-28T13:11:42.937Z"
}
