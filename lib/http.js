import axios from "axios";

// axios 处理请求
axios.interceptors.response.use(
  response => {
    return response.data;
  }
)

// 获取模板列表
async function getRepoList(){
  return axios.get('https://api.github.com/orgs/zhurong-cli/repos')
}

// 获取版本信息

async function getTagList(repo){
  return axios.get(`https://api.github.com/repos/zhurong-cli/${repo}/tags`)
}

// 导出
export { getRepoList, getTagList }