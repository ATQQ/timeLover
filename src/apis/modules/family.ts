import ajax from '../ajax'

function getList() {
  return ajax.get('family/list')
}

function addPeople(name: string) {
  return ajax.post('family/add', {
    name
  })
}

export default {
  getList,
  addPeople
}
