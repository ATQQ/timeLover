import ajax from '../ajax'

function getList() {
  return ajax.get('family/list')
}

function addPeople(name: string) {
  return ajax.post('family/add', {
    name
  })
}
function updatePeople(familyId: string, name: string) {
  return ajax.put(`family/update/${familyId}`, {
    name
  })
}

export default {
  getList,
  addPeople,
  updatePeople
}
