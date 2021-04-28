# 发布新消息

url: /submitNews
method: get

example: {
  title: '', // 标题
  name: '',  // 发布人
  date: '',  // 时间
  rank: '',  // 等级
  content: '', // 正文
  plus: '',  // 备注
}

备注: 接受成功需要返回一个对象，比如:
{
  code: 1,
  msg: "发布成功"
}
