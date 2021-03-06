/*doc
---
title: API
name: Keepwork API
category: API
---
*/
import axios from 'axios'

export const keepworkEndpoint = axios.create({
  baseURL: process.env.KEEPWORK_API_PREFIX
})

export const post = (...args) => keepworkEndpoint.post(...args).then(res => res.data.data)

export const user = {
  login: (...args) => post('/user/login', ...args),
  getProfile: (...args) => post('/user/getProfile', ...args)
}

/*doc
---
title: website
name: website
category: API
parent: Keepwork API
---

**upsert:**
```
payload
{
  name,
  domain: name,
  visibility : "public",
  userId: 2,
  username : "dukes",
  defaultDataSourceName : "内置gitlab",
  // actually, the info below is not necessary for current usage
  // we keep it to prevent any surprise with old version keepwork
  categoryName : "个 人",
  type : "personal",
  templateName : "空模板",
  styleName : "默认样式",
  logoUrl : "http://keepwork.com/wiki/assets/imgs/wiki_blank_template.png"
}
res data
{
  ...websiteInfo,
  dataSource: { projectId }
}
```

**getDetailInfo:**
```
payload: {
  "username":"kaitlyn",
  "sitename":"site"
}
```
*/
export const website = {
  upsert: (...args) => post('website/upsert', ...args),
  getByName: (...args) => post('website/getByName', ...args),
  getAllByUsername: (...args) => post('website/getAllByUsername', ...args),
  getDetailInfo: (...args) => post('website/getDetailInfo', ...args)
}

/*doc
---
title: pages
name: pages
category: API
parent: Keepwork API
---

**star:**
```
payload: {
  url: 'kaitlyn/a1/newfolder/index',
  visitor: 'kaitlyn2'
}
```

**getDetail:**
```
payload: {
  url: 'kaitlyn/a1/newfolder/index',
  visitor: 'kaitlyn2' // username of login user or ''
}
```
*/
export const pages = {
  star: (...args) => post('pages/star', ...args),
  getDetail: (...args) => post('pages/getDetail', ...args)
}

export const siteUser = {
  getSiteListByMemberName: (...args) => post('site_user/getSiteListByMemberName', ...args)
}

export const siteDataSource = {
  getByUsername: (...args) => post('site_data_source/getByUsername', ...args)
}

/*doc
---
title: websiteComment
name: websiteComment
category: API
parent: Keepwork API
---

**create:**
```
payload: {
  "url":"/kaitlyn/site/index",
  "websiteId":90, "userId":4,
  "content":"范德萨范德萨分"
}
```

**getByPageUrl:**
```
payload: {
  "url":"/kaitlyn/site/index",
  "pageSize":10000000
}
```
*/
export const websiteComment = {
  create: (...args) => post('website_comment/create', ...args),
  getByPageUrl: (...args) => post('website_comment/getByPageUrl', ...args),
  deleteById: (...args) => post('website_comment/deleteById', ...args)
}

export const sensitiveWords = {
  query: (...args) => post('sensitive_words/query', ...args)
}

export const keepwork = {
  user,
  website,
  siteUser,
  siteDataSource,
  websiteComment,
  sensitiveWords,
  pages
}

export default keepwork
