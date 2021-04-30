# 接口

## 

## 出现的bug

### 接口1.2和1.4

{
  "devNo": 1,
  "devName": "下位机1",
  "devAddress": "成都地铁一号线",
  "status": 1,
  "remark": "下位机1:成都地铁一号线"
}

经测试，只能传这五个，多传就会报错
还差一个最近在线时间，待和老师讨论解决

### 接口1.3

若要删除的记录被从表关联了，则不能删除
待和老师讨论解决

## 发布新消息的接口

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

