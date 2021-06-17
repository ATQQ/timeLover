import ajax from '../ajax'

function getList(familyId: string) {
  return ajax.get(`/record/${familyId}`)
}

function addRecord(familyId: string, weight: number, date: Date) {
  return ajax.post(`/record/${familyId}`, {
    weight,
    date,
  })
}

function delRecord(recordId: string) {
  return ajax.delete(`/record/${recordId}`)
}

export default {
  getList,
  addRecord,
  delRecord,
}
