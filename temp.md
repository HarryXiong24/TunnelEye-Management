# 接口

## 发布新消息的接口

url: /submitNews
method: post
data: data

example:
{
  "title":"奥术大师大",
  "name":"asd",
  "date":"2021-04-28 10:56:14",
  "rank":"一般",
  "content":"奥术大师大",
  "plus":"sadasd"
}

备注: 接受成功需要返回一个对象，要包含一个成功码、信息，比如:
{
  msg: "发布成功"
}
