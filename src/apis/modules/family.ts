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

function deletePeople(familyId: string) {
  return ajax.delete(`family/delete/${familyId}`)
}

export default {
  getList,
  addPeople,
  updatePeople,
  deletePeople
}
