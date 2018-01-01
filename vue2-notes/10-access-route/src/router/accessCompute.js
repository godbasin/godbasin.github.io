export default function accessCompute(permissionMap, accessKey) {
  // console.log({permissionMap, accessKey})
  //如果没有传鉴权队列，默认通过
  if (!accessKey) {
    return true
  }
  let access = false
  let keys = typeof accessKey == "string" ? [accessKey] : [...accessKey]

  // 遍历查询是否有符合的，有一个以上符合则返回true
  // 只有当所有都校验不通过的时候，才返回false
  keys.forEach(key => {
    access = access || permissionMap[key]
  })

  return access;
};
