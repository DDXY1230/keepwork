import _ from 'lodash'
import Cookies from 'js-cookie'
import {
  gitTree2NestedArray,
  getFileFullPathByPath,
  EMPTY_GIT_FOLDER_KEEPER
} from '@/lib/utils/gitlab'

const getters = {
  info: state => state.info,
  token: state => _.get(state, ['info', 'token'], Cookies.get('token')),
  username: (state, { token }) => {
    // handle logout
    let profileUserToken = _.get(state, 'profile.token')
    if (profileUserToken !== token) return
  
    return _.get(state, 'profile.username')
  },
  authRequestConfig: (state, { token }) =>
    token ? { headers: { Authorization: `Bearer ${token}` } } : {},

  defaultSiteDataSource: state => _.get(state, 'profile.defaultSiteDataSource'),

  gitlabConfig: (state, { defaultSiteDataSource }) => ({
    url: _.get(defaultSiteDataSource, 'rawBaseUrl'),
    token: _.get(defaultSiteDataSource, 'dataSourceToken')
  }),

  getPersonalSiteListByUsername: (state, getters, rootState, rootGetters) => username => {
    let { 'gitlab/repositoryTrees': repositoryTrees } = rootGetters
    let websitesMap = _.get(state, ['website', username])
    let siteDataSourcesMap = _.get(state, ['siteDataSource', username])

    // use websitesMap to generate personal website list
    let websiteNames = _.keys(websitesMap)

    let personalSiteList = websiteNames.map(name => {
      // use siteDataSourcesMap to get projectId and lastCommitId
      let projectId = _.get(siteDataSourcesMap, [name, 'projectId'])
      let lastCommitId = _.get(siteDataSourcesMap, [name, 'lastCommitId'])

      // use repositoryTrees to get the nested files list in certain personal site
      let rootPath = `${username}/${name}`
      let files = _.get(repositoryTrees, [projectId, rootPath], []).filter(
        ({ name }) => name !== EMPTY_GIT_FOLDER_KEEPER
      )
      let children = gitTree2NestedArray(files, rootPath)

      return {
        ...websitesMap[name],
        projectId,
        lastCommitId,
        children
      }
    })

    return personalSiteList
  },
  personalSiteList: (state, {username, getPersonalSiteListByUsername}) => {
    let personalSiteList = getPersonalSiteListByUsername(username)
    return personalSiteList
  },
  personalSitePathMap: (state, {personalSiteList}) => _.keyBy(personalSiteList, ({username, name}) => `${username}/${name}`),
  getPersonalSiteInfoByPath: (state, {personalSitePathMap}) => path => {
    let [username, name] = path.split('/').filter(x => x)
    return personalSitePathMap[`${username}/${name}`]
  },

  siteDetailInfo: state => state.siteDetailInfo,
  getSiteDetailInfoByPath: (state, {siteDetailInfo}) => path => {
    let [username, name] = path.split('/').filter(x => x)
    return siteDetailInfo[`${username}/${name}`]
  },
  getSiteDetailInfoDataSourceByPath: (state, {getSiteDetailInfoByPath}) => path => {
    let [username, sitename] = path.split('/').filter(x => x)
    let {userinfo: {dataSource: dataSourceList = []}} = getSiteDetailInfoByPath(path)
    let targetDataSource = dataSourceList.filter(dataSource => {
      return dataSource.username === username && dataSource.sitename === sitename
    })[0]
    return targetDataSource
  },

  comments: state => state.comments,
  getCommentListByPath: (state, {comments}, rootState, rootGetters) => path => {
    let fullPath = getFileFullPathByPath(path)
    return comments[fullPath]
  },
  activePageCommentList: (state, {getCommentListByPath}, rootState, rootGetters) => {
    let activePagePath = rootGetters['activePage']
    return getCommentListByPath(activePagePath)
  }
}

export default getters
